

 document.addEventListener("DOMContentLoaded", () => {

    const pageTitles = {
      "index.html": "Projects",
      "employee.html": "Employee Management",
      "attendance.html": "Daily Attendance",
      "product.html": "Product Management",
      "measurement-sheet.html": "Measurement Sheet",
      "settings.html": "Settings",
      "bill-index.html": "Generate Invoice",
      "display-bill.html": "Bills Overview",
      "payment-dailyworker.html": "Daily Worker Payment",
      "payment-monthlystaff.html": "Monthly Staff Payment",
      "client-report.html": "Client Report",
      "user.html": "Users",
      "expense.html": "Expenses",
      "earnings.html": "Earnings"
    };

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    // wait until nav.html is injected
    setTimeout(() => {
      const titleElement = document.getElementById("pageTitle");
      if (titleElement && pageTitles[currentPage]) {
        titleElement.textContent = pageTitles[currentPage];
      }
    }, 50);
  });


// Global variable to store user role
let userRole = 'user';
const AUTH_CACHE_KEY = 'firebase_auth_cache';
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

// Function to get cached auth data
function getCachedAuthData() {
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (!cached) return null;
    
    const data = JSON.parse(cached);
    
    // Check if cache is expired
    if (Date.now() - data.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(AUTH_CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error reading cached auth data:", error);
    return null;
  }
}

// Function to cache auth data
function cacheAuthData(userId, role) {
  try {
    const cacheData = {
      userId: userId,
      role: role,
      timestamp: Date.now()
    };
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching auth data:", error);
  }
}

// Function to clear cached auth data
function clearCachedAuthData() {
  localStorage.removeItem(AUTH_CACHE_KEY);
}

// Function to get user role from Firebase or cache
async function getUserRole() {
  return new Promise(async (resolve) => {
    try {
      const cachedData = getCachedAuthData();
      const user = firebase.auth().currentUser;

      if (!user) {
        clearCachedAuthData();
        resolve('user');
        return;
      }

      if (cachedData && cachedData.userId === user.uid) {
        resolve(cachedData.role);
        return;
      }

      const userSnapshot = await firebase
        .database()
        .ref(`users/${user.uid}`)
        .once('value');

      const userData = userSnapshot.val();
      const role = userData?.role || 'user';

      cacheAuthData(user.uid, role);
      resolve(role);

    } catch (error) {
      resolve('user');
    }
  });
}


async function getUserAccess() {
  try {
    const user = firebase.auth().currentUser;
    if (!user) return {};

    const snap = await firebase
      .database()
      .ref(`users/${user.uid}/user-access`)
      .once("value");

    return snap.val() || {};
  } catch (err) {
    console.error("Error fetching user-access:", err);
    return {};
  }
}


function toggleFeatureMenus(access = {}) {
  const featureMap = {
    bill: ".feature-bill",
    products: ".feature-products",
    measurementSheet: ".feature-measurementSheet"
  };

  Object.keys(featureMap).forEach(key => {
    const elements = document.querySelectorAll(featureMap[key]);

    elements.forEach(el => {
      el.style.display = access[key] ? "" : "none";
    });
  });

  if (userRole === "admin") {
  document.querySelectorAll(
    ".feature-bill, .feature-products, .feature-measurementSheet"
  ).forEach(el => el.style.display = "");
  return;
}

}


// Main function to load navbar and handle admin elements
async function loadNavbarAndAuth() {
  try {
    // Load navbar
    const navResponse = await fetch("/nav.html");
    const navHtml = await navResponse.text();
    document.getElementById("nav-placeholder").innerHTML = navHtml;

   // initThemeToggle();

    // Setup auth state listener
    firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        // Clear cache and redirect to login
        clearCachedAuthData();
        window.location.href = "login.html";
        return;
      }
      
      // Get user role and toggle admin elements
      const role = await getUserRole();
toggleAdminElements(role);

// Feature access
const access = await getUserAccess();
toggleFeatureMenus(access);



      await getUserAccess();
      
      // Set up active menu highlighting and auto-open collapse
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      
      // Use requestAnimationFrame instead of setTimeout for better timing
      requestAnimationFrame(() => {
        setTimeout(() => setupMenuHighlights(currentPage, role), 50);
      });
    });
    
  } catch (error) {
    console.error('Error loading navbar:', error);
  }
}

