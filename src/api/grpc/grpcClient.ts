import {credentials} from "@grpc/grpc-js";
import {device} from "@/api/grpc/proto.js";
import {config} from "@/config/index.js";

// @ts-ignore
export const grpcClient = new device.Device(config.grpc, credentials.createInsecure())


