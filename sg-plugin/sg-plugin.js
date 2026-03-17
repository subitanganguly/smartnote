
//----------------------Typing Animation------------------------------------------------

// How to call it in HTML

/* <div id="welcome-message">

  <div id="phrases" style="display:none;">
    <span>Welcome to Dorja</span>
    <span>The Creative Hub</span>
    <span>We Build Websites That Grow Your Business</span>
    <span>Web • App • Design • Marketing</span>
    <span>Turning Ideas Into Reality</span>
    <span>Let's Create Something Amazing Together</span>
  </div>
    <span id="typed-text" class="sg-text5"></span>
  <span class="typed-cursor" style="color: rgb(255, 94, 0);">|</span>

</div> */

const phraseElements = document.querySelectorAll("#phrases span");
const phrases = Array.from(phraseElements).map(el => el.innerText);

if (phrases.length === 0) {
  //console.warn("No phrases found for typing effect.");
} else {

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = "";

const typedElement = document.getElementById("typed-text");

function typeEffect(){

  const fullText = phrases[phraseIndex];

  if(!fullText) return; // safety check

  if(isDeleting){
    currentText = fullText.substring(0,charIndex-1);
    charIndex--;
  }else{
    currentText = fullText.substring(0,charIndex+1);
    charIndex++;
  }

  typedElement.textContent = currentText;

  if(!isDeleting && charIndex === fullText.length){
    isDeleting = true;
    setTimeout(typeEffect,2000);
    return;
  }

  if(isDeleting && charIndex === 0){
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(typeEffect,400);
    return;
  }

  const speed = isDeleting ? 50 : 80;
  setTimeout(typeEffect,speed);
}

window.onload = () => {
  setTimeout(typeEffect,300);
};

}

// Add CSS using JavaScript
const style = document.createElement("style");
style.innerHTML = `
.typed-cursor{
  margin-left:5px;
  animation: blink 1s infinite;
}

@keyframes blink{
  0%,100%{opacity:1;}
  50%{opacity:0;}
}
`;
document.head.appendChild(style);


//----------------------Typing Animation------------------------------------------------





//----------------------particles------------------------------------------------

// HTML NEED [<div class="particles" id="particles"></div>]

