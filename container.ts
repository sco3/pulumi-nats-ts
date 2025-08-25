import * as docker from "@pulumi/docker";
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { appName, natsImage, numReplicas } from "./config";
import { generateNatsConfig } from "./natsConfig";
import { natsNetwork } from "./network";

// Writes content to a file
function writeFileWithDirs(filePath: string, content: string): void {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, content);
}

export function createNatsContainer(i: number) {
    // Create a config file for the NATS server
    const configContent = generateNatsConfig(i, numReplicas);
    
    
    const configPath = join(process.cwd(), 'nats-config', i.toString(), 'nats.conf');
    writeFileWithDirs(configPath, configContent);
    const containerName = `${appName}-${i}`
    return new docker.Container(containerName, {
        image: natsImage,
        name: containerName,
        restart: "always",
        networksAdvanced: [{ name: natsNetwork.id }],
        command: [
            "nats-server",
            "-c", "/etc/nats/nats.conf"
        ],
        volumes: [
            {
                hostPath: `${process.cwd()}/nats-data/${i}`,
                containerPath: "/data",
            },
            {
                hostPath: configPath,
                containerPath: "/etc/nats/nats.conf"
            }
        ],
        ports: [
            { internal: 4222, external: 4222 + i },
            { internal: 8222, external: 8222 + i },
        ],
    });
}