import { appName } from "./config";

const ROUTE_PORT = 6222;

/**
 * Generates NATS cluster routes for all replicas except the current one.
 * @param totalReplicas - Total number of replicas in the cluster
 * @param currentReplicaIndex - Index of the current replica (0-based)
 * @returns Array of NATS route URLs for other replicas
 */
export function getRoutes(
  totalReplicas: number,
  currentReplicaIndex: number,
): string[] {
  const routes: string[] = [];

  for (let i = 0; i < totalReplicas; i++) {
    if (i !== currentReplicaIndex) {
      routes.push(`nats://${appName}-${i}:${ROUTE_PORT}`);
    }
  }

  return routes;
}
