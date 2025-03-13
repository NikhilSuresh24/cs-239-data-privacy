console.log("This is a popup!");function d(o){var i;const l=((i=document.getElementById("privacy-notice-wrapper"))==null?void 0:i.querySelector(".container"))||document.querySelector(".container");console.log("summary loading: ",o);let c=`
        <div class="header">
            <h2>Data Privacy Ratings</h2>
            <button class="close-button">x</button>
        </div>
    `;o.forEach(([n,s,r,t],e)=>{console.log("ratings: ",n,t,r),ratingDescriptions=["Horrible","Bad","Decent","Good","Excellent"],c+=`
            <div class="rating-section">
                <div class="rating-info">
                    <h3>${n}</h3>
                    <p class="one-liner" id="one-liner-${e}">${s}</p>
                    <p class="description" id="desc-${e}" style="display: none;">${t}</p>
                    <button class="learn-more" data-index="${e}">Learn More</button>
                </div>
                <div class="stars" data-rating="${r}"></div>
                <p class=rating-desc id="rating-desc-${e}">${ratingDescriptions[r-1]}</p>
            </div>
        `}),l.innerHTML=c,document.querySelector(".close-button").addEventListener("click",()=>{const n=document.getElementById("privacy-notice-wrapper");n?n.remove():window.close()}),document.querySelectorAll(".learn-more").forEach(n=>{n.addEventListener("click",s=>{const r=s.target.getAttribute("data-index"),t=document.getElementById(`desc-${r}`),e=document.getElementById(`one-liner-${r}`);t.style.display==="none"?(t.style.display="block",e.style.display="none",s.target.textContent="Hide"):(t.style.display="none",e.style.display="block",s.target.textContent="Learn More")})}),document.querySelectorAll(".stars").forEach(n=>{const s=parseInt(n.getAttribute("data-rating"),10);console.log("RATING: ",s);const r=["#ff4d4d","#ff9933","#ffcc00","#66cc66","#009933"];for(let t=1;t<=5;t++){color=r[t-1];const e=document.createElement("div");if(e.classList.add("rating-bar"),e.style.backgroundColor=color,t==s){const a=document.createElement("span");a.textContent="♦",a.style.fontSize="24px",a.style.color="#000",e.appendChild(a)}n.appendChild(e)}})}chrome.runtime.onMessage.addListener((o,l,c)=>{console.log("Received message:",o)});chrome.storage.onChanged.addListener(o=>{o.summary_list&&d(o.summary_list.newValue)});document.addEventListener("DOMContentLoaded",()=>{const o=document.querySelector(".container");o.innerHTML="<p class='loading'>Waiting for summary...</p>"});
