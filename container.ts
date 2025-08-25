import * as docker from "@pulumi/docker";
import { numReplicas, appName, natsImage } from "./config";
import { natsNetwork } from "./network";
import { getRoutes } from "./routes";

export function createNatsContainer(i: number) {
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
}