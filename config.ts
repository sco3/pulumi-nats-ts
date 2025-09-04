export const numReplicas = 1;
export const appName = "nats";
export const natsImage = "docker.io/nats:2.11.8-alpine3.22";
export const networkName = "nats-net";

interface NatsConfig {
    admin?: {
        username: string;
        password: string;
    };
    cluster?: {
        username: string;
        password: string;
    };
}

//export const natsConfig: NatsConfig = {};

export const natsConfig: NatsConfig = {
    admin: {
        username: "admin",
        password: "admin",
    },
    cluster: {
        username: "user",
        password: "user",
    },
};