// Function to setup menu highlights
function setupMenuHighlights(currentPage, role) {
  const sidebarLinks = document.querySelectorAll("#sidebarMenu a");
  
  // Define menu structure with parent and subpages
  const menuStructure = {
    "Menu": {
      subpages: ["bill-index.html", "display-bill.html", "payment-dailyworker.html", "payment-monthlystaff.html"],
      parentLink: 'a[href="#Menu"]'
    },
    "ProjectMenu": {
      subpages: ["expense.html", "earnings.html", "employee.html"],
      parentLink: 'a[href="#ProjectMenu"]'
    },
    "adminMenu": {
      subpages: ["user.html", "client-report.html"],
      parentLink: 'a[href="#adminMenu"]'
    }
  };
  
  sidebarLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    
    // Check if this link matches the current page
    if (linkHref === currentPage || 
        (linkHref === "#" && currentPage.includes("index"))) {
      link.classList.add("active");
      link.classList.add("border");
      link.classList.remove("text-white");
      
      // Check all menu structures for matches
      Object.keys(menuStructure).forEach(menuId => {
        const menu = menuStructure[menuId];
        
        if (menu.subpages.includes(currentPage)) {
          // Find and open the collapse
          const collapseElement = document.getElementById(menuId);
          if (collapseElement) {
            const bsCollapse = new bootstrap.Collapse(collapseElement, {
              toggle: false
            });
            bsCollapse.show();
            
            // Highlight the parent dropdown link
            const parentDropdown = document.querySelector(menu.parentLink);
            if (parentDropdown) {
              parentDropdown.classList.add("active");
              parentDropdown.classList.add("border");
              // For admin menu, keep bg-warning but adjust text color
              if (menuId === "adminMenu") {
                parentDropdown.classList.remove("text-dark");
                parentDropdown.classList.add("text-dark");
              } else {
                parentDropdown.classList.remove("text-white");
                parentDropdown.classList.add("text-white");
              }
            }
          }
        }
      });
    }
  });
  
  // Special case: if current page is user.html and user is admin, 
  // we need to ensure the foradmin element is visible first
  if (currentPage === "user.html" && role === "admin") {
    // Find and open the adminMenu collapse
    const adminCollapse = document.getElementById("adminMenu");
    if (adminCollapse) {
      const bsCollapse = new bootstrap.Collapse(adminCollapse, {
        toggle: false
      });
      bsCollapse.show();
      
      // Highlight the admin menu parent link
      const adminParentLink = document.querySelector('a[href="#adminMenu"]');
      if (adminParentLink) {
        adminParentLink.classList.add("active");
        adminParentLink.classList.add("border");
      }
    }
  }
}

// Update toggleAdminElements to handle dynamic visibility better
function toggleAdminElements(role) {
  // Store role globally for other functions to use
  userRole = role;
  
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    const adminElements = document.querySelectorAll('.foradmin');

    adminElements.forEach(element => {
      if (role === 'admin') {
        // Remove the display: none style and foradmin class
        element.style.display = '';
        element.classList.remove('foradmin');
        element.classList.add('admin-visible');
      } else {
        // Ensure elements are hidden for non-admin users
        element.style.display = 'none';
        element.classList.add('foradmin');
        element.classList.remove('admin-visible');
      }
    });
    
    // Add data attribute to body for CSS targeting
    document.body.setAttribute('data-user-role', role);
    
    // Toggle body classes
    if (role === 'admin') {
      document.body.classList.add('is-admin');
      document.body.classList.remove('is-user');
    } else {
      document.body.classList.add('is-user');
      document.body.classList.remove('is-admin');
    }
    
  });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Check if we have cached data and user is logged in
  const cachedData = getCachedAuthData();
  if (cachedData) {
    // Immediately apply cached role while waiting for Firebase
    toggleAdminElements(cachedData.role);
  }
  
  loadNavbarAndAuth();
});

// Logout function
function logout() {
  // Clear cache before signing out
  clearCachedAuthData();
  
  firebase.auth().signOut()
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Logout failed: " + error.message);
    });
}

// // Create project function
// async function saveProject() {
//   // Use requireAdmin to check permissions
//   const allowed = requireAdmin(() => true);
//   if (!allowed) return;
  
//   const projectName = document.getElementById("projectName").value.trim();
//   const user = firebase.auth().currentUser;

//   if (!projectName) {
//     alert("Project name required");
//     return;
//   }

//   if (!user) {
//     alert("User not logged in");
//     return;
//   }

//   try {
//     const projectRef = firebase.database().ref("projects").push();
//     await projectRef.set({
//       projectName: projectName,
//       createdBy: user.uid,
//       createdAt: new Date().toISOString()
//     });
    
//     alert("Project created");
//     document.getElementById("projectName").value = "";
    
//     // Hide modal
//     const modal = bootstrap.Modal.getInstance(document.getElementById("createProjectModal"));
//     if (modal) {
//       modal.hide();
//     }
    
//   } catch (err) {
//     alert(err.message);
//   }
//
// Admin requirement function
function requireAdmin(callback) {
  if (userRole !== 'admin') {
    alert('Admin privileges required');
    return false;
  }
  return callback();
}







// Function to get user-access permissions
// async function getUserAccess() {
//   try {
//     const user = firebase.auth().currentUser;

//     if (!user) {
//       console.warn("No logged-in user");
//       return null;
//     }

//     const snapshot = await firebase
//       .database()
//       .ref(`users/${user.uid}/user-access`)
//       .once("value");

//     const accessData = snapshot.val() || {};

//     console.log("User Access Permissions:", accessData);

//     // Example usage logs
//     console.log("Logged in UID:", firebase.auth().currentUser.uid);

//     console.log("Bill Access:", accessData.bill);
//     console.log("Measurement Sheet Access:", accessData.measurementSheet);
//     console.log("Products Access:", accessData.products);

//     return accessData;

//   } catch (error) {
//     console.error("Error fetching user-access:", error);
//     return null;
//   }
// }
