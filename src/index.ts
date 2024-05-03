import { BrowserHandler } from './infrastructure/browser/browser-handler';
import { SessionManager } from './application/session-manager';
import 'dotenv/config';

async function main() {
    const targetUrl = process.env.TARGET_URL;

    const browserHandler = new BrowserHandler();

    const sessionManager = new SessionManager(browserHandler);

    await sessionManager.manageSession(targetUrl || '');

    console.log("Execução concluída. Cheque os logs para mais detalhes.");

}

main();
