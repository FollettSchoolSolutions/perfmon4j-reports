#!/bin/bash

#if [ "$(whoami)" != 'root' ]; then
if ([ "$GDMSESSION" == "gnome" ] && [ "$LOGNAME" == "dev" ]); then
  echo "YIS";
else
  echo "NO";
fi;


#!/bin/bash

#if [ "$TRAVIS_BRANCH" == "develop" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
#    echo "This will deploy!"
#  else
#    echo "This will not deploy!"
#  fi
