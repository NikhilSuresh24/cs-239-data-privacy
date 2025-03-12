
let isProcessing = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Inside background.js");

    if (message.linkFound) {
        const scrape_url = `http://localhost:3000/scrape?url=${encodeURIComponent(message.url)}`;
        console.log("Fetching:", scrape_url);

        fetch(scrape_url)  // Calls the Puppeteer server
            .then(response => response.json())
            .then(data => {
                console.log("Scraped data and summary received:", data);
                console.log('sum list: ', data.summary_list)
                // Store the data
                chrome.storage.local.set({ 
                    'scrapedData': data.data,
                    'summary': data.summary, 
                    'summary_list': data.summary_list
                });

                console.log(chrome.storage.local)
                // // Update the popup to use the data HTML
                // chrome.action.setPopup({
                //     popup: 'index.html'
                // });
            })
            .catch(error => {
                console.error("Error fetching scrape data:", error);
                sendResponse({ data: "Error: " + error.message });
            });
        return true; // Indicates sendResponse will be used asynchronously
    }
});