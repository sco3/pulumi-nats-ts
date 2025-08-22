import { appName } from "./config";

// Define the routes for the NATS cluster.
// This function is called only if there is more than one node.
export const getRoutes = (replicas: number, currentIndex: number) => {
    if (replicas <= 1) {
        return [];
    }

    const routes: string[] = [];
    for (let i = 0; i < replicas; i++) {
        if (i !== currentIndex) {
            routes.push(`nats://${appName}-${i}:6222`);
        }
    }
    return routes;
};
