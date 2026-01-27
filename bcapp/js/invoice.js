 // Add this function to handle client name autocomplete
function initializeClientAutocomplete() {
  const clientNameInput = document.getElementById('clientName');
  const clientGSTInput = document.getElementById('clientGST');
  const clientAddressInput = document.getElementById('clientAddress');
  const clientStateInput = document.getElementById('clientState');
  const shipToInput = document.getElementById('shipTo');
  const placeOfSupplyInput = document.getElementById('placeOfSupply');
  
  // Create dropdown container for suggestions
  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.id = 'clientSuggestions';
  suggestionsContainer.className = 'autocomplete-suggestions';
  suggestionsContainer.style.cssText = `
    position: absolute;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
    width: 100%;
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
    display: none;
  `;
  
  // Insert after client name input
  clientNameInput.parentNode.appendChild(suggestionsContainer);
  
  // Store all clients data
  let clientsData = [];
  
  // Fetch all clients from Firebase
  async function fetchAllClients() {
    try {
      const billsRef = firebase.database().ref('bill');
      const snapshot = await billsRef.once('value');
      
      if (!snapshot.exists()) {
        return;
      }
      
      const clientsMap = new Map();
      
      snapshot.forEach(childSnapshot => {
        const billData = childSnapshot.val();
        
        // Check if bill has client information
        if (billData.clientName && billData.clientName.trim()) {
          const clientName = billData.clientName.trim();
          
          // Only add client if not already in map
          if (!clientsMap.has(clientName)) {
            const clientInfo = {
              name: clientName,
              gstin: billData.clientGST || '',
              address: billData.clientAddress || '',
              state: billData.clientState || 'West Bengal',
              shipTo: billData.shipTo || '',
              placeOfSupply: billData.placeOfSupply || ''
            };
            
            clientsMap.set(clientName, clientInfo);
          }
        }
      });
      
      // Convert map to array
      clientsData = Array.from(clientsMap.values());
      console.log(`Loaded ${clientsData.length} clients from database`);
      
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }
  
  // Filter clients based on input
  function filterClients(searchTerm) {
    if (!searchTerm || searchTerm.length < 1) {
      return [];
    }
    
    const term = searchTerm.toLowerCase();
    return clientsData.filter(client => 
      client.name.toLowerCase().includes(term)
    ).slice(0, 10); // Limit to 10 suggestions
  }
  
  // Display suggestions
  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    
    if (suggestions.length === 0) {
      suggestionsContainer.style.display = 'none';
      return;
    }
    
    suggestions.forEach((client, index) => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      suggestionItem.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s;
      `;
      suggestionItem.textContent = client.name;
      
      // Add GSTIN if available
      if (client.gstin) {
        const gstinSpan = document.createElement('span');
        gstinSpan.className = 'text-muted';
        gstinSpan.style.cssText = `
          float: right;
          font-size: 0.85em;
          color: #6c757d !important;
        `;
        gstinSpan.textContent = client.gstin;
        suggestionItem.appendChild(gstinSpan);
      }
      
      suggestionItem.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f9fa';
      });
      
      suggestionItem.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
      });
      
      suggestionItem.addEventListener('click', function() {
        selectClient(client);
        suggestionsContainer.style.display = 'none';
      });
      
      suggestionsContainer.appendChild(suggestionItem);
    });
    
    // Position and show suggestions
    const inputRect = clientNameInput.getBoundingClientRect();
    suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
    suggestionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
    suggestionsContainer.style.width = `${inputRect.width}px`;
    suggestionsContainer.style.display = 'block';
  }
  
  // Select a client and auto-fill fields
  function selectClient(client) {
    // Fill client name
    clientNameInput.value = client.name;
    
    // Get current document type config
    const documentType = document.getElementById('documentType').value;
    const config = documentTypesConfig[documentType];
    
    // Fill GST if field is visible and client has GST
    const clientGSTField = document.getElementById('clientGSTField');
    if (!clientGSTField.classList.contains('field-hidden') && !clientGSTField.classList.contains('d-none')) {
      clientGSTInput.value = client.gstin || '';
      
      // Trigger GST change to update tax fields
      const event = new Event('input');
      clientGSTInput.dispatchEvent(event);
    }
    
    // Fill address if field is visible
    const clientAddressField = document.getElementById('clientAddressField');
    if (!clientAddressField.classList.contains('field-hidden') && !clientAddressField.classList.contains('d-none')) {
      clientAddressInput.value = client.address || '';
    }
    
    // Fill state if field is visible
    const clientStateField = document.getElementById('clientStateField');
    if (!clientStateField.classList.contains('field-hidden') && !clientStateField.classList.contains('d-none')) {
      clientStateInput.value = client.state || 'West Bengal';
    }
    
    // Fill ship to if field is visible
    const shipToSection = document.getElementById('shipToSection');
    if (!shipToSection.classList.contains('d-none') && config && config.saveShipTo) {
      shipToInput.value = client.shipTo || '';
    }
    
    // Fill place of supply if field is visible
    const placeOfSupplyField = document.getElementById('placeOfSupplyField');
    if (!placeOfSupplyField.classList.contains('field-hidden') && !placeOfSupplyField.classList.contains('d-none')) {
      placeOfSupplyInput.value = client.placeOfSupply || '';
    }
    
    // Focus on next field
    setTimeout(() => {
      if (clientGSTField.style.display !== 'none') {
        clientGSTInput.focus();
      } else if (clientAddressField.style.display !== 'none') {
        clientAddressInput.focus();
      }
    }, 10);
  }
  
  // Event listener for input
  clientNameInput.addEventListener('input', function() {
    const searchTerm = this.value.trim();
    
    if (searchTerm.length < 1) {
      suggestionsContainer.style.display = 'none';
      return;
    }
    
    const suggestions = filterClients(searchTerm);
    showSuggestions(suggestions);
  });
  
  // Event listener for focus
  clientNameInput.addEventListener('focus', function() {
    const searchTerm = this.value.trim();
    
    if (searchTerm.length > 0) {
      const suggestions = filterClients(searchTerm);
      showSuggestions(suggestions);
    }
  });
  
  // Hide suggestions when clicking outside
  document.addEventListener('click', function(event) {
    if (!clientNameInput.contains(event.target) && !suggestionsContainer.contains(event.target)) {
      suggestionsContainer.style.display = 'none';
    }
  });
  
  // Keyboard navigation
  clientNameInput.addEventListener('keydown', function(event) {
    const visibleItems = suggestionsContainer.querySelectorAll('.suggestion-item');
    
    if (visibleItems.length === 0) return;
    
    const currentActive = suggestionsContainer.querySelector('.suggestion-item.active');
    let currentIndex = -1;
    
    if (currentActive) {
      currentIndex = Array.from(visibleItems).indexOf(currentActive);
    }
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < visibleItems.length - 1) {
          if (currentActive) currentActive.classList.remove('active');
          visibleItems[currentIndex + 1].classList.add('active');
          visibleItems[currentIndex + 1].style.backgroundColor = '#007bff';
          visibleItems[currentIndex + 1].style.color = 'white';
        } else if (visibleItems.length > 0) {
          if (currentActive) currentActive.classList.remove('active');
          visibleItems[0].classList.add('active');
          visibleItems[0].style.backgroundColor = '#007bff';
          visibleItems[0].style.color = 'white';
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          if (currentActive) currentActive.classList.remove('active');
          visibleItems[currentIndex - 1].classList.add('active');
          visibleItems[currentIndex - 1].style.backgroundColor = '#007bff';
          visibleItems[currentIndex - 1].style.color = 'white';
        }
        break;
        
      case 'Enter':
        event.preventDefault();
        if (currentActive) {
          const clientName = currentActive.textContent.replace(currentActive.querySelector('.text-muted')?.textContent || '', '').trim();
          const selectedClient = clientsData.find(client => client.name === clientName);
          if (selectedClient) {
            selectClient(selectedClient);
            suggestionsContainer.style.display = 'none';
          }
        }
        break;
        
      case 'Escape':
        suggestionsContainer.style.display = 'none';
        break;
    }
  });
  
  // Also add some CSS for the active suggestion
  const style = document.createElement('style');
  style.textContent = `
    .suggestion-item.active {
      background-color: #007bff !important;
      color: white !important;
    }
    .suggestion-item:hover {
      background-color: #f8f9fa !important;
    }
    .autocomplete-suggestions::-webkit-scrollbar {
      width: 8px;
    }
    .autocomplete-suggestions::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .autocomplete-suggestions::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    .autocomplete-suggestions::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;
  document.head.appendChild(style);
  
  // Fetch clients when page loads
  fetchAllClients();
  
  // Also fetch clients when document type changes (in case different clients are used)
  document.getElementById('documentType').addEventListener('change', function() {
    setTimeout(fetchAllClients, 100);
  });
}

// Initialize the autocomplete when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for other initializations to complete
  setTimeout(initializeClientAutocomplete, 1000);
});




