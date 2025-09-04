import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";
import { numReplicas } from "./config";
import { createNatsContainer } from "./container";

/**
 * Creates multiple NATS container instances
 * @returns A Pulumi Output containing an array of container names
 */
export function createNatsContainers(): pulumi.Output<string[]> {
  const containerNames: pulumi.Output<string>[] = [];

  for (let i = 0; i < numReplicas; i++) {
    const container = createNatsContainer(i, "1000");
    containerNames.push(container.name);
  }

  return pulumi.all(containerNames);
}
