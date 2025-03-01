chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Inside background.js");

    if (message.linkFound) {
        const scrape_url = `http://localhost:3000/scrape?url=${encodeURIComponent(message.url)}`;
        console.log("Fetching:", scrape_url);

        fetch(scrape_url)  // Calls the Puppeteer server
            .then(response => response.json())
            .then(data => {
                console.log("Scraped data received:", data);
                // Store the data
                chrome.storage.local.set({ 'scrapedData': data.data });
                // Update the popup to use the data HTML
                chrome.action.setPopup({
                    popup: 'data.html'
                });
            })
            .catch(error => {
                console.error("Error fetching scrape data:", error);
                sendResponse({ data: "Error: " + error.message });
            });

        chrome.action.openPopup();
        return true; // Indicates sendResponse will be used asynchronously
    }
});