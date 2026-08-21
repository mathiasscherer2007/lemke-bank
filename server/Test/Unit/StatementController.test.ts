import { strict as assert } from 'node:assert';
import { describe, test, beforeEach, afterEach } from 'node:test';
import { StatementController } from '../../App/Http/Controller/StatementController.js';
import { StatementGenerationService } from '../../App/Service/StatementGenerationService.js';

describe('StatementController generateStatementLinks', () => {
    let service!: StatementGenerationService;
    let controller!: StatementController;
    let RealDate!: DateConstructor;
    let fixedDate!: Date;

    beforeEach(() => {
        // Freeze time to 2026-03-15 for all tests in this suite
        fixedDate = new Date('2026-03-15T12:00:00Z');
        RealDate = Date;

        // Override the global Date constructor to return the fixed date when no arguments are provided
        // @ts-ignore
        global.Date = class extends RealDate {
            constructor(...args: any[]) {
                super();
                if (args.length === 0) return fixedDate;
                // @ts-ignore
                return new RealDate(...args);
            }
            static now() { return fixedDate.getTime(); }
        } as unknown as DateConstructor;

        // Mocked service and controller -> Just to test generateStatementLinks method
        service = {} as StatementGenerationService;
        controller = new StatementController(service);

        // override API host/port parsed at module load time
        // @ts-ignore
        controller.API_HOST = 'test-host';
        // @ts-ignore
        controller.API_PORT = 1234;
    });

    afterEach(() => {
        // restore Date
        // @ts-ignore
        global.Date = RealDate;
    });

    test('generates links from wallet creation date until current month', () => {
        const walletCreatedDate = new Date('2025-12-10T00:00:00Z');

        const links = controller.generateStatementLinks(walletCreatedDate);

        // derive host and port at runtime
        // @ts-ignore
        const host = controller.API_HOST;
        // @ts-ignore
        const port = controller.API_PORT;

        const expected: string[] = [];
        const current = new Date();
        let month = current.getMonth() + 1;
        let year = current.getFullYear();
        const walletMonth = walletCreatedDate.getMonth() + 1;
        const walletYear = walletCreatedDate.getFullYear();

        while((month >= walletMonth && year === walletYear) || year > walletYear){
            expected.push(`${host}:${port}/statement?month=${month}&year=${year}`);
            if(month === 1){
                year--;
                month = 12;
                continue;
            }
            month--;
        }

        assert.deepStrictEqual(links, expected);
    });

    test('when wallet created same month only one link is generated', () => {
        const walletCreatedDate = new Date('2026-03-01T00:00:00Z');

        const links = controller.generateStatementLinks(walletCreatedDate);

        // derive host and port from controller at runtime
        // @ts-ignore
        const host = controller.API_HOST;
        // @ts-ignore
        const port = controller.API_PORT;

        const current = new Date();
        const expectedFirst = `${host}:${port}/statement?month=${current.getMonth() + 1}&year=${current.getFullYear()}`;
        const walletMonth = walletCreatedDate.getMonth() + 1;
        const walletYear = walletCreatedDate.getFullYear();
        const walletLink = `${host}:${port}/statement?month=${walletMonth}&year=${walletYear}`;

        assert.strictEqual(links[0], expectedFirst);
        assert.ok(links.includes(walletLink));
    });
});
