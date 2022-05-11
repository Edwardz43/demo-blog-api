#!/bin/sh
sleep 30s
/usr/local/bin/npx prisma db push --schema=./dist/prisma/schema.prisma --accept-data-loss
/usr/local/bin/node dist/main