import { strict as assert } from 'node:assert';
import { describe, test, beforeEach, afterEach } from 'node:test';
import { StatementController } from '../../App/Http/Controller/StatementController.js';
import { StatementGenerationService } from '../../App/Service/StatementGenerationService.js';

describe('StatementController', () => {
    let service!: StatementGenerationService;
    let controller!: StatementController;
    let RealDate!: DateConstructor;
    let fixedDate!: Date;
    let generateCalls!: Array<[string, number, number]>;

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

        generateCalls = [];
        service = {
            generate: async (userId: string, month: number, year: number) => {
                generateCalls.push([userId, month, year]);
                return {
                    openingBalance: 250,
                    entries: [],
                    walletCreationDate: new RealDate('2026-01-10T00:00:00Z'),
                };
            },
        } as unknown as StatementGenerationService;
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
        const walletCreatedDate = new Date(2026, 2, 1);

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

        assert.deepStrictEqual(links, [expectedFirst]);
        assert.strictEqual(links[0], walletLink);
    });

    test('getStatement forwards the requested period and generated statement to the response', async () => {
        const request = {
            user: { id: 'user-1' },
            query: { month: 2, year: 2026 },
        } as any;
        const responseBody = {
            openingBalance: 250,
            entries: [],
        };
        const reply = {
            status: (statusCode: number) => {
                assert.strictEqual(statusCode, 200);
                return {
                    send: (body: unknown) => body,
                };
            },
        } as any;

        const result = await controller.getStatement(request, reply);

        assert.deepStrictEqual(generateCalls, [['user-1', 2, 2026]]);
        assert.deepStrictEqual(result, {
            data: responseBody,
            links: [
                'test-host:1234/statement?month=3&year=2026',
                'test-host:1234/statement?month=2&year=2026',
                'test-host:1234/statement?month=1&year=2026',
            ],
        });
    });

    test('getStatement uses the current period when no query period is provided', async () => {
        const request = {
            user: { id: 'user-1' },
            query: {},
        } as any;
        const reply = {
            status: () => ({ send: (body: unknown) => body }),
        } as any;

        await controller.getStatement(request, reply);

        assert.deepStrictEqual(generateCalls, [['user-1', 3, 2026]]);
    });
});
