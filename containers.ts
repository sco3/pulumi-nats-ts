import { numReplicas } from "./config";
import { createNatsContainer } from "./container";

export function createNatsContainers() {
    // Create NATS servers in a loop.
    const natsContainers = [];
    for (let i = 0; i < numReplicas; i++) {
        natsContainers.push(createNatsContainer(i));
    }
    return natsContainers;
}