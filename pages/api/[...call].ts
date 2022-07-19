import { credentials } from "@grpc/grpc-js";
import type { NextApiResponse } from "next";
import { ServerReflectionClient } from "../../gen/src/reflection_grpc_pb";
import {
  ServerReflectionRequest,
  ServerReflectionResponse,
} from "../../gen/src/reflection_pb";
import descriptor from "protobufjs/ext/descriptor";
import {
  FileDescriptions,
  GrpcServiceName,
  TypedNextApiRequest,
} from "./types";
import { reflectAsync } from "../../lib/reflect";

export default async function handler(
  req: TypedNextApiRequest<{ services: GrpcServiceName[] }>,
  res: NextApiResponse<FileDescriptions>
) {
  const client =new ServerReflectionClient(
    "127.0.0.1:50051",
    credentials.createInsecure()
  );
  console.log(req);
}
