import { ServerReflectionClient } from "../gen/src/reflection_grpc_pb";
import { ServerReflectionRequest } from "../gen/src/reflection_pb";


export const reflectAsync = <T, U>(
  client: ServerReflectionClient,
  req: ServerReflectionRequest,
  cb: (a: T, ...args: any[]) => U
): Promise<ReturnType<typeof cb>> =>
  new Promise((resolve, revoke) => {
    const call = client.serverReflectionInfo();

    call.on("error", (err: Error) => {
      call.end();
      revoke(err);
    });

    call.on("data", (res: any) => {
      call.end();
      resolve(cb(res));
    });

    call.write(req);
  });
