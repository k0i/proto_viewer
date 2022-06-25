import { NextApiRequest } from "next";
import { FileDescriptorProto } from "protobufjs/ext/descriptor";

export type GrpcFilesHashMap = Record<
  string,
  Array<typeof FileDescriptorProto>
>;
export type GrpcServiceName = string;

export type TypedNextApiRequest<R> = Omit<NextApiRequest, "body"> & { body: R };
export interface GrpcServices {
  services: GrpcServiceName[];
}

export interface FileDescriptorResult {
  fileDescriptorResponse: { fileDescriptorProtoList: Array<string> };
}
