import * as docker from "@pulumi/docker";
import { appName, networkName } from "./config";

// Create a Docker network for internal communication.
export const natsNetwork = new docker.Network(appName, {
  name: networkName,
});
