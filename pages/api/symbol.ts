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
import protobuf from "protobufjs";

export default async function handler(
  req: TypedNextApiRequest<{ services: GrpcServiceName[] }>,
  res: NextApiResponse<any>
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
          console.log(res.toObject());
          const protoMsg = res
            .getFileDescriptorProtoList_asU8()
            .map((x) => descriptor.FileDescriptorProto.decode(x));
          protoMsg.map((pj) => {
            pj.toJSON().service &&
              pj
                .toJSON()
                .service.map(
                  (ps: { name: string }) =>
                    (hashMap[`${pj.toJSON().package}.${ps.name}`] = pj)
                );
          });
          const str = descriptor.DescriptorProto.encode(
            protoMsg[0]?.messageType[0]
          ).finish();
          const s = descriptor.DescriptorProto.decode(str);
          console.log(s.$type.toJSON());
          console.log(s);
        }
      );
    })
  ).then(() => {
    return res.status(200).json({ files: hashMap });
    //  return res.send(hashMap);
  });
}
