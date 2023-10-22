import puppeteer from 'puppeteer';


async function getQuotes (){

    const browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null
    });
    
    const page = await browser.newPage();
    
    await page.goto("http://quotes.toscrape.com/",{
        waitUntil: 'domcontentloaded',
    
    });

     const quotes = await page.evaluate(()=>{
        const quotelist =document.querySelectorAll('.quote');

        return Array.from(quotelist).map((quote)=>{

            const text = quote.querySelector('.text').innerHTML;
            const author =  quote.querySelector('.author').innerHTML;
    
            return {text,author}
        })

     });

     for(let  qt of quotes){
        console.log(qt);

        await page.click(".pager > .next > a");
     }


    //  await browser.close();

}

getQuotes();
