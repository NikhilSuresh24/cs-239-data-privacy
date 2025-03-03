console.log("This is a popup!");

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['scrapedData', 'summary'], function(result) {
        if (result.summary) {
            document.getElementById('summary').textContent = result.summary;
        } else {
            document.getElementById('summary').textContent = 'No summary available';
        }

        if (result.scrapedData) {
            document.getElementById('data-display').textContent = result.scrapedData;
        } else {
            document.getElementById('data-display').textContent = 'No data available';
        }
    });
});

// Keep the message listener for potential future use or remove if not needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    // Handle any additional message-based functionality here
});
