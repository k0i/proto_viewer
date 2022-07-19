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
  GrpcDependencyFileName,
  TypedNextApiRequest,
} from "./types";
import { reflectAsync } from "../../lib/reflect";

export default async function handler(
  req: TypedNextApiRequest<{ dependencies: GrpcDependencyFileName[] }>,
  res: NextApiResponse<FileDescriptions>
) {
  const client = new ServerReflectionClient(
    "127.0.0.1:50051",
    credentials.createInsecure()
  );
  const hashMap = Object.create(null);

  await Promise.all(
    req.body.dependencies.map((d) => {
      const rpcReq = new ServerReflectionRequest();
      rpcReq.setFileByFilename(d);
      return reflectAsync<ServerReflectionResponse, any>(
        client,
        rpcReq,
        (pbArr) => {
          const res = pbArr.getFileDescriptorResponse();
          if (!res) {
            return;
          }
          const protoMsg = res
            .getFileDescriptorProtoList()
            .map((x) => descriptor.FileDescriptorProto.decode(x as Uint8Array));
          const protoJSON = protoMsg.map((m) => m.toJSON());
          protoJSON.map((pj) => {
            hashMap[`${pj.package}.${pj.name}`] = pj;
          });
        }
      );
    })
  ).then(() => {
    return res.status(200).json({ files: hashMap });
  });
}
