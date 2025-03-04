console.log("This is a popup!");

// document.addEventListener('DOMContentLoaded', function() {
//     chrome.storage.local.get(['scrapedData', 'summary'], function(result) {
//         if (result.summary) {
//             document.getElementById('summary').textContent = result.summary;
//         } else {
//             document.getElementById('summary').textContent = 'No summary available';
//         }

//         if (result.scrapedData) {
//             document.getElementById('data-display').textContent = result.scrapedData;
//         } else {
//             document.getElementById('data-display').textContent = 'No data available';
//         }
//     });
// });

function loadSummaryUI(summary) {
    const container = document.querySelector(".container");
    console.log("summary loading: ", summary);
    // Create main UI structure
    let html = `
        <div class="header">
            <h2>Data Privacy Ratings</h2>
            <button class="close-button">x</button>
        </div>
    `;

    // Generate rating sections dynamically
    summary.forEach(([title, description, rating], index) => {
        console.log("ratings: ", title, description, rating)
        html += `
            <div class="rating-section">
                <div class="rating-info">
                    <h3>${title}</h3>
                    <p>${description}</p>
                </div>
                <div class="stars" data-rating="${rating}"></div>
            </div>
        `;
    });

    // Replace container content
    container.innerHTML = html;

    // Add event listeners again
    document.querySelector(".close-button").addEventListener("click", () => {
        window.close();
    });

    // Render stars
    document.querySelectorAll(".stars").forEach(container => {
        const rating = parseInt(container.getAttribute("data-rating"), 10);
        console.log("RATING: ", rating)
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("span");
            star.classList.add("star");
            star.innerHTML = "★"; 
            if (i <= rating) {
                star.classList.add("filled");
            }
            container.appendChild(star);
        }
    });
}

// Keep the message listener for potential future use or remove if not needed
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    // Handle any additional message-based functionality here
});

chrome.storage.onChanged.addListener((changes) => {
    if (changes.summary_list) {
        loadSummaryUI(changes.summary_list.newValue);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");

    // Initially set page to "Waiting for summary..."
    container.innerHTML = "<p class='loading'>Waiting for summary...</p>";

    // // Check Chrome storage for summary
    // chrome.storage.local.get("summary_list", (data) => {
    //     if (data.summary_list) {
    //         loadSummaryUI(data.summary_list);
    //     } else {
    //         // Listen for updates in storage
    //         chrome.storage.onChanged.addListener((changes) => {
    //             if (changes.summary_list) {
    //                 loadSummaryUI(changes.summary_list.newValue);
    //             }
    //         });
    //     }
    // });

    
});

