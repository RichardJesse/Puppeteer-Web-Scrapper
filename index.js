import puppeteer from 'puppeteer';

 async function getQuotes() {
    const browser = await puppeteer.launch({
        headless: false, 
    });

    const page = await browser.newPage();

    try {
        await page.goto('http://quotes.toscrape.com/', {
            waitUntil: 'domcontentloaded',
        });

        const allQuotes = [];

        while (true) {
            const quotesOnPage = await page.evaluate(() => {
                const quotelist = document.querySelectorAll('.quote');

                return Array.from(quotelist).map((quote) => {
                    const textElement = quote.querySelector('.text');
                    const authorElement = quote.querySelector('.author');
                    const tagsElement = quote.querySelector('.tag');

                    const text = textElement ? textElement.innerHTML : '';
                    const author = authorElement ? authorElement.innerHTML : '';
                    const tags = tagsElement ? tagsElement.innerHTML : '';

                    return { text, author, tags };
                });
            });

            allQuotes.push(...quotesOnPage);

            const nextButton = await page.$('.pager > .next > a');
            if (nextButton) {
                await nextButton.click();
                await page.waitForTimeout(1000); // Add a delay to ensure the next page is loaded
            } else {
                break; // Exit the loop if there is no "Next" button
            }
        }

        return allQuotes;
    } catch (error) {
        console.error('Error in getQuotes:', error);
        throw error; // Rethrow the error for handling in the calling function
    } finally {
        await browser.close();
    }
}