// Add product autocomplete function
function initializeProductAutocomplete() {
  // Store all products data
  let productsData = [];
  
  // Fetch all products from Firebase
  async function fetchAllProducts() {
    try {
      const productsRef = firebase.database().ref('products');
      const snapshot = await productsRef.once('value');
      
      if (!snapshot.exists()) {
        console.log('No products found in database');
        return;
      }
      
      productsData = [];
      snapshot.forEach(childSnapshot => {
        const product = childSnapshot.val();
        product.id = childSnapshot.key;
        
        // Only add active products (status !== 'inactive')
        if (product.status !== 'inactive') {
          productsData.push({
            id: product.id,
            name: product.name || '',
            hsn: product.hsn || '38245090',
            unit: product.unit || 'Nos',
            price: product.price || 0,
            description: product.description || ''
          });
        }
      });
      
      // Sort products by name
      productsData.sort((a, b) => a.name.localeCompare(b.name));
      
      console.log(`Loaded ${productsData.length} products from database`);
      
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
  
  // Create dropdown for product suggestions
  function createProductSuggestionsContainer(inputElement) {
    const containerId = `productSuggestions-${Date.now()}`;
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = containerId;
    suggestionsContainer.className = 'product-autocomplete-suggestions';
    suggestionsContainer.style.cssText = `
      position: absolute;
      background: white;
      border: 1px solid #dee2e6;
      border-radius: 0.375rem;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1001;
      width: 100%;
      box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
      display: none;
    `;
    
    return suggestionsContainer;
  }
  
  // Filter products based on input
  function filterProducts(searchTerm) {
    if (!searchTerm || searchTerm.length < 1) {
      return [];
    }
    
    const term = searchTerm.toLowerCase();
    return productsData.filter(product => 
      product.name.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term)) ||
      (product.hsn && product.hsn.includes(term))
    ).slice(0, 10); // Limit to 10 suggestions
  }
  
  // Display product suggestions
  function showProductSuggestions(inputElement, suggestions) {
    // Remove existing suggestions container
    const existingContainer = inputElement.parentNode.querySelector('.product-autocomplete-suggestions');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    if (suggestions.length === 0) {
      return;
    }
    
    // Create new suggestions container
    const suggestionsContainer = createProductSuggestionsContainer(inputElement);
    inputElement.parentNode.appendChild(suggestionsContainer);
    
    suggestions.forEach((product, index) => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'product-suggestion-item';
      suggestionItem.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;
      
      // Create main content
      const mainContent = document.createElement('div');
      mainContent.style.flex = '1';
      
      // Product name
      const nameSpan = document.createElement('div');
      nameSpan.style.fontWeight = '500';
      nameSpan.textContent = product.name;
      mainContent.appendChild(nameSpan);
      
      // Product details (HSN, Unit, Price)
      const detailsSpan = document.createElement('div');
      detailsSpan.className = 'text-muted';
      detailsSpan.style.cssText = `
        font-size: 0.85em;
        margin-top: 2px;
      `;
      detailsSpan.textContent = `${product.hsn} | ${product.unit} | ₹${parseFloat(product.price).toFixed(2)}`;
      mainContent.appendChild(detailsSpan);
      
      // Description if available
      if (product.description) {
        const descSpan = document.createElement('div');
        descSpan.className = 'text-muted';
        descSpan.style.cssText = `
          font-size: 0.8em;
          margin-top: 2px;
          font-style: italic;
        `;
        descSpan.textContent = product.description.length > 50 ? 
          product.description.substring(0, 50) + '...' : product.description;
        mainContent.appendChild(descSpan);
      }
      
      suggestionItem.appendChild(mainContent);
      
      // Add "Select" button on the right
      const selectBtn = document.createElement('button');
      selectBtn.type = 'button';
      selectBtn.className = 'btn btn-sm btn-outline-primary';
      selectBtn.style.cssText = `
        font-size: 0.75em;
        padding: 2px 8px;
        white-space: nowrap;
      `;
      selectBtn.textContent = 'Select';
      selectBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        selectProduct(inputElement, product);
        suggestionsContainer.style.display = 'none';
      });
      suggestionItem.appendChild(selectBtn);
      
      // Hover effects
      suggestionItem.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f9fa';
      });
      
      suggestionItem.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
      });
      
      // Click on the entire item
      suggestionItem.addEventListener('click', function(e) {
        if (!selectBtn.contains(e.target)) {
          selectProduct(inputElement, product);
          suggestionsContainer.style.display = 'none';
        }
      });
      
      suggestionsContainer.appendChild(suggestionItem);
    });
    
    // Position and show suggestions
    const inputRect = inputElement.getBoundingClientRect();
    suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
    suggestionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
    suggestionsContainer.style.width = `${inputRect.width}px`;
    suggestionsContainer.style.display = 'block';
  }
  
  // Select a product and auto-fill the entire row
  function selectProduct(inputElement, product) {
    const row = inputElement.closest('tr');
    
    if (!row) return;
    
    // Fill the entire row with product data
    const nameInput = row.querySelector('.item-name');
    const hsnInput = row.querySelector('.item-hsn');
    const unitInput = row.querySelector('.item-unit');
    const priceInput = row.querySelector('.item-price');
    const quantityInput = row.querySelector('.item-quantity');
    
    if (nameInput) nameInput.value = product.name;
    if (hsnInput) hsnInput.value = product.hsn;
    if (unitInput) unitInput.value = product.unit;
    if (priceInput) {
      priceInput.value = parseFloat(product.price).toFixed(2);
      
      // Trigger input event to calculate amount
      const event = new Event('input', { bubbles: true });
      priceInput.dispatchEvent(event);
    }
    
    // Focus on quantity field if it's empty or has default value
    if (quantityInput) {
      const currentQty = parseFloat(quantityInput.value);
      if (currentQty === 0 || currentQty === 1 || !currentQty) {
        quantityInput.focus();
        quantityInput.select();
      }
    }
    
    // Recalculate totals
    calculateAndDisplayTotals();
  }
  
  // Initialize autocomplete for all item name inputs
  function initializeItemAutocomplete() {
    const itemNameInputs = document.querySelectorAll('.item-name');
    
    itemNameInputs.forEach(input => {
      // Remove existing event listeners
      const newInput = input.cloneNode(true);
      input.parentNode.replaceChild(newInput, input);
      
      // Add new event listeners
      newInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm.length < 1) {
          const container = this.parentNode.querySelector('.product-autocomplete-suggestions');
          if (container) {
            container.style.display = 'none';
          }
          return;
        }
        
        const suggestions = filterProducts(searchTerm);
        showProductSuggestions(this, suggestions);
      });
      
      newInput.addEventListener('focus', function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm.length > 0) {
          const suggestions = filterProducts(searchTerm);
          showProductSuggestions(this, suggestions);
        }
      });
      
      // Handle blur with delay to allow clicking on suggestions
      newInput.addEventListener('blur', function() {
        setTimeout(() => {
          const container = this.parentNode.querySelector('.product-autocomplete-suggestions');
          if (container) {
            container.style.display = 'none';
          }
        }, 200);
      });
    });
  }
  
  // Keyboard navigation for product suggestions
  document.addEventListener('keydown', function(event) {
    const activeSuggestions = document.querySelector('.product-autocomplete-suggestions[style*="display: block"]');
    
    if (!activeSuggestions) return;
    
    const visibleItems = activeSuggestions.querySelectorAll('.product-suggestion-item');
    if (visibleItems.length === 0) return;
    
    const currentActive = activeSuggestions.querySelector('.product-suggestion-item.active');
    let currentIndex = -1;
    
    if (currentActive) {
      currentIndex = Array.from(visibleItems).indexOf(currentActive);
    }
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < visibleItems.length - 1) {
          if (currentActive) currentActive.classList.remove('active');
          visibleItems[currentIndex + 1].classList.add('active');
          visibleItems[currentIndex + 1].style.backgroundColor = '#007bff';
          visibleItems[currentIndex + 1].style.color = 'white';
        } else if (visibleItems.length > 0) {
          if (currentActive) currentActive.classList.remove('active');
          visibleItems[0].classList.add('active');
          visibleItems[0].style.backgroundColor = '#007bff';
          visibleItems[0].style.color = 'white';
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          if (currentActive) currentActive.classList.remove('active');
          visibleItems[currentIndex - 1].classList.add('active');
          visibleItems[currentIndex - 1].style.backgroundColor = '#007bff';
          visibleItems[currentIndex - 1].style.color = 'white';
        } else if (currentIndex === 0) {
          if (currentActive) currentActive.classList.remove('active');
        }
        break;
        
      case 'Enter':
        event.preventDefault();
        if (currentActive) {
          const selectBtn = currentActive.querySelector('button');
          if (selectBtn) {
            selectBtn.click();
          }
        }
        break;
        
      case 'Escape':
        activeSuggestions.style.display = 'none';
        break;
    }
  });
  
  // Hide suggestions when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.product-autocomplete-suggestions') && 
        !event.target.classList.contains('item-name')) {
      document.querySelectorAll('.product-autocomplete-suggestions').forEach(container => {
        container.style.display = 'none';
      });
    }
  });
  
  // Add CSS for product autocomplete
  const style = document.createElement('style');
  style.textContent = `
    .product-suggestion-item.active {
      background-color: #007bff !important;
      color: white !important;
    }
    .product-suggestion-item.active .text-muted {
      color: rgba(255,255,255,0.8) !important;
    }
    .product-suggestion-item.active button {
      border-color: white !important;
      color: white !important;
    }
    .product-suggestion-item:hover {
      background-color: #f8f9fa !important;
    }
    .product-autocomplete-suggestions::-webkit-scrollbar {
      width: 8px;
    }
    .product-autocomplete-suggestions::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .product-autocomplete-suggestions::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }
    .product-autocomplete-suggestions::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;
  document.head.appendChild(style);
  
  // Initialize when page loads
  fetchAllProducts().then(() => {
    initializeItemAutocomplete();
  });
  
  // Re-initialize when new items are added
  document.addEventListener('DOMContentLoaded', function() {
    // Observe changes to the items table to re-initialize autocomplete
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          // Check if new item rows were added
          const addedNodes = Array.from(mutation.addedNodes);
          const hasNewItem = addedNodes.some(node => 
            node.nodeType === 1 && (node.matches('tr') || node.querySelector('.item-name'))
          );
          
          if (hasNewItem) {
            setTimeout(() => {
              initializeItemAutocomplete();
            }, 100);
          }
        }
      });
    });
    
    // Start observing the items table body
    const itemsTableBody = document.getElementById('itemsTableBody');
    if (itemsTableBody) {
      observer.observe(itemsTableBody, { childList: true, subtree: false });
    }
  });
  
  // Return function to manually reinitialize
  return {
    reinitialize: function() {
      fetchAllProducts().then(() => {
        initializeItemAutocomplete();
      });
    }
  };
}

// Initialize product autocomplete when DOM is loaded
let productAutocomplete;
document.addEventListener('DOMContentLoaded', function() {
  // Initialize after a short delay to ensure other components are loaded
  setTimeout(() => {
    productAutocomplete = initializeProductAutocomplete();
  }, 1500);
  
  // Also reinitialize when document type changes (in case different products are used)
  document.getElementById('documentType').addEventListener('change', function() {
    if (productAutocomplete && productAutocomplete.reinitialize) {
      setTimeout(() => {
        productAutocomplete.reinitialize();
      }, 500);
    }
  });
});

// Also initialize when the "Add Item" button is clicked
document.getElementById('addItemBtn').addEventListener('click', function() {
  // Wait for the new row to be added, then reinitialize autocomplete
  setTimeout(() => {
    if (productAutocomplete && productAutocomplete.reinitialize) {
      productAutocomplete.reinitialize();
    }
  }, 100);
});




function updatePaymentVisibility(config) {
  const paymentRows = document.querySelectorAll('.payment-row');

  paymentRows.forEach(row => {
    if (config.PaymentStatusFunctionality) {
      row.classList.remove('d-none');
    } else {
      row.classList.add('d-none');
    }
  });
}
