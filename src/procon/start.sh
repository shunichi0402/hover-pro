#!/bin/bash
cd /home/pi/hover-pro/
git pull
cd src/procon/
npm i
node client.js