import { atom } from "recoil";
import { FileDescriptions } from "../pages/api/types";

export const depState = atom<FileDescriptions["files"]>({
  key: "dependencies",
  default: {},
});
