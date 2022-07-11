import { atom, selector } from "recoil";
import { FileDescriptions } from "../pages/api/types";

export const fileState = atom<FileDescriptions["files"]>({
  key: "file",
  default: {},
});

export const fileShortSvcNameSelector = selector({
  key: "shortSvcSelector",
  get: ({ get }) =>
    Object.values(get(fileState))
      .map((f) => f.service.map((s) => s.name))
      .flat(),
});

export const fileStateFilter = atom<string>({
  key: "fileStateFilter",
  default: "",
});
