import * as SGPlugin from './sg-plugin.js';



// Call loadSavedTheme ------------------------------------------------------------------
const root = document.documentElement;
const body = document.body;

function applyTheme(theme){

  root.style.setProperty("--color1", theme.colors[0]);
  root.style.setProperty("--color2", theme.colors[1]);
  root.style.setProperty("--color3", theme.colors[2]);

  if(theme.text === "light"){
    body.classList.remove("text-dark");
    body.classList.add("text-light");
  }else{
    body.classList.remove("text-light");
    body.classList.add("text-dark");
  }

  const nav = document.querySelector("nav");

  if(nav){
    nav.classList.remove("navbar-light","navbar-dark","bg-light","bg-dark","theme-nav");

    if(theme.nav === "light"){
      nav.classList.add("navbar-light","bg-light");
    }
    else if(theme.nav === "dark"){
      nav.classList.add("navbar-dark","bg-dark");
    }
    else{
      nav.classList.add("navbar-dark","theme-nav");
    }
  }
}

/* LOAD THEME */
/* LOAD THEME */
window.addEventListener("DOMContentLoaded", () => {

  const savedTheme = localStorage.getItem("siteTheme");

  if(savedTheme){
    applyTheme(JSON.parse(savedTheme));
  }else{

    // Default Theme (Preset 4)
    const defaultTheme = {
      name: "Preset 4",
      colors: ["#00c0c0", "#ff00c8", "#007bff"],
      text: "light",
      nav: "theme"
    };

    applyTheme(defaultTheme);

    // save so next reload uses same
    localStorage.setItem("siteTheme", JSON.stringify(defaultTheme));
  }

});

// Call loadSavedTheme ------------------------------------------------------------------



 // Log out function
const logoutBtn = document.getElementById("logoutButton");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        firebase.auth().signOut().then(() => {
            window.location.href = "login.html";
        }).catch((error) => {
            alert("Error logging out: " + error.message);
        });
    });
}
