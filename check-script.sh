#!/bin/bash

URL="https://plugnpush.github.io/DevOpsProject/"

response_code=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [ "$response_code" -eq 200 ]; then
  echo "The page is responding."
else
  echo "The page is not responding. Response code: $response_code"
fi