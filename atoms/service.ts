import { atom } from "recoil";
import { GrpcServiceName } from "../pages/api/types";

export const serviceState = atom<GrpcServiceName[]>({key:"service",default:[]})
