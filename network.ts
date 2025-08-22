import * as docker from "@pulumi/docker";
import { appName } from "./config";

// Create a Docker network for internal communication between containers.
// This is necessary for containers to find each other by name.
export const natsNetwork = new docker.Network(appName, {
    name: "nats-net",
});
