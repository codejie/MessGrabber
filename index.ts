
import logger from "./src/logger";
import Session from "./src/session";
import { domainOutput } from "./test/domain-search";
import { hostOutput } from "./test/host-output";
import { testWebOutput } from "./test/test-web";
import { webOutput } from "./test/web-output";

const session: Session = new Session({
    apiKey: 'AA2c4A6a-4A2d-e0901-8C7e-f1ceD3FD084',
    baseUrl: 'https://api.zoomeye.org/'
});

async function main(): Promise<void> {
    // await hostOutput(session);
    // await webOutput(session);
    // await domainOutput(session);
    await testWebOutput(session);
}
;
main();



