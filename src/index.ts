import { BrowserHandler } from './infrastructure/browser-handler';
import { SessionManager } from './application/session-manager';
import { RedisHandler } from './infrastructure/redis-handler';
import 'dotenv/config';

async function main() {
    const targetUrl = process.env.TARGET_URL;

    // Criar instâncias de handlers
    const browserHandler = new BrowserHandler();
    const sessionManager = new SessionManager(browserHandler);
    const redisHandler = new RedisHandler();

    try {
        // Conectar ao Redis
        await redisHandler.connect();

        // Potencial uso do Redis para gerenciar sessões ou outros dados
        const sessionData = await redisHandler.get('sessionKey');
        if (sessionData) {
            console.log("Dados da sessão recuperados do Redis.");
            // Usar dados da sessão para realizar operações
        }

        // Gerenciar sessão com o navegador
        await sessionManager.manageSession(targetUrl || '');

        // Salvar dados da sessão de volta no Redis, se necessário
        await redisHandler.set('sessionKey', 'novoValorDaSessão');

        console.log("Execução concluída. Cheque os logs para mais detalhes.");
    } catch (error) {
        console.error('Erro durante a execução:', error);
    } finally {
        // Encerrar conexão com Redis
        await redisHandler.quit();
    }
}

main();
