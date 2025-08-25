import { appName, natsConfig } from "./config";
import { getRoutes } from "./routes";

/**
 * Generates a NATS server configuration with authentication
 * @param i - The replica index (0-based)
 * @param numReplicas - Total number of replicas in the cluster
 * @returns JSON string of the NATS server configuration
 */
export function generateNatsConfig(i: number, numReplicas: number): string {
    const config = {
        listen: "0.0.0.0:4222",
        http: "0.0.0.0:8222",
        server_name: `${appName}-${i}`,
        jetstream: {
            store_dir: "/data/jetstream"
        },
        authorization: {
            users: [
                {
                    user: natsConfig.admin.username,
                    password: natsConfig.admin.password,
                    permissions: {
                        publish: ">",
                        subscribe: ">"
                    }
                },
                {
                    user: natsConfig.cluster.username,
                    password: natsConfig.cluster.password,
                    permissions: {
                        publish: { deny: ">" },
                        subscribe: { deny: ">" }
                    }
                }
            ]
        },
        cluster: numReplicas > 1 ? {
            name: "test-nats-cluster",
            listen: "0.0.0.0:6222",
            routes: getRoutes(numReplicas, i)
        } : undefined
    };

    return JSON.stringify(config, null, 2);
}
