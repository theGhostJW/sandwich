{-# LANGUAGE LambdaCase #-}
{-# LANGUAGE RecordWildCards #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE CPP #-}
{-# LANGUAGE RankNTypes #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TypeOperators #-}
{-# LANGUAGE FlexibleContexts #-}

module Test.Sandwich.ArgParsing where

import Control.Monad.Logger
import Data.Function
import qualified Data.List as L
import Data.Maybe
import qualified Data.Text as T
import Data.Time.Clock.POSIX
import Data.Typeable
import Options.Applicative
import qualified Options.Applicative as OA
import System.IO
import Test.Sandwich.Formatters.FailureReport
import Test.Sandwich.Formatters.Print.Types
import Test.Sandwich.Formatters.Silent
import Test.Sandwich.Formatters.TerminalUI
import Test.Sandwich.Formatters.TerminalUI.Types
import Test.Sandwich.Internal.Running
import Test.Sandwich.Options
import Test.Sandwich.Types.ArgParsing
import Test.Sandwich.Types.RunTree
import Test.Sandwich.Types.Spec

#if MIN_VERSION_time(1,9,0)
import Data.Time.Format.ISO8601
formatTime = T.unpack . T.replace ":" "_" . T.pack . iso8601Show
#else
formatTime = show
#endif


commandLineOptionsWithInfo :: Parser a -> Parser (Maybe IndividualTestModule) -> ParserInfo (CommandLineOptions a)
commandLineOptionsWithInfo userOptionsParser individualTestParser = OA.info (mainCommandLineOptions userOptionsParser individualTestParser <**> helper)
  (
    fullDesc
    <> progDesc "Run tests with Sandwich"
    <> header "Sandwich test runner"
  )

quickCheckOptionsWithInfo :: ParserInfo CommandLineQuickCheckOptions
quickCheckOptionsWithInfo = OA.info (commandLineQuickCheckOptions mempty <**> helper)
  (
    briefDesc
    <> header "Special options used by sandwich-quickcheck.\n\nIf a flag is passed, it will override the value in the QuickCheck option configured in the code."
  )

slackOptionsWithInfo :: ParserInfo CommandLineSlackOptions
slackOptionsWithInfo = OA.info (commandLineSlackOptions mempty <**> helper)
  (
    briefDesc
    <> header "Special options passed to the Slack formatter.\n\nIf a flag is passed, it will override the value in the SlackFormatter configured in the code."
  )

webDriverOptionsWithInfo :: ParserInfo CommandLineWebdriverOptions
webDriverOptionsWithInfo = OA.info (commandLineWebdriverOptions mempty <**> helper)
  (
    fullDesc
    <> progDesc "Special options passed to the WebDriver formatter, if present.\n\nIf a flag is passed, it will override the value in the WdOptions configured in the code."
    <> header "WebDriver flags"
  )

mainCommandLineOptions :: Parser a -> Parser (Maybe IndividualTestModule) -> Parser (CommandLineOptions a)
mainCommandLineOptions userOptionsParser individualTestParser = CommandLineOptions
  <$> formatter
  <*> logLevel
  <*> optional (strOption (long "filter" <> short 'f' <> help "Filter test tree by string matching text example labels" <> metavar "STRING"))
  <*> option auto (long "repeat" <> short 'r' <> showDefault <> help "Repeat the test N times and report how many failures occur" <> value 1 <> metavar "INT")
  <*> optional (strOption (long "fixed-root" <> help "Store test artifacts at a fixed path" <> metavar "STRING"))
  <*> optional (flag False True (long "dry-run" <> help "Skip actually launching the tests. This is useful if you want to see the set of the tests that would be run, or start them manually in the terminal UI."))

  <*> optional (flag False True (long "list-tests" <> help "List individual test modules"))
  <*> optional (flag False True (long "print-quickcheck-flags" <> help "Print the additional QuickCheck flags"))
  <*> optional (flag False True (long "print-slack-flags" <> help "Print the additional Slack flags"))
  <*> optional (flag False True (long "print-webdriver-flags" <> help "Print the additional Webdriver flags"))

  <*> individualTestParser

  <*> commandLineQuickCheckOptions internal
  <*> commandLineSlackOptions internal
  <*> commandLineWebdriverOptions internal

  <*> userOptionsParser

formatter :: Parser FormatterType
formatter =
  flag' Print (long "print" <> help "Print to stdout")
  <|> flag' PrintFailures (long "print-failures" <> help "Print failures only to stdout")
  <|> flag' TUI (long "tui" <> help "Open terminal UI app")
  <|> flag' Silent (long "silent" <> help "Run silently (print the run root only)")
  <|> flag Auto Auto (long "auto" <> help "Automatically decide which formatter to use")

logLevel :: Parser (Maybe LogLevel)
logLevel =
  flag' (Just LevelDebug) (long "debug" <> help "Log level DEBUG")
  <|> flag' (Just LevelInfo) (long "info" <> help "Log level INFO")
  <|> flag' (Just LevelWarn) (long "warn" <> help "Log level WARN")
  <|> flag (Just LevelWarn) (Just LevelError) (long "error" <> help "Log level ERROR")

commandLineWebdriverOptions :: (forall f a. Mod f a) -> Parser CommandLineWebdriverOptions
commandLineWebdriverOptions maybeInternal = CommandLineWebdriverOptions
  <$> optional (browserToUse maybeInternal)
  <*> optional (display maybeInternal)
  <*> flag False True (long "fluxbox" <> help "Launch fluxbox as window manager when using Xvfb" <> maybeInternal)
  <*> flag False True (long "individual-videos" <> help "Record individual videos of each test (requires ffmpeg and Xvfb)" <> maybeInternal)
  <*> flag False True (long "error-videos" <> help "Record videos of each test but delete them unless there was an exception" <> maybeInternal)

browserToUse :: (forall f a. Mod f a) -> Parser BrowserToUse
browserToUse maybeInternal =
  flag' UseFirefox (long "firefox" <> help "Use Firefox" <> maybeInternal)
  <|> flag UseChrome UseChrome (long "chrome" <> help "Use Chrome (default)" <> maybeInternal)

display :: (forall f a. Mod f a) -> Parser DisplayType
display maybeInternal =
  flag' Current (long "current" <> help "Open browser in current display (default)" <> maybeInternal)
  <|> flag' Headless (long "headless" <> help "Open browser in headless mode" <> maybeInternal)
  <|> flag Current Xvfb (long "xvfb" <> help "Open browser in Xvfb session" <> maybeInternal)

commandLineQuickCheckOptions :: (forall f a. Mod f a) -> Parser CommandLineQuickCheckOptions
commandLineQuickCheckOptions maybeInternal = CommandLineQuickCheckOptions
  <$> optional (option auto (long "quickcheck-seed" <> help "QuickCheck seed" <> metavar "INT" <> maybeInternal))
  <*> optional (option auto (long "quickcheck-max-discard-ratio" <> help "Maximum number of discarded tests per successful test before giving up" <> metavar "INT" <> maybeInternal))
  <*> optional (option auto (long "quickcheck-max-size" <> help "Size to use for the biggest test cases" <> metavar "INT" <> maybeInternal))
  <*> optional (option auto (long "quickcheck-max-success" <> help "Maximum number of successful tests before succeeding" <> metavar "INT" <> maybeInternal))
  <*> optional (option auto (long "quickcheck-max-shrinks" <> help "Maximum number of shrinks before giving up" <> metavar "INT" <> maybeInternal))

commandLineSlackOptions :: (forall f a. Mod f a) -> Parser CommandLineSlackOptions
commandLineSlackOptions maybeInternal = CommandLineSlackOptions
  <$> optional (strOption (long "slack-token" <> help "Slack token to use with the Slack formatter" <> metavar "STRING" <> maybeInternal))
  <*> optional (strOption (long "slack-channel" <> help "Slack channel to use with the Slack formatter" <> metavar "STRING" <> maybeInternal))

  <*> optional (strOption (long "slack-top-message" <> help "Top message to display on Slack progress bars" <> metavar "STRING" <> maybeInternal))

  <*> optional (option auto (long "slack-max-failures" <> help "Maximum number of failures to include in a message" <> metavar "INT" <> maybeInternal))
  <*> optional (option auto (long "slack-max-failure-reason-lines" <> help "Maximum number of lines for the failure reason underneath a failure" <> metavar "INT" <> maybeInternal))
  <*> optional (option auto (long "slack-max-callstack-lines" <> help "Maximum number of lines for the callstack reason underneath a failure" <> metavar "INT" <> maybeInternal))

  <*> optional (option auto (long "slack-visibility-threshold" <> help "Filter the headings on failures by visibility threshold" <> metavar "INT" <> maybeInternal))

  <*> optional (option auto (long "slack-max-message-size" <> help "Maximum message size in bytes (default: 8192)" <> metavar "INT" <> maybeInternal))

-- * Parse command line args

parseCommandLineArgs :: forall a. (Typeable a) => Parser a -> TopSpecWithOptions' a -> IO (CommandLineOptions a)
parseCommandLineArgs parser spec = do
  (clo, _, _) <- parseCommandLineArgs' parser spec
  return clo

parseCommandLineArgs' :: forall a. (Typeable a) => Parser a -> TopSpecWithOptions' a -> IO (
  CommandLineOptions a
  , Mod FlagFields (Maybe IndividualTestModule) -> Parser (Maybe IndividualTestModule)
  , [(NodeModuleInfo, T.Text)]
  )
parseCommandLineArgs' userOptionsParser spec = do
  let modulesAndShorthands = gatherMainFunctions (spec :: SpecFree (LabelValue "commandLineOptions" (CommandLineOptions a) :> BaseContext) IO ())
                           & L.sortOn nodeModuleInfoModuleName
                           & gatherShorthands
  let individualTestFlags maybeInternal =
        [[ Just $ flag' (Just $ IndividualTestModuleName nodeModuleInfoModuleName)
                        (long (T.unpack shorthand)
                          <> help (nodeModuleInfoModuleName
                          <> (if isJust nodeModuleInfoFn then "*" else ""))
                          <> maybeInternal)
         , case nodeModuleInfoFn of
             Nothing -> Nothing
             Just fn -> Just $ flag' (Just $ IndividualTestMainFn fn)
                                     (long (T.unpack (shorthand <> "-main"))
                                       <> help nodeModuleInfoModuleName
                                       <> internal
                                     )
         ]
        | (NodeModuleInfo {..}, shorthand) <- modulesAndShorthands]
  let individualTestParser maybeInternal = foldr (<|>) (pure Nothing) (catMaybes $ mconcat $ individualTestFlags maybeInternal)

  clo <- OA.execParser (commandLineOptionsWithInfo userOptionsParser (individualTestParser internal))
  return (clo, individualTestParser, modulesAndShorthands)

-- * Merge command line args with base options

addOptionsFromArgs :: Options -> CommandLineOptions a -> IO (Options, Int)
addOptionsFromArgs baseOptions (CommandLineOptions {..}) = do
  let printFormatter = SomeFormatter $ defaultPrintFormatter { printFormatterLogLevel = optLogLevel }
  let failureReportFormatter = SomeFormatter $ defaultFailureReportFormatter { failureReportLogLevel = optLogLevel }
  let tuiFormatter = SomeFormatter $ defaultTerminalUIFormatter { terminalUILogLevel = optLogLevel }
  let silentFormatter = SomeFormatter defaultSilentFormatter

  maybeMainFormatter <- case (optRepeatCount, optFormatter) of
    (x, _) | x /= 1 -> return $ Just printFormatter
    (_, Auto) -> hIsTerminalDevice stdout >>= \case
      True -> return $ Just printFormatter
      False -> return $ Just tuiFormatter
    (_, TUI) -> return $ Just tuiFormatter
    (_, Print) -> return $ Just printFormatter
    (_, PrintFailures) -> return $ Just failureReportFormatter
    (_, Silent) -> return $ Just silentFormatter

  -- Strip out any "main" formatters since the options control that
  let baseFormatters = optionsFormatters baseOptions
                     & filter (not . isMainFormatter)

  let options = baseOptions {
    optionsTestArtifactsDirectory = case optFixedRoot of
      Nothing -> TestArtifactsGeneratedDirectory "test_runs" (formatTime <$> getCurrentTime)
      Just path -> TestArtifactsFixedDirectory path
    , optionsFilterTree = TreeFilter <$> optTreeFilter
    , optionsFormatters = baseFormatters <> catMaybes [maybeMainFormatter]
    , optionsDryRun = fromMaybe (optionsDryRun baseOptions) optDryRun
    }

  return (options, optRepeatCount)

  where
    isMainFormatter :: SomeFormatter -> Bool
    isMainFormatter (SomeFormatter x) = case cast x of
      Just (_ :: PrintFormatter) -> True
      Nothing -> case cast x of
        Just (_ :: TerminalUIFormatter) -> True
        Nothing -> False
