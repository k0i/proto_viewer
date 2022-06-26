import { NextApiRequest } from "next";
import { FileDescriptorProto } from "protobufjs/ext/descriptor";

export type GrpcServiceName = string;

export type TypedNextApiRequest<R> = Omit<NextApiRequest, "body"> & { body: R };
export interface GrpcServices {
  services: GrpcServiceName[];
}
export interface FileDescrptions {
  files: { [P in GrpcServiceName]: { [k: string]: any } };
}
