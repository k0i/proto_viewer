import { atom } from "recoil";
import { GrpcPackageName } from "../pages/api/types";

export const packageState = atom<GrpcPackageName>({
  key: "package",
  default: "",
});
