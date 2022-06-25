import { credentials } from "@grpc/grpc-js";
import type { NextApiResponse } from "next";
import { ServerReflectionClient } from "../../gen/src/reflection_grpc_pb";
import { ServerReflectionRequest } from "../../gen/src/reflection_pb";
import descriptor from "protobufjs/ext/descriptor";
import {
  FileDescriptorResult,
  GrpcFilesHashMap,
  GrpcServiceName,
  TypedNextApiRequest,
} from "./types";

export default function handler(
  req: TypedNextApiRequest<{ services: GrpcServiceName[] }>,
  res: NextApiResponse<any>
) {
  const client = new ServerReflectionClient(
    "127.0.0.1:50051",
    credentials.createInsecure()
  );
  const hashMap: GrpcFilesHashMap = Object.create(null);

  const rpcReq = new ServerReflectionRequest();
  rpcReq.clearListServices();
  console.log(req.body);
  req.body.services.flat().map((s) => {
    const call = client.serverReflectionInfo();
    call.on("error", (err) => {
      call.end();
      console.error(err);
    });
    call.on("data", (data) => {
      call.end();
      const fdRes = data.toObject() as FileDescriptorResult;
      if (
        fdRes.fileDescriptorResponse &&
        fdRes.fileDescriptorResponse.fileDescriptorProtoList.length !== 0
      ) {
        const r = data.getFileDescriptorResponse()["array"].flat(Infinity);
        const protoStr = r.map((x: Uint8Array) =>
          descriptor.FileDescriptorProto.decode(x)
        );
        hashMap[
          `${data.getOriginalRequest().toObject().fileContainingSymbol}`
        ] = protoStr;
        console.log(hashMap);
      }
    });
    rpcReq.setFileContainingSymbol(s);
    call.write(rpcReq);
  });
  return res.status(200).json({ files: JSON.stringify(hashMap) });
}
