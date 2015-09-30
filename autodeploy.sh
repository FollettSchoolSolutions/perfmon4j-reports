#!/bin/bash

#if [ "$(whoami)" != 'root' ]; then
if [ "$GDMSESSION" == "gnome" ]; then
  echo "yo";
else
  echo "boo";
fi;


#!/bin/bash

#if [ "$TRAVIS_BRANCH" == "develop" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
#    echo "This will deploy!"
#  else
#    echo "This will not deploy!"
#  fi
