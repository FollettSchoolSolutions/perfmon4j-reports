#!/bin/bash

exec /usr/bin/ssh -o StrictHostKeyChecking=no -i .travis/id_rsa "$@"
