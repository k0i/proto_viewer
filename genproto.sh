#!/usr/bin/env bash

set -eu

export PATH="$PATH:$(yarn bin)"

PROTO_SRC=./proto
PROTO_DEST=./gen/src

mkdir -p ${PROTO_DEST}

npx grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:${PROTO_DEST} \
  --grpc_out=grpc_js:${PROTO_DEST} \
  --plugin=protoc-gen-grpc=$(which grpc_tools_node_protoc_plugin) \
  -I ${PROTO_SRC} \
  ${PROTO_SRC}/*

npx grpc_tools_node_protoc \
  --plugin=protoc-gen-ts=$(npm bin)/protoc-gen-ts \
  --ts_out=grpc_js:${PROTO_DEST} \
  -I ${PROTO_SRC} \
  ${PROTO_SRC}/*