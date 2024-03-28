import { createCheerioRouter } from 'crawlee';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, $,  request, pushData, log }) => {
    const specializations = $("#specialization > option").toArray().map(spec => $(spec).attr('value')).slice(1)
    pushData({  url: request.loadedUrl, specializations, label: 'specialization' })
    
    log.info(`enqueueing new URLs ${request.loadedUrl}`);
    await enqueueLinks({ globs: ['https://oladoc.com/pakistan/*'], label: 'city' });
});

router.addHandler('city', async ({ request, $, log, pushData, }) => {
    const cityImageUrl = $('.city-image-section > img').attr('src')
    const cityDescription = $('.about-city-discription').text()
    log.info(`imageUrl: ${cityImageUrl}, description: ${cityDescription}`, { url: request.loadedUrl });

    await pushData({
        url: request.loadedUrl,
        cityImageUrl,
        cityDescription,
        label: 'city'
    });
});
