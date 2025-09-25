// Function to load saved background and apply to page elements
function loadSavedBackground() {
    const savedBackground = localStorage.getItem('selectedBackground');
    const savedGradientName = localStorage.getItem('selectedGradientName');
    
    // Default background gradient
    const defaultBackground = 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)';
    const defaultGradientName = 'Sunset';
    
    let backgroundToApply = savedBackground || defaultBackground;
    let gradientNameToApply = savedGradientName || defaultGradientName;
    
    // Apply to body
    document.body.style.background = backgroundToApply;
    document.body.style.backgroundAttachment = 'fixed';
    
    // Apply reversed gradient to navigation bar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Extract colors from the background and reverse them
        const reversedGradient = reverseGradient(backgroundToApply);
        navbar.style.background = reversedGradient;
        navbar.style.border = 'none';
        
        // Adjust text color for better contrast
        adjustNavbarContrast(navbar, backgroundToApply);
    }
    
    // Adjust body text color based on background brightness
    adjustBodyTextColor(backgroundToApply);
    
    // Optional: Update a gradient indicator if you have one
    const gradientIndicator = document.getElementById('currentGradient');
    if (gradientIndicator) {
        gradientIndicator.textContent = `Current Gradient: ${gradientNameToApply}`;
    }
}

// Function to reverse gradient colors AND darken them
function reverseGradient(gradientCSS) {
    // Extract color values from the gradient CSS
    const colorMatches = gradientCSS.match(/#[0-9A-Fa-f]{6}/g);
    
    if (colorMatches && colorMatches.length >= 2) {
        // Reverse and darken colors
        const reversedColors = [...colorMatches].reverse().map(color => darkenColor(color, 40)); 
        // 40 = amount of darkening (increase/decrease as needed)
        
        // Rebuild the gradient with reversed & darkened colors
        if (gradientCSS.includes('linear-gradient')) {
            let i = 0;
            return gradientCSS.replace(/#[0-9A-Fa-f]{6}/g, () => reversedColors[i++]);
        }
    }
    
    // Fallback: return original if parsing fails
    return gradientCSS;
}

// Helper: Darken a hex color by reducing RGB values
function darkenColor(hex, amount) {
    let r = parseInt(hex.substr(1, 2), 16) - amount;
    let g = parseInt(hex.substr(3, 2), 16) - amount;
    let b = parseInt(hex.substr(5, 2), 16) - amount;
    
    r = Math.max(0, r);
    g = Math.max(0, g);
    b = Math.max(0, b);
    
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Function to calculate brightness of a color
function getColorBrightness(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}

// Function to adjust body text color based on background brightness
function adjustBodyTextColor(gradientCSS) {
    const colorMatches = gradientCSS.match(/#[0-9A-Fa-f]{6}/g);
    
    if (colorMatches && colorMatches.length > 0) {
        // Calculate average brightness of all colors in the gradient
        let totalBrightness = 0;
        colorMatches.forEach(color => {
            totalBrightness += getColorBrightness(color);
        });
        const averageBrightness = totalBrightness / colorMatches.length;
        
        // Set text color based on average brightness
        if (averageBrightness < 128) {
            // Dark background - use light text
            document.body.style.color = '#ffffff';
            
            // Adjust other text elements for better contrast (excluding modals)
            adjustAdditionalTextElements('#ffffff', '#333333');
        } else {
            // Light background - use dark text
            document.body.style.color = '#333333';
            
            // Adjust other text elements for better contrast (excluding modals)
            adjustAdditionalTextElements('#333333', '#ffffff');
        }
    }
}

// Function to adjust additional text elements across all pages (excluding modals)
function adjustAdditionalTextElements(textColor, backgroundColor) {
    // Exclude modal elements by using :not() selector
    const excludeModals = ':not(.modal *):not([data-bs-toggle="modal"]):not([data-toggle="modal"])';
    
    // Adjust headings (excluding those inside modals)
    const headings = document.querySelectorAll(`h1${excludeModals}, h2${excludeModals}, h3${excludeModals}, h4${excludeModals}, h5${excludeModals}, h6${excludeModals}`);
    headings.forEach(heading => {
        heading.style.color = textColor;
    });
    
    // Adjust paragraphs (excluding those inside modals)
    const paragraphs = document.querySelectorAll(`p${excludeModals}`);
    paragraphs.forEach(p => {
        p.style.color = textColor;
    });
    
    // Adjust links (excluding navbar and modal links)
    const links = document.querySelectorAll(`a:not(.navbar a):not(.dropdown-menu a)${excludeModals}`);
    links.forEach(link => {
        link.style.color = textColor;
        link.style.borderBottom = `1px solid ${textColor}`;
    });
    
    // Adjust list items (excluding those inside modals)
    const listItems = document.querySelectorAll(`li${excludeModals}`);
    listItems.forEach(li => {
        li.style.color = textColor;
    });
    
    // Adjust cards, containers (excluding modals)
    const elementsWithBg = document.querySelectorAll(` .bg-light${excludeModals}, .bg-white${excludeModals}`);
    elementsWithBg.forEach(element => {
        // Only adjust if element has light background class and is not in modal
        if (!element.closest('.modal') && 
            (element.classList.contains('bg-light') || element.classList.contains('bg-white') || 
             element.classList.contains('card') || element.classList.contains('container'))) {
            element.style.backgroundColor = backgroundColor + 'dd'; // Add transparency
            element.style.color = textColor;
        }
    });
    
    // Adjust table text (excluding modal tables)
    const tableCells = document.querySelectorAll(`td${excludeModals}, th${excludeModals}`);
    tableCells.forEach(cell => {
        if (!cell.closest('.modal')) {
            cell.style.color = textColor;
        }
    });
    
    // Adjust form elements (excluding modal forms)
    const formElements = document.querySelectorAll(` textarea${excludeModals},  label${excludeModals}`);
    formElements.forEach(element => {
        if (!element.closest('.modal')) {
            element.style.color = textColor;
        }
    });
    
    // Adjust blockquotes (excluding modal blockquotes)
    const blockquotes = document.querySelectorAll(`blockquote${excludeModals}`);
    blockquotes.forEach(quote => {
        if (!quote.closest('.modal')) {
            quote.style.color = textColor;
            quote.style.borderLeftColor = textColor;
        }
    });
}

// Function to adjust navbar contrast based on gradient brightness
function adjustNavbarContrast(navbar, gradientCSS) {
    // Simple brightness detection based on gradient colors
    const colorMatches = gradientCSS.match(/#[0-9A-Fa-f]{6}/g);
    let isDark = false;
    
    if (colorMatches) {
        // Check if most colors are dark
        const darkColors = colorMatches.filter(color => {
            const brightness = getColorBrightness(color);
            return brightness < 128; // Dark color threshold
        });
        
        isDark = darkColors.length >= colorMatches.length / 2;
    }
    
    if (isDark) {
        navbar.classList.add('navbar-dark');
        navbar.classList.remove('navbar-light', 'bg-light');
        
        // Style navbar links for better visibility
        const navbarLinks = navbar.querySelectorAll('a, .dropdown-menu a');
        navbarLinks.forEach(link => {
            link.style.color = '#ffffff';
        });
        
        // Apply same white color to icons
        const icons = document.querySelectorAll('.icons-index, .icons-index-text');
        icons.forEach(icon => {
            icon.style.color = '#ffffff';
            icon.style.background = 'none'; // remove gradient clip
        });
        
        // Style dropdown menu
        const dropdownMenu = navbar.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.style.background = 'rgba(0, 0, 0, 0.8)';
            dropdownMenu.style.backdropFilter = 'blur(10px)';
        }
    } else {
        navbar.classList.add('navbar-light');
        navbar.classList.remove('navbar-dark');
        
        // Ensure light text on light backgrounds
        const navbarLinks = navbar.querySelectorAll('a, .dropdown-menu a');
        navbarLinks.forEach(link => {
            link.style.color = '#000000';
        });
        
        // Apply same black color to icons
        const icons = document.querySelectorAll('.icons-index, .icons-index-text');
        icons.forEach(icon => {
            icon.style.color = '#000000';
            icon.style.background = 'none'; // remove gradient clip
        });
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', loadSavedBackground);