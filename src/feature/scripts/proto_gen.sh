#!/bin/bash
set -e
PROTOC=`which protoc`

mkdir -p proto-ts

echo "Using protoc at: $PROTOC"

TS_ARGS=('lowerCaseServiceMethods=true'
         'outputEncodeMethods=false'
         'outputJsonMethods=false'
         'outputClientImpl=false'
         'snakeToCamel=true')
echo "ts_proto_opts: $(IFS=, ; echo "${TS_ARGS[*]}")"

for f in src/feature/gateway/service/*.proto
do
  echo "Generate stubs for $f file"
  protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto\
         --ts_proto_out=src/feature/proto-ts\
         --proto_path=src/feature/gateway/service\
         --ts_proto_opt="$(IFS=, ; echo "${TS_ARGS[*]}")"\
         "$f"
done