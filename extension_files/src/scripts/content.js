// // deprecated. I now don't use this and whenever the use is on the sign up page for 
// // instagram, facebook, or tik tok it directly accesses the background script


// // URL or pattern to search for in links (e.g., "privacy-policy")
// const privacyPages = {
//     "instagram": "https://www.facebook.com/privacy/policy",
//     "facebook": "https://www.facebook.com/privacy/policy",
//     "tiktok": "https://www.tiktok.com/legal/page/us/privacy-policy/en"
// }

// const targetPages = ["https://www.instagram.com/accounts/emailsignup/", 
//                 "https://www.facebook.com/r.php?entry_point=login"]


// function checkAndNotify() {
//     const currentUrl = window.location.href;
//     console.log('Checking URL:', currentUrl);
//     if (targetPages.includes(currentUrl)) {
//         for (const [platform, url] of Object.entries(privacyPages)) {
//             if (currentUrl.includes(platform)) {
//                 chrome.runtime.sendMessage({ linkFound: true, url: url });
//                 break;
//             }
//         }
//     }
// }

// // Set up mutation observer to watch for URL changes
// let lastUrl = location.href;
// const observer = new MutationObserver(() => {
//     if (location.href !== lastUrl) {
//         lastUrl = location.href;
//         console.log('URL changed to:', lastUrl);
//         checkAndNotify();
//     }
// });

// // Start observing
// observer.observe(document, { subtree: true, childList: true });

// // Check initial page load
// checkAndNotify();
console.log("Content script loaded");

// Function to inject the React component into the page
function injectReactComponent() {
    console.log("Injecting React component...");

    // Ensure Tailwind CSS is injected (optional)
    injectTailwind();

    // Check if the container already exists
    let container = document.getElementById("tiktok-popup-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "tiktok-popup-container";
        document.body.appendChild(container);
    }

    // Dynamically import React and ReactDOM
    import(chrome.runtime.getURL("react.bundle.js")).then(({ default: React, ReactDOM }) => {
        import(chrome.runtime.getURL("../src/pages/initial_notification.js")).then(({ default: TikTokPopup }) => {
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(TikTokPopup));
        });
    });
}

// Function to inject Tailwind CSS (if needed)
function injectTailwind() {
    if (document.getElementById("tailwind-cdn")) return; // Prevent multiple injections

    const link = document.createElement("link");
    link.id = "tailwind-cdn";
    link.href = "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}

// Function to send URL to Puppeteer server for scraping
function sendToScraper(pageUrl) {
    const scrapeUrl = `http://localhost:3000/scrape?url=${encodeURIComponent(pageUrl)}`;
    console.log("Fetching:", scrapeUrl);

    fetch(scrapeUrl)  // Calls the Puppeteer server
        .then(response => response.json())
        .then(data => {
            console.log("Scraped data received:", data);

            // Store the scraped data in Chrome local storage
            chrome.storage.local.set({ 'scrapedData': data.data }, () => {
                console.log("Scraped data stored in Chrome local storage.");
            });
        })
        .catch(error => {
            console.error("Error fetching scrape data:", error);
        });
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in content.js:", message);

    if (message.linkFound === true && message.url) {
        chrome.tabs.executeScript(tabId, { file: 
            './inject_script.js' }, function () {
            chrome.tabs.executeScript(tabId, { file: 
               './foreground.bundle.js' }, function () {
                   console.log('INJECTED AND EXECUTED');
            });
        });
        // injectReactComponent(); // Inject the React component
        sendToScraper(message.url); // Send the URL to the Puppeteer scraper
    }

    sendResponse({ status: "Content script executed" });
});

