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


function injectPrivacyNotice(priv_url) {
    fetch(chrome.runtime.getURL('src/pages/index.html'))
        .then(response => response.text())
        .then(html => {
            const wrapper = document.createElement('div');
            wrapper.id = 'privacy-notice-wrapper';
            // wrapper.style.cssText = `
            //     position: fixed;
            //     top: 20px;
            //     right: 20px;
            //     z-index: 9999;
            //     background: white;
            //     border-radius: 8px;
            //     box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            //     max-width: 400px;
            //     box-sizing: border-box; /* Ensures padding doesn't affect width */
            //     padding: 20px;
            //     margin: 15px; /* Adds space on the left and right */
            //     overflow: visible; /* Ensures content can expand without clipping */
            //     height: auto; /* Automatically adjusts height to fit the content */
            // `;
                
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
        for (const [platform, url] of Object.entries(privacyPages)) {
            if (currentUrl.includes(platform)) {
                injectPrivacyNotice(url);
                chrome.runtime.sendMessage({ linkFound: true, url: priv_url });
                break;
            }
        }
    }
}

// Set up mutation observer to watch for URL changes
let lastUrl = location.href;
const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('URL changed to:', lastUrl);
        checkAndNotify();
    }
});

// Start observing
observer.observe(document, { subtree: true, childList: true });

// Check initial page load
checkAndNotify();
