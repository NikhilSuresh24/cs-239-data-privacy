chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.linkFound) {
        console.log("Specific link found:", message.url);

        chrome.action.openPopup();
    }
});
