#! /bin/bash

cross-env NODE_ENV=development SERVER=WAS pm2 start build/WAS.js

