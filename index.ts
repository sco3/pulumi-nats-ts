import { numReplicas } from "./config";
import { createNatsContainer } from "./container";

const natsContainers = Array.from({ length: numReplicas }, (_, i) => createNatsContainer(i));

// Export container names.
export const containerNames = natsContainers.map(c => c.name);
