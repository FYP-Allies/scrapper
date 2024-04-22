import { createCheerioRouter, sleep } from 'crawlee';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ enqueueLinks, $, request, pushData, log }) => {
    $("#specialization > option").toArray().map(spec => $(spec).attr('value')).slice(1)
        .forEach(specialization => {
            pushData({ url: request.loadedUrl, specialization: specialization?.toLocaleLowerCase(), label: 'specialization' })
        })

    $('main > div').toArray().slice(1).forEach(ele => {
        const specialization = $(ele).find('a').first().text();
        const conditions = $(ele).find('[data-search]').toArray().map(data => $(data).attr('data-search'))
        pushData({
            url: request.loadedUrl,
            specialization: specialization.toLocaleLowerCase(),
            conditions: conditions.map(c => c?.toLocaleLowerCase()),
            label: 'condition'
        })
    });

    log.info(`enqueueing new URLs ${request.loadedUrl}`);
    await enqueueLinks({ globs: ['https://oladoc.com/pakistan/*'], label: 'city' });
});

router.addHandler('city', async ({ request, $, log, pushData, enqueueLinks }) => {
    const cityImageUrl = $('.city-image-section > img').attr('src')
    const cityDescription = $('.about-city-discription').text()
    log.info(`imageUrl: ${cityImageUrl}, description: ${cityDescription}`, { url: request.loadedUrl });

    await pushData({
        url: request.loadedUrl,
        cityImageUrl,
        cityDescription,
        label: 'city'
    });

    log.info(`label: city ~ enqueueing new URLs ${request.loadedUrl}`);
    sleep(2000);
    await enqueueLinks({ globs: [`${request.loadedUrl}/h/**`], label: 'hospital' });
});

router.addHandler('hospital', async ({ request, $, log, pushData }) => {
    const name = $('.hospital-title').text().trim();
    const location = $('.hospital-address').text().trim();
    const helpLine = $('.od-btn-helpline').attr('href');
    const googleLocLink = $('[aria-label="find-location"]').attr('href');
    const about = $('#about-hospital > div > div.font-size-13-6 > p:nth-child(1)').text().trim();
    const secondaryContact = $('.contact-loaction-sect-with-icon:nth-child(2) > span').first().text().trim();
    const avatar = $('.card-img-overlay').attr('src');

    await pushData({
        url: request.loadedUrl,
        name,
        location,
        helpLine,
        googleLocLink,
        about,
        secondaryContact,
        avatar,
        label: 'hospital'
    });


    log.info(`name: ${name}, location: ${location}, helpLine: ${helpLine}, googleLocLink: ${googleLocLink}, about: ${about}, secondaryContact: ${secondaryContact}`, { url: request.loadedUrl });
});



