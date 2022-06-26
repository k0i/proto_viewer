import { credentials } from "@grpc/grpc-js";
import type { NextApiResponse } from "next";
import { ServerReflectionClient } from "../../gen/src/reflection_grpc_pb";
import {
  ServerReflectionRequest,
  ServerReflectionResponse,
} from "../../gen/src/reflection_pb";
import descriptor from "protobufjs/ext/descriptor";
import { FileDescrptions, GrpcServiceName, TypedNextApiRequest } from "./types";
import { reflectAsync } from "../../lib/reflect";

export default async function handler(
  req: TypedNextApiRequest<{ services: GrpcServiceName[] }>,
  res: NextApiResponse<FileDescrptions>
) {
  const client = new ServerReflectionClient(
    "127.0.0.1:50051",
    credentials.createInsecure()
  );
  const hashMap = Object.create(null);

  await Promise.all(
    req.body.services.map((s) => {
      const rpcReq = new ServerReflectionRequest();
      rpcReq.setFileContainingSymbol(s);
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
            pj.service &&
              pj.service.map(
                (ps: { name: string }) =>
                  (hashMap[`${pj.package}.${ps.name}`] = pj)
              );
          });
        }
      );
    })
  ).then(() => {
    return res.status(200).json({ files: hashMap });
  });
}
