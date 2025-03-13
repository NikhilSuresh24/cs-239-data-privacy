// deprecated. I now don't use this and whenever the use is on the sign up page for 
// instagram, facebook, or tik tok it directly accesses the background script


// URL or pattern to search for in links (e.g., "privacy-policy")
const privacyPages = {
    "instagram": "https://www.facebook.com/privacy/policy",
    "facebook": "https://www.facebook.com/privacy/policy",
    "tiktok": "https://www.tiktok.com/legal/page/us/privacy-policy/en"
}

const targetPages = ["https://www.instagram.com/accounts/emailsignup/", 
                "https://www.facebook.com/r.php?entry_point=login"]


function injectPrivacyNotice() {
    fetch(chrome.runtime.getURL('src/pages/index.html'))
        .then(response => response.text())
        .then(html => {
            const wrapper = document.createElement('div');
            wrapper.id = 'privacy-notice-wrapper';
                
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = chrome.runtime.getURL('src/styles/index.css');
            document.head.appendChild(link);        
            
            // Insert the HTML into the wrapper
            wrapper.insertAdjacentHTML('beforeend', html);
            document.body.appendChild(wrapper);

            //CALLS SUMMARY FETCH ON PAGE LOAD
            //chrome.runtime.sendMessage({ linkFound: true, url: priv_url });
        });
}


function checkAndNotify() {
    const currentUrl = window.location.href;
    console.log('Checking URL:', currentUrl);
    if (targetPages.includes(currentUrl)) {
            injectPrivacyNotice();
        }
 }


// Set up mutation observer to watch for URL changes
let lastUrl = location.href;
const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('URL changed to:', lastUrl);
        checkAndNotify();
        for (const [platform, url] of Object.entries(privacyPages)) {
            if (location.href.includes(platform)) {
                chrome.runtime.sendMessage({ linkFound: true, url: url });
                break;
            }
        }
    }   
});

// Start observing
observer.observe(document, { subtree: true, childList: true });


for (const [platform, url] of Object.entries(privacyPages)) {
    if (location.href.includes(platform)) {
        chrome.runtime.sendMessage({ linkFound: true, url: url });
        break;
    }
}
// Check initial page load
checkAndNotify();
