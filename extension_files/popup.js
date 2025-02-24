console.log("This is a popup!")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "displayData") {
      // Update the popup with the fetched data
      document.getElementById("data-display").textContent = message.data;
    } else if (message.action === "displayError") {
      // Handle any errors (e.g., display error message in popup)
      document.getElementById("data-display").textContent = "Error: " + message.error;
    }

    chrome.action.openPopup()
  });