import { NextApiRequest } from "next";

export type GrpcServiceName = string;

export type TypedNextApiRequest<R> = Omit<NextApiRequest, "body"> & { body: R };
export interface GrpcServices {
  services: GrpcServiceName[];
}
export interface FileDescriptions {
  files: {
    [P in GrpcServiceName]: { [k: string]: any } & {
      name: string;
      service: Array<{
        method: Array<{ name: string; inputType: string; outputType: string }>;
        name: string;
      }>;
    };
  };
}
