#!/bin/bash

# Define the base directory for proto files and the output directory for the generated types
PROTO_DIR="src/proto"
OUT_DIR="src/proto_build"

# Remove the old proto_build directory if it exists
echo "Removing old proto build directory..."
rm -rf $OUT_DIR

# Ensure the output directory exists
mkdir -p $OUT_DIR

# Function to compile proto files from a specific subdirectory
generate_types() {
    local sub_dir=$1
    echo "Generating gRPC definitions for $sub_dir..."

    # Create the output subdirectory
    mkdir -p "$OUT_DIR/$sub_dir"

    # Find all .proto files in the subdirectory and run the proto-loader-gen-types tool
    find "$PROTO_DIR/$sub_dir" -name '*.proto' | xargs proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir="$OUT_DIR/$sub_dir"
}

# Generate types for subdirectories first due to dependencies
echo "Generating gRPC definitions for subdirectories..."
generate_types "auth"
generate_types "e_commerce"
generate_types "booking"

echo "Proto files have been compiled successfully!"
# chmod +x ./scripts/gen_proto.sh
# "proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=src/proto-build src/proto/*.proto"