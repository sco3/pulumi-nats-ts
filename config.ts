export const numReplicas = 3;
export const appName = "nats";
export const natsImage = "docker.io/nats:2.11.8-alpine3.22";
export const networkName = "nats-net";

export const natsConfig = {
    admin: {
        username: "admin",
        password: "admin-password",
    },
    cluster: {
        username: "cluster-user",
        password: "cluster-password",
    },
};
