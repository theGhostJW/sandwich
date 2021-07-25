-- |

module Test.Sandwich.Formatters.TerminalUI.CrossPlatform (
  openFileExplorerFolderPortable
  ) where

import Control.Monad
import System.Process

-- | TODO: report exceptions here
openFileExplorerFolderPortable folder = do
  void $ readCreateProcessWithExitCode (proc "xdg-open" [folder]) ""
