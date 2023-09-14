#!/bin/bash
cd /home/pi/hover-pro/
git pull
cd /home/pi/hover-pro/src/procon/
npm i
node clinet.js