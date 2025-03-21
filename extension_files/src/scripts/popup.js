console.log("This is a popup!");

function loadSummaryUI(summary) {
    // Check if we're in the content script (wrapper exists) or popup
    const container = document.getElementById('privacy-notice-wrapper')?.querySelector('.container') || 
                     document.querySelector(".container");
                     
    console.log("summary loading: ", summary);
    // Create main UI structure
    let html = `
        <div class="header">
            <h2>Data Privacy Ratings</h2>
            <button class="close-button">x</button>
        </div>
    `;

    // Generate rating sections dynamically
    summary.forEach(([title, one_liner, rating, description], index) => {
        console.log("ratings: ", title, description, rating)
        ratingDescriptions = ["Horrible", "Bad", "Decent", "Good", "Excellent"];
        html += `
            <div class="rating-section">
                <div class="rating-info">
                    <h3>${title}</h3>
                    <p class="one-liner" id="one-liner-${index}">${one_liner}</p>
                    <p class="description" id="desc-${index}" style="display: none;">${description}</p>
                    <button class="learn-more" data-index="${index}">Learn More</button>
                </div>
                <div class="stars" data-rating="${rating}"></div>
                <p class=rating-desc id="rating-desc-${index}">${ratingDescriptions[rating - 1]}</p>
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


    // Render stars
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