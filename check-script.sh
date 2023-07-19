#!/bin/bash

assert_site_responding() {
  url=$1
  expected_status_code=$2

  http_status=$(curl -s -o /dev/null -w "%{http_code}" "$url")

  if [ "$http_status" -ne "$expected_status_code" ]; then
    echo "Assertion failed: Expected status code $expected_status_code but got $http_status for URL: $url" >&2
    exit 1
  else
    echo "Assertion succeeded"
  fi
}

url="https://plugnpush.github.io/DevOpsProject/t"
expected_status_code=200

assert_site_responding "$url" "$expected_status_code"
