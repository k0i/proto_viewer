import { credentials } from "@grpc/grpc-js";
import { Field, Type } from "protobufjs";
import { SurfaceCall } from "@grpc/grpc-js/build/src/call";
import { ServerReflectionClient } from "../../gen/src/reflection_grpc_pb";

export default async function handler() {
  const client = new ServerReflectionClient(
    "127.0.0.1:50051",
    credentials.createInsecure()
  );
}
