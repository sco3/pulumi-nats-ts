import { appName, natsConfig } from "./config";
import { getRoutes } from "./routes";

/**
 * Generates a NATS server configuration with authentication
 * @param i - The replica index (0-based)
 * @param numReplicas - Total number of replicas in the cluster
 * @returns JSON string of the NATS server configuration
 */

export function generateNatsConfig(i: number, numReplicas: number): string {
    const config: any = {

        listen: "0.0.0.0:4222",
        http: "0.0.0.0:8222",
        server_name: `${appName}-${i}`,

        jetstream: {
            // sync_interval: "always",            
            store_dir: "/data/jetstream"
        },

        cluster: numReplicas > 1 ? {
            name: "test-nats-cluster",
            listen: "0.0.0.0:6222",
            routes: getRoutes(numReplicas, i)
        } : undefined

    };

    if (Object.keys(natsConfig).length > 0) {
        config.accounts = {};
        if (natsConfig.cluster) {
            config.accounts.USERS = {
                jetstream: "enabled",
                users: [
                    {
                        user: natsConfig.cluster.username,
                        password: natsConfig.cluster.password
                    }
                ]
            };
        }
        if (natsConfig.admin) {
            config.accounts.SYS = {
                users: [{
                    user: natsConfig.admin.username,
                    password: natsConfig.admin.password
                }]
            };
            config.system_account = "SYS";
        }
    }

    return JSON.stringify(config, null, 2);
}
