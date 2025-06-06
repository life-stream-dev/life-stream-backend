import {loadPackageDefinition} from "@grpc/grpc-js";
import {loadSync} from "@grpc/proto-loader";


const packageDefinition = loadSync("./service.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const protoDescriptor = loadPackageDefinition(packageDefinition)

export const device = protoDescriptor.grpc

