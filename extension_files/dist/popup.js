(()=>{"use strict";console.log("This is a popup!"),document.addEventListener("DOMContentLoaded",(function(){chrome.storage.local.get(["scrapedData","summary"],(function(e){e.summary?document.getElementById("summary").textContent=e.summary:document.getElementById("summary").textContent="No summary available",e.scrapedData?document.getElementById("data-display").textContent=e.scrapedData:document.getElementById("data-display").textContent="No data available"}))})),chrome.runtime.onMessage.addListener(((e,t,a)=>{console.log("Received message:",e)}))})();