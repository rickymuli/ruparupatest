#!/bin/sh
BLUE='\033[0;34m'
NC='\033[0m' # No Color
PARAM=$2
cat config.json | jq '.' | less
echo "${BLUE}==>1. Refresh watchman${NC} " $2
echo "you passed me" $*
echo "you passed me" $@