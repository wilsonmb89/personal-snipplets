#!/bin/bash

if [ -n "$REACT_APP_ENV" ]; then
    if [ "$REACT_APP_ENV" == "PR" ]; then
         export REACT_APP_ENV=dev
    fi
else
    export REACT_APP_ENV=dev
fi
