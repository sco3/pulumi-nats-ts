import * as pulumi from "@pulumi/pulumi";
import * as docker from "@pulumi/docker";

// Define the number of nodes. Change this value.
// Set to 1 for a single node or 3+ for a cluster.
const numReplicas = 3;
const appName = "nats";
const natsImage = "docker.io/nats:2.11.8-alpine3.22";

// Create a Docker network for internal communication between containers.
// This is necessary for containers to find each other by name.
const natsNetwork = new docker.Network(appName, {
    name: "nats-net",
});

// Define the routes for the NATS cluster.
// This function is called only if there is more than one node.
const getRoutes = (replicas: number, currentIndex: number) => {
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

// Create NATS servers in a loop.
const natsContainers = Array.from({ length: numReplicas }, (_, i) => {
    // Dynamically determine the command for each node.
    const command = [
        "nats-server",
        "--name",
        `${appName}-${i}`,
        "-js", // Enable JetStream
        "--store_dir",
        "/data/jetstream",
    ];

    // Add clustering flags and routes if there is more than one node.
    if (numReplicas > 1) {
        command.push("--cluster", "nats://0.0.0.0:6222");
        command.push("--cluster_name", "test-nats-cluster");
        const routes = getRoutes(numReplicas, i);
        if (routes.length > 0) {
            command.push("--routes", routes.join(","));
        }
    }

    return new docker.Container(`${appName}-${i}`, {
        image: natsImage,
        name: `${appName}-${i}`,
        restart: "always",
        networksAdvanced: [
            {
                name: natsNetwork.id,
            },
        ],
        command: command,
        volumes: [
            {
                hostPath: `${process.cwd()}/nats-data/${i}`,
                containerPath: "/data",
            },
        ],
        ports: [
            { internal: 4222, external: 4222 + i }, // Client port
            { internal: 8222, external: 8222 + i }, // Monitoring port
        ],
    });
});

// Export container names.
export const containerNames = natsContainers.map(c => c.name);