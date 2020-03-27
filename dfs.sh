#! /bin/bash

cross-env NODE_ENV=development SERVER=DFS pm2 start build/DFS.js

