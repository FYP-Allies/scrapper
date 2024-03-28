// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration } from 'crawlee';

import { router } from './routes.js';

const startUrls = [
    'https://oladoc.com/pakistan/',
    'https://oladoc.com/for-doctors'
];

const crawler = new CheerioCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 200,
});

await crawler.run(startUrls);
