#!/bin/bash

name="$1"

if [[ -z "$name" ]]; then
  name="$(basename "$(readlink -f .)")";
fi

perl -pi -e 's/typescript-library/'$name'/g' docker-compose.yml package.json README.md tests/functional/01-basic-functionality.ts;

rm setup.sh;

npm i;

make test;
