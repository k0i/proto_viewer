import { NextApiRequest } from "next";

export type GrpcPackageName = string;
export type GrpcServiceName = string;
export type GrpcMethodName = string;
export type GrpcDependencyFileName = string;

export type TypedNextApiRequest<R> = Omit<NextApiRequest, "body"> & { body: R };
export interface GrpcServices {
  services: GrpcServiceName[];
}
export interface MessageType {
  name: string;
  field: { name: string; number: number; type: GrpcFieldType }[];
}
export type GrpcFieldType =
  | "TYPE_STRING"
  | "TYPE_ENUM"
  | "TYPE_MESSAGE"
  | "TYPE_INT32";
export interface FileDescriptions {
  files: {
    [P in GrpcServiceName]: { [k: string]: any } & {
      name: string;
      service: Array<{
        method: Array<{
          name: GrpcMethodName;
          inputType: string;
          outputType: string;
        }>;
        name: string;
      }>;
      package: GrpcPackageName;
      messageType: MessageType[];
    };
  };
}



