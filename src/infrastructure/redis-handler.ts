import { createClient, RedisClientType } from '@node-redis/client';

export class RedisHandler {
    private static client: RedisClientType;

    constructor() {
        if (!RedisHandler.client) {
            RedisHandler.client = createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                password: process.env.REDIS_PASSWORD
            });
            this.connect();
        }
    }

    async connect(): Promise<void> {
        if (!RedisHandler.client.isOpen) {
            try {
                await RedisHandler.client.connect();
                console.log('Conexão ao Redis bem-sucedida!');
            } catch (error) {
                console.error('Erro ao conectar ao Redis:', error);
                throw error;
            }
        }
    }

    async set(key: string, value: string): Promise<void> {
        await this.connect();
        await RedisHandler.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        await this.connect();
        return await RedisHandler.client.get(key);
    }

    async del(key: string): Promise<number> {
        await this.connect();
        return await RedisHandler.client.del(key);
    }

    async incr(key: string): Promise<number> {
        await this.connect();
        return await RedisHandler.client.incr(key);
    }

    async quit(): Promise<void> {
        if (RedisHandler.client.isOpen) {
            await RedisHandler.client.quit();
            console.log("Cliente Redis desconectado.");
        } else {
            console.warn("Cliente Redis já está desconectado.");
        }
    }
}
