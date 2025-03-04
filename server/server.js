const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const { summarizeContent, splitSummary } = require("./summarizer.js");

const app = express();
app.use(cors());

app.get("/scrape", async (req, res) => {
    try {
        const { url } = req.query; // Get URL from query parameters

        if (!url) {
            return res.status(400).json({ error: "URL parameter is required" });
        }
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: "domcontentloaded" }); // Load page
        
        const scrapedData = await page.evaluate(() => document.body.innerText); 
        
        
    

        // Generate summary
        const summary = await summarizeContent(scrapedData);
        const titlesAndSummaries = splitSummary(summary);
        // console.log(summary);
        // console.log(titlesAndSummaries);
        console.log("Sending Response:", JSON.stringify({
            data: scrapedData,
            summary: summary,
            summary_list: titlesAndSummaries
        }, null, 2));
        
        

        res.json({ data: scrapedData, summary: summary, summary_list: titlesAndSummaries });

        await browser.close();

        //res.json({ data: scrapedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Puppeteer server running on port 3000"));