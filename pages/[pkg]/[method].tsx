import type { GetServerSideProps, NextPage } from "next";
import descriptor from "protobufjs/ext/descriptor";
import { GrpcMethodName, GrpcPackageName, MessageType } from "../api/types";
import getRawBody from "raw-body";
import { Field, Message, Type } from "protobufjs";
import { SurfaceCall } from "@grpc/grpc-js/build/src/call";
import { credentials } from "@grpc/grpc-js";
import { ServerReflectionClient } from "../../gen/src/reflection_grpc_pb";
import protobuf from "protobufjs";
const Service: NextPage = (props: any) => {
  console.log(props);
  return <div>here</div>;
};

export default Service;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.method == "POST") {
    const body = await getRawBody(req);
    const { method, service, reqDetail, resDetail, ...rest } = JSON.parse(
      body.toString("utf-8")
    );
    const requestMessage = new Type(reqDetail.name);
    (reqDetail.field as MessageType["field"])?.forEach((f) =>
      // TODO:type conversion
      requestMessage.add(new Field(f.name, f.number, "string"))
    );
    const protoMessage = requestMessage.create(rest);
    const buf = requestMessage.encode(protoMessage).finish();
    const client = new ServerReflectionClient(
      "127.0.0.1:50051",
      credentials.createInsecure()
    );
    return new Promise((resolve, revoke) => {
      const call: SurfaceCall = client.makeUnaryRequest(
        `${service}/${method}`,
        (arg) => arg as Buffer,
        (arg) => arg,
        buf,
        (e, v) => {
          return e ? call.emit("error", e) : call.emit("data", v);
        }
      );
      call.on("error", (err: Error) => {
        call.cancel();
        revoke(err);
      });

      call.on("data", (res: any) => {
        resolve(res);
      });
    }).then((d) => {
      const resBuf = descriptor.DescriptorProto.encode(resDetail).finish();
      const resMessage = descriptor.DescriptorProto.decode(resBuf);
      const buf = resMessage.$type.decode(d as Uint8Array);
      console.log("a", resMessage.$type.toObject(buf));
      // const t = Type.fromJSON(resDetail.name, resMessage?.toJSON());
      // console.log(resMessage);
      // console.log(t);
      // const a = resMessage.decode(d as Buffer);
      // console.log(a.toJSON());
      return { props: { data: (d as Buffer).toJSON() } };
    });
  } else {
    return { props: {} };
  }
};
