chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Inside background.js");

    if (message.linkFound) {
        const scrape_url = `http://localhost:3000/scrape?url=${encodeURIComponent(message.url)}`;
        console.log("Fetching:", scrape_url);

        fetch(scrape_url)  // Calls the Puppeteer server
            .then(response => response.json())
            .then(data => {
                console.log("Scraped data received:", data);
                chrome.runtime.sendMessage({ action: "displayData", data: data.data });
            })
            .catch(error => {
                console.error("Error fetching scrape data:", error);
                sendResponse({ data: "Error: " + error.message });
            });
        return true; // Indicates sendResponse will be used asynchronously
    }
});