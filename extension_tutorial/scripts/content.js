// URL or pattern to search for in links (e.g., "privacy-policy")
const targetUrl = "https://www.facebook.com/privacy/policy";

// Function to scan for links pointing to the target URL
function detectSpecificLink() {
    const links = document.getElementsByTagName('a');
    const pp = document.querySelectorAll('a[href="https://www.facebook.com/privacy/policy"]');
    console.log(pp);

    for (link of links) {
        if (link.href.toLowerCase().includes('privacy')) {
            console.log(`Found link to ${targetUrl}: ${link.href}`);
            // Send a message to the background script about the found link
            chrome.runtime.sendMessage({ linkFound: true, url: link.href });
        }
      }
}

// Run the detection function when the page loads
detectSpecificLink();

