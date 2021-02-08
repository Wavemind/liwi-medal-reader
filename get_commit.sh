#!/bin/bash
STAGING_ENV_FILE=.env
LAST_COMMIT=$(git rev-parse --short HEAD)
echo "Building app on commit $LAST_COMMIT"

if [ -f "$STAGING_ENV_FILE" ]; then
  COMMIT=`grep "COMMIT" "$STAGING_ENV_FILE" | awk -F= '{print $2}'`
  if [ -z "$COMMIT" ]; then
    echo "COMMIT key not detected in $STAGING_ENV_FILE file. Inserting last commit hash..."
    echo "COMMIT=$LAST_COMMIT" >> $STAGING_ENV_FILE
  else
    sed -i "/^COMMIT/s/=.*$/=$LAST_COMMIT/" $STAGING_ENV_FILE
  fi
fi
