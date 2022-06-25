import { credentials } from "@grpc/grpc-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { ServerReflectionClient } from "../../gen/src/reflection_grpc_pb";
import {
  ServerReflectionRequest,
  ServerReflectionResponse,
} from "../../gen/src/reflection_pb";
import { reflectAsync } from "../../lib/reflect";
import { GrpcServices } from "./types";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<GrpcServices>
) {
  const client = new ServerReflectionClient(
    "127.0.0.1:50051",
    credentials.createInsecure()
  );
  const req = new ServerReflectionRequest();
  req.setListServices("1");

  return res.status(200).json(
    await reflectAsync<ServerReflectionResponse, GrpcServices>(
      client,
      req,
      (str) => {
        const res = str.getListServicesResponse();
        return res
          ? { services: res.getServiceList().map((s) => s.getName()) }
          : { services: [] };
      }
    )
  );
}
