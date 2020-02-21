#! /bin/bash

cross-env NODE_ENV=development SERVER=PTMS pm2 start build/PTMS.js

