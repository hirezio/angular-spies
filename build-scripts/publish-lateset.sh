#!/bin/bash
set -e # exit with non-zero exit code if there are failures

F_VERSION=$1

echo "setting global bot config"
git config --global user.email shai+angular-spies-bot@hirez.io
git config --global user.name angular-spies-bot

echo "checking out temp branch"
git checkout -b travis/temp

echo "adding dist"
git add dist package.json

echo "committing with $F_VERSION"
git commit -m v$F_VERSION --no-verify

echo "setting remote"
git remote set-url origin https://angular-spies-bot:$BOT_GH_TOKEN@github.com/hirezio/angular-spies.git >/dev/null 2>/dev/null

echo "checking out latest"
git remote set-branches --add origin latest # required because travis clones with --branch=master
git fetch origin
git checkout latest

echo "merging built files"
git merge travis/temp -m v$F_VERSION -X theirs

echo "pushing"
git push origin HEAD:latest -f >/dev/null 2>/dev/null

echo "done!"