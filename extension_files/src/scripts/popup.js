console.log("This is a popup!");

function loadSummaryUI(summary) {
    // Check if we're in the content script (wrapper exists) or popup
    const jsonData = JSON.parse(summary);
    injectStyles();

    const container = document.getElementById('privacy-notice-wrapper')?.querySelector('.container') || 
                     document.querySelector(".container");
              
                     
    // Create main UI structure
    let html = `
        <div class="header">
            <h2>Data Privacy Ratings</h2>
            <button class="close-button">x</button>
        </div>
    `;

    // Generate rating sections dynamicall
    jsonData.forEach((item, index) => {
        console.log("ratings: ", item.title, item.summary, item.rating, item.learn_more, item.references)
        ratingDescriptions = ["Horrible", "Bad", "Decent", "Good", "Excellent"];
        html += `
            <div class="rating-section">
                <div class="rating-info">
                    <h3>${item.title}</h3>
                    <p class="one-liner" id="one-liner-${index}">${item.summary}</p>
                    <p class="description" id="desc-${index}" style="display: none;">${item.learn_more}</p>
                    <button class="learn-more" data-index="${index}">Learn More</button>
                </div>
                <div class="stars" data-rating="${item.rating}"></div>
                <div style="display: flex; flex-direction: row; justify-content: center; align-items: center; width: 100%;">
                    <p class=rating-desc id="rating-desc-${index}">${ratingDescriptions[item.rating - 1]}</p>
                    <span class="info-icon" data-tooltip="${tooltipMessages(item.rating)}">ℹ︎</span>
                </div>
            </div>
        `;
    });

    // Replace container content
    container.innerHTML = html;

    // Add event listeners again
    document.querySelector(".close-button").addEventListener("click", () => {
        // Check if we're in content script or popup
        const wrapper = document.getElementById('privacy-notice-wrapper');
        if (wrapper) {
            wrapper.remove();  // In content script, remove the wrapper
        } else {
            window.close();    // In popup, close the window
        }
    });

    document.querySelectorAll(".learn-more").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.target.getAttribute("data-index");
            const descriptionElem = document.getElementById(`desc-${index}`);
            const oneLinerElem = document.getElementById(`one-liner-${index}`);
            
            if (descriptionElem.style.display === "none") {
                descriptionElem.style.display = "block";
                oneLinerElem.style.display = "none";
                event.target.textContent = "Hide";
            } else {
                descriptionElem.style.display = "none";
                oneLinerElem.style.display = "block";
                event.target.textContent = "Learn More";
            }
        });
    });


    // Render color ratings
    document.querySelectorAll(".stars").forEach(container => {
        const rating = parseInt(container.getAttribute("data-rating"), 10);
        console.log("RATING: ", rating)
        // for (let i = 1; i <= 5; i++) {
        //     const star = document.createElement("span");
        //     star.classList.add("star");
        //     star.innerHTML = "★"; 
        //     if (i <= rating) {
        //         star.classList.add("filled");
        //     }
        //     container.appendChild(star);
        // }
        const ratingColors = ['#ff4d4d', '#ff9933', '#ffcc00', '#66cc66', '#009933']; // Red, Orange, Yellow, Green
        for (let i = 1; i <= 5; i++) {
            color = ratingColors[i - 1];
            // const color = (i <= rating) ? ratingColors[i - 1] : '#e0e0e0'; // Gray for non-selected
            const bar = document.createElement("div");
            bar.classList.add("rating-bar");
            bar.style.backgroundColor = color;  // Set the color based on rating
            if (i == rating) {
                const diamond = document.createElement("span");
                diamond.textContent = "♦"; // Diamond symbol
                diamond.style.fontSize = "24px";
                diamond.style.color = "#000"; // You can choose the color of the diamond
                bar.appendChild(diamond);
            }
            container.appendChild(bar);
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

function tooltipMessages(rating) {
    if (rating == 1) {
        return "The policy is very vague and not explicit about data handling practices. If it is explicit, their practices are very negative for user data privacy.";
    }
    if (rating == 2) {
        return "The policy is vague and not explicit about data handling practices. If it is explicit, their practices are negative for user data privacy.";
    }
    if (rating == 3) {
        return "The policy is somewhat explicit about data handling practices and/or it is somewhat negative for users.";
    }
    if (rating == 4) {
        return "The policy is explicit about data handling practices but those practices are not necessarily good at maintaining data privacy and security.";
    }
    if (rating == 5) {
        return "The policy is explicit about data handling practices and those practices are good at maintaining data privacy and security.";
    }
}

function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
        .info-icon {
            cursor: pointer;
            margin-left: 5px;
            font-size: 14px;
            color: gray;
            position: relative;
            display: inline-block; /* Ensure it stays inline */
            vertical-align: middle; /* Align with text */
        }

        .info-icon::after {
            content: attr(data-tooltip);
            display: none;
            position: absolute;
            background: lightgray;
            color: black;
            padding: 6px 10px;
            border-radius: 5px;
            font-size: 12px;
            width: max-content;
            max-width: 220px;
            top: -35px; /* Move tooltip above icon */
            left: 50%;
            transform: translateX(-50%);
            white-space: normal; /* Allows wrapping */
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }

        .info-icon:hover::after {
            display: block;
        }
    `;
    document.head.appendChild(style);
}