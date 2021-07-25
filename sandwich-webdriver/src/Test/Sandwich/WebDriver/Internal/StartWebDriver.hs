{-# LANGUAGE ConstraintKinds #-}
{-# LANGUAGE CPP #-}
{-# LANGUAGE QuasiQuotes #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE NamedFieldPuns #-}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE UndecidableInstances #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE OverloadedLists #-}
{-# LANGUAGE ViewPatterns #-}

module Test.Sandwich.WebDriver.Internal.StartWebDriver where


import Control.Concurrent
import Control.Monad
import Control.Monad.Catch (MonadMask)
import Control.Monad.IO.Class
import Control.Monad.Logger
import Control.Monad.Trans.Control (MonadBaseControl)
import Control.Retry
import qualified Data.Aeson as A
import Data.Default
import Data.Function
import qualified Data.HashMap.Strict as HM
import qualified Data.List as L
import Data.Maybe
import Data.String.Interpolate
import qualified Data.Text as T
import qualified Data.Text.IO as T
import qualified Data.Vector as V
import GHC.Stack
import Lens.Micro
import Lens.Micro.Aeson
import System.Directory
import System.FilePath
import System.IO
import System.Process
import Test.Sandwich
import Test.Sandwich.WebDriver.Internal.Binaries
import Test.Sandwich.WebDriver.Internal.Ports
import Test.Sandwich.WebDriver.Internal.StartWebDriver.Xvfb
import Test.Sandwich.WebDriver.Internal.Types
import Test.Sandwich.WebDriver.Internal.Util
import qualified Test.WebDriver as W


type Constraints m = (HasCallStack, MonadLogger m, MonadIO m, MonadBaseControl IO m, MonadMask m)

-- | Spin up a Selenium WebDriver and create a WebDriver
startWebDriver :: Constraints m => WdOptions -> FilePath -> m WebDriver
startWebDriver wdOptions@(WdOptions {..}) runRoot = do
  -- Create a unique name for this webdriver so the folder for its log output doesn't conflict with any others
  webdriverName <- ("webdriver_" <>) <$> (liftIO makeUUID)

  -- Directory to log everything for this webdriver
  let webdriverRoot = runRoot </> (T.unpack webdriverName)
  liftIO $ createDirectoryIfMissing True webdriverRoot

  -- Get selenium and chromedriver
  debug [i|Preparing to create the Selenium process|]
  liftIO $ createDirectoryIfMissing True toolsRoot
  seleniumPath <- obtainSelenium toolsRoot seleniumToUse >>= \case
    Left err -> error [i|Failed to obtain selenium: '#{err}'|]
    Right p -> return p
  driverArgs <- case W.browser capabilities of
    W.Firefox {} -> do
      obtainGeckoDriver toolsRoot geckoDriverToUse >>= \case
        Left err -> error [i|Failed to obtain geckodriver: '#{err}'|]
        Right p -> return [[i|-Dwebdriver.gecko.driver=#{p}|]
                          -- , [i|-Dwebdriver.gecko.logfile=#{webdriverRoot </> "geckodriver.log"}|]
                          -- , [i|-Dwebdriver.gecko.verboseLogging=true|]
                          ]
    W.Chrome {} -> do
      obtainChromeDriver toolsRoot chromeDriverToUse >>= \case
        Left err -> error [i|Failed to obtain chromedriver: '#{err}'|]
        Right p -> return [[i|-Dwebdriver.chrome.driver=#{p}|]
                          , [i|-Dwebdriver.chrome.logfile=#{webdriverRoot </> "chromedriver.log"}|]
                          , [i|-Dwebdriver.chrome.verboseLogging=true|]]
    x -> error [i|Browser #{x} is not supported yet|]

  debug [i|driverArgs: #{driverArgs}|]

  (maybeXvfbSession, javaEnv) <- case runMode of
    RunInXvfb (XvfbConfig {..}) -> do
      (s, e) <- makeXvfbSession xvfbResolution xvfbStartFluxbox webdriverRoot
      return (Just s, Just e)
    _ -> return (Nothing, Nothing)

  -- Retry up to 10 times
  -- This is necessary because sometimes we get a race for the port we get from findFreePortOrException.
  -- There doesn't seem to be any way to make Selenium choose its own port.
  let policy = constantDelay 0 <> limitRetries 10
  recoverAll policy $ \retryStatus -> do
    when (rsIterNumber retryStatus > 0) $
      warn [i|Trying again to start selenium server|]

    -- Create a distinct process name
    webdriverProcessName <- ("webdriver_process_" <>) <$> (liftIO makeUUID)
    let webdriverProcessRoot = webdriverRoot </> T.unpack webdriverProcessName
    liftIO $ createDirectoryIfMissing True webdriverProcessRoot
    startWebDriver' wdOptions webdriverName webdriverProcessRoot seleniumPath driverArgs maybeXvfbSession javaEnv

startWebDriver' wdOptions@(WdOptions {capabilities=capabilities', ..}) webdriverName webdriverRoot seleniumPath driverArgs maybeXvfbSession javaEnv = do
  port <- liftIO findFreePortOrException
  let wdCreateProcess = (proc "java" (driverArgs <> ["-jar", seleniumPath
                                                    , "-port", show port])) { env = javaEnv }

  -- Open output handles
  let seleniumOutPath = webdriverRoot </> seleniumOutFileName
  hout <- liftIO $ openFile seleniumOutPath AppendMode
  let seleniumErrPath = webdriverRoot </> seleniumErrFileName
  herr <- liftIO $ openFile seleniumErrPath AppendMode

  -- Start the process and wait for it to be ready
  debug [i|Starting the Selenium process|]
  (_, _, _, p) <- liftIO $ createProcess $ wdCreateProcess {
    std_in = Inherit
    , std_out = UseHandle hout
    , std_err = UseHandle herr
    , create_group = True
    }
  -- Normally Selenium prints the ready message to stderr. However, when we're running under
  -- XVFB the two streams get combined and sent to stdout; see
  -- https://bugs.launchpad.net/ubuntu/+source/xorg-server/+bug/1059947
  -- As a result, we poll both files
  let readyMessage = "Selenium Server is up and running"
  -- Retry every 60ms, for up to 60s before admitting defeat
  let policy = constantDelay 60000 <> limitRetries 1000
  success <- retrying policy (\_retryStatus result -> return (not result)) $ const $
    (liftIO $ T.readFile seleniumErrPath) >>= \case
      t | readyMessage `T.isInfixOf` t -> return True
      _ -> (liftIO $ T.readFile seleniumOutPath) >>= \case
        t | readyMessage `T.isInfixOf` t -> return True
        _ -> return False
  unless success $ liftIO $ do
    interruptProcessGroupOf p >> waitForProcess p
    error [i|Selenium server failed to start after 60 seconds|]

  -- Make the WebDriver
  WebDriver <$> pure (T.unpack webdriverName)
            <*> pure (hout, herr, p, seleniumOutPath, seleniumErrPath, maybeXvfbSession)
            <*> pure wdOptions
            <*> liftIO (newMVar mempty)
            <*> pure (def { W.wdPort = fromIntegral port
                          , W.wdCapabilities = configureCapabilities capabilities' runMode
                          , W.wdHTTPManager = httpManager
                          , W.wdHTTPRetryCount = httpRetryCount
                          })


stopWebDriver :: Constraints m => WebDriver -> m ()
stopWebDriver (WebDriver {wdWebDriver=(hout, herr, h, _, _, maybeXvfbSession)}) = do
  _ <- liftIO (interruptProcessGroupOf h >> waitForProcess h)
  liftIO $ hClose hout
  liftIO $ hClose herr

  whenJust maybeXvfbSession $ \(XvfbSession {..}) -> do
    whenJust xvfbFluxboxProcess $ \p ->
      liftIO (interruptProcessGroupOf p >> waitForProcess p)

    liftIO (interruptProcessGroupOf xvfbProcess >> waitForProcess xvfbProcess)

-- * Util

seleniumOutFileName, seleniumErrFileName :: FilePath
seleniumOutFileName = "stdout.txt"
seleniumErrFileName = "stderr.txt"

-- | Add headless configuration to the Chrome browser
configureCapabilities caps@(W.Capabilities {W.browser=browser@(W.Chrome {..})}) (RunHeadless (HeadlessConfig {..})) = caps { W.browser = browser' }
  where browser' = browser { W.chromeOptions = "--headless":resolution:chromeOptions }
        resolution = [i|--window-size=#{w},#{h}|]
        (w, h) = fromMaybe (1920, 1080) headlessResolution

-- | Add headless configuration to the Firefox capabilities
configureCapabilities caps@(W.Capabilities {W.browser=(W.Firefox {..}), W.additionalCaps=ac}) (RunHeadless (HeadlessConfig {..})) = caps { W.additionalCaps = additionalCaps }
  where
    additionalCaps = case L.findIndex (\x -> fst x == "moz:firefoxOptions") ac of
      Nothing -> ("moz:firefoxOptions", A.object [("args", A.Array ["-headless"])]) : ac
      Just i -> let ffOptions' = (snd $ ac !! i)
                      & ensureKeyExists "args" (A.Array [])
                      & ((key "args" . _Array) %~ addHeadlessArg) in
        L.nubBy (\x y -> fst x == fst y) (("moz:firefoxOptions", ffOptions') : ac)

    ensureKeyExists :: T.Text -> A.Value -> A.Value -> A.Value
    ensureKeyExists key _ val@(A.Object (HM.lookup key -> Just _)) = val
    ensureKeyExists key defaultVal (A.Object m@(HM.lookup key -> Nothing)) = A.Object (HM.insert key defaultVal m)
    ensureKeyExists _ _ _ = error "Expected Object in ensureKeyExists"

    addHeadlessArg :: V.Vector A.Value -> V.Vector A.Value
    addHeadlessArg xs | (A.String "-headless") `V.elem` xs = xs
    addHeadlessArg xs = (A.String "-headless") `V.cons` xs

configureCapabilities browser (RunHeadless {}) = error [i|Headless mode not yet supported for browser '#{browser}'|]
configureCapabilities browser _ = browser
