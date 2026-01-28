#!/bin/sh

# Install Node.js using Homebrew (pre-installed on Xcode Cloud)
brew install node

# Navigate to rfe-app folder and install npm dependencies
cd "$CI_PRIMARY_REPOSITORY_PATH/rfe-app" || exit 1
npm install

# Navigate to ios folder and install CocoaPods dependencies
cd ios || exit 1
pod install
