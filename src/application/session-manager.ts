import { BrowserHandler } from '../infrastructure/browser/browser-handler';

export class SessionManager {
    private browserHandler: BrowserHandler;

    constructor(browserHandler: BrowserHandler) {
        this.browserHandler = browserHandler;
    }

    async manageSession(url: string): Promise<void> {
        await this.browserHandler.openForManualLogin(url);
    }
}
