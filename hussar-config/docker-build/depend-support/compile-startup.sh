#!/bin/sh
if [ -d "/home/hussar/init/hussar-mobile" ]; then
  echo "mobile.tar exists"
  cd /home/hussar/workspace/hussar-mobile
  npm run build-ng:server &
fi

if [ -d "/home/hussar/init/hussar-mobile-uni" ]; then
  echo "hussar-mobile-uni.tar exists"
  cd /home/hussar/workspace/hussar-mobile-uni
  npm run build:server-single &
fi

cd /home/hussar/workspace/hussar-front
npm run build:server

