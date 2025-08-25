import { createNatsContainers } from "./container";

const natsContainers = createNatsContainers();

// Export container names.
export const containerNames = natsContainers.map(c => c.name);
