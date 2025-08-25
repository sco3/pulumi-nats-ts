import { createNatsContainers } from "./containers";

const natsContainers = createNatsContainers();

// Export container names.
export const containerNames = natsContainers.map(c => c.name);
