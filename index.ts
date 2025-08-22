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
    return ["--routes", routes.join(",")];
};

// Create NATS servers in a loop.
const natsContainers = Array.from({ length: numReplicas }, (_, i) => {
    // Dynamically determine the command for each node.
    const command = [
        "nats-server",
        "-js", // Enable JetStream
    ];

    // Add clustering flags and routes if there is more than one node.
    if (numReplicas > 1) {
        command.push("--cluster", `nats://${appName}-${i}:6222`, ...getRoutes(numReplicas, i));
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
        ports: i === 0 ? [
            { internal: 4222, external: 4222 }, // Client port (only for the first node)
            { internal: 8222, external: 8222 }, // Monitoring port (only for the first node)
        ] : [],
    });
});

// Export container names.
export const containerNames = natsContainers.map(c => c.name);