document.addEventListener("DOMContentLoaded", function () {

    /* Insert CSS from JS */
    const style = document.createElement("style");
    style.innerHTML = `
    .particles{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:-2;
        overflow:hidden;
        pointer-events:none;
    }

    .particle{
        position:absolute;
        border-radius:50%;
        animation: float linear infinite;
    }

    @keyframes float{
        0%{
            transform: translateY(0) rotate(0deg);
            opacity:1;
        }
        100%{
            transform: translateY(-1000px) rotate(720deg);
            opacity:0;
        }
    }
    `;
    document.head.appendChild(style);


    /* Particle generator */
    const particlesContainer = document.getElementById("particles");

    const colors = [
        "rgba(255,255,255,0.5)",
        "rgba(173,216,230,0.5)",
        "rgba(255,192,203,0.5)",
        "rgba(144,238,144,0.5)"
    ];

    for (let i = 0; i < 40; i++) {

        const particle = document.createElement("div");
        particle.classList.add("particle");

        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            width:${size}px;
            height:${size}px;
            background:${color};
            left:${Math.random() * 100}%;
            top:${Math.random() * 100}%;
            animation-duration:${Math.random() * 20 + 10}s;
            animation-delay:${Math.random() * 10}s;
            opacity:${Math.random() * 0.5 + 0.3};
        `;

        particlesContainer.appendChild(particle);
    }

});


//----------------------particles------------------------------------------------





//----------------------Alert To Tost------------------------------------------------

// HOW TO USE 

  // alert("Hello! I am an alert box!");
  // alertSuccess("Hello! I am an alert box!");
  // alertError("Hello! I am an alert box!");
  // alertInfo("Hello! I am an alert box!");

(function () {

  // Add animation style
  const style = document.createElement("style");
style.innerHTML = `

@keyframes bounceIn {
  0% {transform: translateX(120%) scale(0.8); opacity:0;}
  60% {transform: translateX(-10px) scale(1.05); opacity:1;}
  80% {transform: translateX(5px) scale(0.98);}
  100% {transform: translateX(0) scale(1);}
}

@keyframes bounceOut {
  0% {transform: translateX(0); opacity:1;}
  20% {transform: translateX(-10px);}
  100% {transform: translateX(120%); opacity:0;}
}



.toast-bounce-in{
  animation: bounceIn 0.5s ease;
}

.toast-bounce-out{
  animation: bounceOut 0.4s ease forwards;
}



@keyframes emojiPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.toast-emoji{
  display: inline-block;
  margin-right: 8px;
  animation: emojiPulse 1.2s ease infinite;
}


/* Mobile Responsive */
@media (max-width: 576px){

  .toast-mobile{
    min-width: 180px !important;
    max-width: 85vw !important;
    font-size: 12px !important;
    padding: 8px 10px !important;
    border-radius: 5px !important;
  }

}

`;
document.head.appendChild(style);

  // Create container
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  function createToast(message, type="default", delay=3000){

    const toast = document.createElement("div");
    toast.classList.add("toast-mobile");
    toast.style.minWidth = "250px";
    toast.style.marginBottom = "10px";
    toast.style.padding = "12px 16px";
    toast.style.borderRadius = "6px";
    toast.style.fontFamily = "sans-serif";
    toast.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.22)";
    toast.style.position = "relative";
    toast.style.overflow = "hidden";
    const text = document.createElement("span");
    text.innerText = message;
    const emoji = document.createElement("span");
    emoji.classList.add("toast-emoji");

    toast.classList.add("toast-bounce-in");

    if(type === "default"){
      emoji.innerText = "🔔";
      toast.appendChild(emoji);
      toast.appendChild(text);

      toast.style.background = "#f8f9fa";
      toast.style.color = "#3a3a3a";
      toast.style.boxShadow = "inset 0 0px 2px 5px #9b9b9b3b";
      toast.style.borderBottom = "4px solid #525252";
      toast.style.borderTop = "2px solid #525252";
      addProgress(toast,"#525252",delay);
    }

    if(type === "success"){
      emoji.innerText = "✅";
      toast.appendChild(emoji);
      toast.appendChild(text);

      toast.style.background = "#f8f9fa";
      toast.style.color = "#036300";
      toast.style.boxShadow = "inset 0 0px 2px 5px #28a7463b";
      toast.style.borderBottom = "4px solid #28a745";
      toast.style.borderTop = "2px solid #28a745";
      addProgress(toast,"#28a745",delay);
    }

    if(type === "error"){
      emoji.innerText = "❌";
      toast.appendChild(emoji);
      toast.appendChild(text);

      toast.style.background = "#f8f9fa";
      toast.style.color = "#ec000c";
      toast.style.boxShadow = "inset 0 0px 2px 5px #ff00153b";
      toast.style.borderBottom = "4px solid #dc3545";
      toast.style.borderTop = "2px solid #dc3545";
      addProgress(toast,"#dc3545",delay);
    }

    if(type === "info"){
      emoji.innerText = "ℹ️";
      toast.appendChild(emoji);
      toast.appendChild(text);

      toast.style.background = "#f8f9fa";
      toast.style.color = "#00586e";
      toast.style.boxShadow = "inset 0 0px 2px 5px #00ffdd3b";
      toast.style.borderBottom = "2px solid #00d3d3";
      toast.style.borderTop = "2px solid #00d3d3";
      addProgress(toast,"#00d3d3",delay);
    }

    container.appendChild(toast);

    setTimeout(()=>{
      toast.classList.remove("toast-bounce-in");
      toast.classList.add("toast-bounce-out");

      setTimeout(()=>{
        toast.remove();
      },400);

    },delay);
  }

  function addProgress(toast,color,delay){
    const bar = document.createElement("div");

    bar.style.position = "absolute";
    bar.style.bottom = "0";
    bar.style.left = "0";
    bar.style.height = "3px";
    bar.style.background = color;
    bar.style.width = "100%";
    bar.style.transition = `width ${delay}ms linear`;

    toast.appendChild(bar);

    setTimeout(()=>{
      bar.style.width = "0%";
    },10);
  }

  window.alert = function(msg){
    createToast(msg,"default",2000);
  }

  window.alertSuccess = function(msg){
    createToast(msg,"success",2000);
  }

  window.alertError = function(msg){
    createToast(msg,"error",2000);
  }

  window.alertInfo = function(msg){
    createToast(msg,"info",2000);
  }

})();


//----------------------Alert To Tost------------------------------------------------


//----------------------sg-floating-btn------------------------------------------------
// How to call it in HTML

        // <button class="sg-floating-btn" id="mainBtn">
        //     <i class="fa-solid fa-bars"></i>
        //     <i class="fa-solid fa-xmark"></i>
        // </button>


        // <button class="child-btn" id="btn1" onclick="window.location.href='theme.html'">
        //     <i class="fas fa-home"></i>
        // </button>
        // <button class="child-btn" id="btn2">
        //     <i class="fas fa-star"></i>
        // </button>
        // <button class="child-btn" id="btn3">
        //     <i class="fas fa-heart"></i>
        // </button>
        // <button class="child-btn" id="btn4">
        //     <i class="fas fa-cog"></i>
        // </button>
        // <button class="child-btn" id="btn5">
        //     <i class="fas fa-user"></i>
        // </button>

document.addEventListener('DOMContentLoaded', function() {
        const mainBtn = document.getElementById('mainBtn');
        const buttons = document.querySelectorAll('.child-btn');

        let isOpen = false;

        if(mainBtn){
        mainBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            
            // Toggle main button class for icon swap
            mainBtn.classList.toggle('open');

            const totalButtons = buttons.length;
            
            // Gap between buttons
            const startAngle = 160; // left side (degrees)
            const endAngle = 20;     // right side (degrees)
            const radius = 100;      // distance from main button

            buttons.forEach((btn, index) => {
                if (isOpen) {
                    // Show button first
                    btn.classList.add('show');
                    
                    // Calculate angle for each button (evenly distributed)
                    let angle;
                    if (totalButtons === 1) {
                        angle = (startAngle + endAngle) / 2; // middle if only one
                    } else {
                        angle = startAngle + (index / (totalButtons - 1)) * (endAngle - startAngle);
                    }
                    
                    // Calculate position
                    const x = radius * Math.cos(angle * Math.PI / 180);
                    const y = radius * Math.sin(angle * Math.PI / 180);
                    
                    // Apply transform - negative y moves upward, x moves left/right
                    btn.style.transform = `translateX(-50%) translate(${x}px, ${-y}px) scale(1)`;
                } else {
                    // Hide button - revert to original position with scale 0.5
                    btn.style.transform = `translateX(-50%) scale(0.5)`;
                    
                    // Remove show class after animation completes
                    setTimeout(() => {
                        if (!isOpen) {
                            btn.classList.remove('show');
                        }
                    }, 400); // Match transition duration
                }
            });
        })};

        // Close when clicking outside
        document.addEventListener('click', function(event) {
            if (isOpen && !event.target.closest('.sg-floating-btn') && !event.target.closest('.child-btn')) {
                isOpen = false;
                mainBtn.classList.remove('open');
                
                buttons.forEach((btn) => {
                    btn.style.transform = `translateX(-50%) scale(0.5)`;
                    setTimeout(() => {
                        if (!isOpen) {
                            btn.classList.remove('show');
                        }
                    }, 400);
                });
            }
        });
    });
//----------------------sg-floating-btn------------------------------------------------






//----------------------cardMenuBtn------------------------------------------------
// How to call it in HTML

// <!-- Main Button -->
// <button class="card-menu-btn" id="cardMenuBtn">
// <i class="fa-solid fa-ellipsis-vertical"></i>
// </button>

// <!-- Child Buttons -->
// <button class="card-child-btn bg-primary" title="Edit" onclick="window.location.href='index.html'">
// <i class="fas fa-edit"> </i><span class="d-none d-lg-inline"> Edit</span> 
// </button>

// <button class="card-child-btn bg-success">
// <i class="fas fa-share"> </i><span class="d-none d-lg-inline"> Share</span> 
// </button>

// <button class="card-child-btn bg-danger">
// <i class="fas fa-trash"> </i><span class="d-none d-lg-inline"> Delete</span> 
// </button>

// const menuBtn = document.getElementById("cardMenuBtn");
// const childBtns = document.querySelectorAll(".card-child-btn");


// let open = false;

// // Configuration for spacing between buttons
// const spacingConfig = {
//     largeScreen: {
//         padding: 20, // Extra space between buttons when text is visible
//         firstBtnExtra: 0, // No extra for first button
//         lastBtnExtra: 0
//     },
//     smallScreen: {
//         padding: 5, // Base padding between buttons
//         firstBtnExtra: 5, // Extra space for first button
//         lastBtnExtra: 5 // Slight overlap for last button (negative value)
//     }
// };

// function calculateGaps() {
//     const gaps = [];
//     const isLargeScreen = window.innerWidth >= 992;
//     const config = isLargeScreen ? spacingConfig.largeScreen : spacingConfig.smallScreen;
    
//     childBtns.forEach((btn, index) => {
//         // Get the button's actual width
//         const btnWidth = btn.offsetWidth;
        
//         // Base gap is button width + padding
//         let gap = btnWidth + config.padding;
        
//         // Adjust for first and last buttons if needed
//         if (index === 0) {
//             gap += config.firstBtnExtra;
//         } else if (index === childBtns.length - 1) {
//             gap += config.lastBtnExtra;
//         }
        
//         // Ensure gap is never negative
//         gaps.push(Math.max(gap, 10));
//     });
    
//     return gaps;
// }

// // Optional: Add mutation observer to detect when button content changes
// const observer = new MutationObserver(() => {
//     if (open) {
//         const gaps = calculateGaps();
//         childBtns.forEach((btn, index) => {
//             let totalOffset = 0;
//             for (let i = 0; i <= index; i++) {
//                 totalOffset += gaps[i];
//             }
//             btn.style.transform = `translateX(-${totalOffset}px) scale(1)`;
//         });
//     }
// });

// // Observe all buttons for content changes
// childBtns.forEach(btn => {
//     observer.observe(btn, { 
//         childList: true, 
//         subtree: true, 
//         characterData: true 
//     });
// });

// if(menuBtn) {

// menuBtn.addEventListener("click", ()=>{
//     open = !open;
//     menuBtn.classList.toggle("open");
    
//     const gaps = calculateGaps();
//     //console.log("Gaps for", childBtns.length, "buttons:", gaps);

//     childBtns.forEach((btn, index) => {
//         if (open) {
//             btn.classList.add("show");
            
//             setTimeout(() => {
//                 // Calculate cumulative offset
//                 let totalOffset = 0;
//                 for (let i = 0; i <= index; i++) {
//                     totalOffset += gaps[i];
//                 }
                
//                 btn.style.transform = `translateX(-${totalOffset}px) scale(1)`;
//             }, index * 100);
//         } else {
//             btn.style.transform = "translateX(0) scale(0.5)";
            
//             setTimeout(() => {
//                 btn.classList.remove("show");
//             }, 300);
//         }
//     });
// });
// }
// // Handle window resize
// window.addEventListener('resize', () => {
//     if (open) {
//         const gaps = calculateGaps();
//         const maxOffset = window.innerWidth * 0.7; // Don't go beyond 70% of screen width
        
//         childBtns.forEach((btn, index) => {
//             let totalOffset = 0;
//             for (let i = 0; i <= index; i++) {
//                 totalOffset += gaps[i];
//             }
            
//             // Apply limit
//             totalOffset = Math.min(totalOffset, maxOffset);
            
//             btn.style.transform = `translateX(-${totalOffset}px) scale(1)`;
//         });
//     }
// });


//----------------------cardMenuBtn------------------------------------------------