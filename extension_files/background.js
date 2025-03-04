console.log("Background worker loaded");

// Privacy policy URLs mapped to platforms
const privacyPages = {
    "instagram": "https://www.facebook.com/privacy/policy",
    "facebook": "https://www.facebook.com/privacy/policy",
    "tiktok": "https://www.tiktok.com/legal/page/us/privacy-policy/en"
};

// Target pages where we should check for privacy policy links
const targetPages = [
    "https://www.instagram.com/accounts/emailsignup/",
    "https://www.facebook.com/r.php?entry_point=login"
];

// Function to check if the page needs a privacy policy notification
function checkAndNotify(tabId, pageUrl) {
    console.log("Checking URL:", pageUrl);

    if (targetPages.includes(pageUrl)) {
        for (const [platform, privacyUrl] of Object.entries(privacyPages)) {
            if (pageUrl.includes(platform)) {
                console.log(`Privacy policy found for ${platform}: ${privacyUrl}`);

                // Send message to content.js to display popup
                chrome.tabs.sendMessage(tabId, { linkFound: true, url: privacyUrl }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message to content script:", chrome.runtime.lastError);
                    } else {
                        console.log("Message sent to content.js:", response);
                    }
                });
                break;
            }
        }
    }
}

// Listen for tab updates (page load or navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        checkAndNotify(tabId, tab.url);
    }
});

// Listen for completed navigation events (useful for single-page apps)
chrome.webNavigation.onCompleted.addListener((details) => {
    checkAndNotify(details.tabId, details.url);
});
