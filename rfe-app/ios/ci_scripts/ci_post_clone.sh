#!/bin/sh

# Navigate to ios folder and install CocoaPods dependencies
cd "$CI_PRIMARY_REPOSITORY_PATH/rfe-app/ios" || exit 1
pod install
