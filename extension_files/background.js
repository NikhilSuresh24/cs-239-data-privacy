chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.linkFound) {

        console.log("Specific link found:", message.url);
        const scrape_url =  "http://localhost:3000/scrape/url=" + message.url
        console.log(scrape_url)
        fetch(scrape_url)  // Calls the Puppeteer server
            .then(response => response.json())
            .then(data => sendResponse({ data }))
            .catch(error => sendResponse({ data: "Error: " + error.message }));
        return true; // Indicates asynchronous response

        chrome.action.openPopup();
    }
});
