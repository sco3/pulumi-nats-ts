import { natsContainers } from "./container";

// Export container names.
export const containerNames = natsContainers.map(c => c.name);
