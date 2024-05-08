import { BrowserHandler } from './infrastructure/browser-handler';
import { SessionManager } from './application/session-manager';
import { RedisHandler } from './infrastructure/redis-handler';
import 'dotenv/config';

async function main() {
    const targetUrl = process.env.TARGET_URL;

    const browserHandler = new BrowserHandler();
    const sessionManager = new SessionManager(browserHandler);
    const redisHandler = new RedisHandler();

    try {
        await redisHandler.connect();

        const sessionData = await redisHandler.get('sessionKey');
        if (sessionData) {
            console.log("Dados da sessão recuperados do Redis.");
        }

        await sessionManager.manageSession(targetUrl || '');

        await redisHandler.set('sessionKey', 'novoValorDaSessão');

        console.log("Execução concluída. Cheque os logs para mais detalhes.");
    } catch (error) {
        console.error('Erro durante a execução:', error);
    } finally {
        await redisHandler.quit();
    }
}

main();
