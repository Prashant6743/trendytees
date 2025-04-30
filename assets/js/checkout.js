// Checkout Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the checkout page
    initCheckout();
    
    // Add event listeners
    setupEventListeners();
    
    // Update cart count in the navigation
    updateCartCount();
});

/**
 * Initialize the checkout page
 */
function initCheckout() {
    // Load cart items from localStorage
    loadCartItems();
    
    // Calculate and update order summary
    updateOrderSummary();
    
    // Show toast notification
    showToast('success', 'Ready to checkout', 'Please fill in your information to continue');
}

/**
 * Load cart items from localStorage and display in the order summary
 */
function loadCartItems() {
    const summaryItemsContainer = document.getElementById('summary-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Clear the container
    summaryItemsContainer.innerHTML = '';
    
    // If cart is empty, redirect to cart page
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Add each cart item to the summary
    cart.forEach(item => {
        const summaryItem = createSummaryItem(item);
        summaryItemsContainer.appendChild(summaryItem);
    });
}

/**
 * Create a summary item element
 * @param {Object} item - The cart item
 * @returns {HTMLElement} - The summary item element
 */
function createSummaryItem(item) {
    const summaryItem = document.createElement('div');
    summaryItem.className = 'summary-item';
    
    // Format price for display
    const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '').replace('₹', '')) : item.price;
    const formattedPrice = `₹${price.toFixed(2)}`;
    
    // Calculate item total
    const itemTotal = price * item.quantity;
    const formattedTotal = `₹${itemTotal.toFixed(2)}`;
    
    summaryItem.innerHTML = `
        <div class="item-details">
            <div style="position: relative;">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <span class="item-quantity">${item.quantity}</span>
            </div>
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>
            </div>
        </div>
        <span class="item-price">${formattedTotal}</span>
    `;
    
    return summaryItem;
}

/**
 * Update the order summary with calculations
 */
function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    // Calculate subtotal
    let subtotal = 0;
    cart.forEach(item => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
        subtotal += price * item.quantity;
    });
    
    // Update the DOM
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    totalElement.textContent = `₹${subtotal.toFixed(2)}`;
    
    // Save order summary to localStorage
    localStorage.setItem('orderSummary', JSON.stringify({
        subtotal: subtotal,
        shipping: 'Calculated at next step',
        tax: 'Calculated at next step',
        total: subtotal
    }));
}

/**
 * Set up event listeners for the checkout page
 */
function setupEventListeners() {
    // Continue to shipping button
    const continueBtn = document.getElementById('continue-to-shipping');
    if (continueBtn) {
        continueBtn.addEventListener('click', continueToShipping);
    }
    
    // Apply promo code button
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Form validation
    const formInputs = document.querySelectorAll('input[required], select[required]');
    formInputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });
}

/**
 * Continue to the shipping step
 */
function continueToShipping() {
    // Validate the form
    const isValid = validateForm();
    
    if (!isValid) {
        showToast('error', 'Form Incomplete', 'Please fill in all required fields');
        return;
    }
    
    // Save customer information to localStorage
    saveCustomerInfo();
    
    // Show loading state
    const continueBtn = document.getElementById('continue-to-shipping');
    continueBtn.innerHTML = '<span class="loading-indicator"></span> Processing...';
    continueBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(() => {
        // Navigate to the shipping page
        window.location.href = 'shipping.html';
    }, 1000);
}

/**
 * Update the checkout progress indicator
 * @param {string} step - The current step (cart, information, shipping, payment)
 */
function updateCheckoutProgress(step) {
    const steps = document.querySelectorAll('.progress-step');
    const lines = document.querySelectorAll('.progress-line');
    
    // Reset all steps
    steps.forEach(s => s.classList.remove('active'));
    lines.forEach(l => l.classList.remove('active'));
    
    // Set active steps based on current step
    switch (step) {
        case 'cart':
            steps[0].classList.add('active');
            break;
        case 'information':
            steps[0].classList.add('active');
            steps[1].classList.add('active');
            lines[0].classList.add('active');
            break;
        case 'shipping':
            steps[0].classList.add('active');
            steps[1].classList.add('active');
            steps[2].classList.add('active');
            lines[0].classList.add('active');
            lines[1].classList.add('active');
            break;
        case 'payment':
            steps.forEach(s => s.classList.add('active'));
            lines.forEach(l => l.classList.add('active'));
            break;
    }
}

/**
 * Save customer information to localStorage
 */
function saveCustomerInfo() {
    const customerInfo = {
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        address: document.getElementById('address').value,
        apartment: document.getElementById('apartment').value,
        city: document.getElementById('city').value,
        country: document.getElementById('country').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        newsletter: document.getElementById('newsletter').checked,
        saveInfo: document.getElementById('save-info').checked
    };
    
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
}

/**
 * Apply a promo code to the order
 */
function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // Simple validation
    if (!promoCode) {
        showToast('error', 'Invalid Code', 'Please enter a promo code');
        return;
    }
    
    // Simulate checking promo code
    const validCodes = {
        'WELCOME10': { discount: 0.1, type: 'percent', name: '10% off' },
        'FREESHIP': { discount: 0, type: 'shipping', name: 'Free shipping' },
        'SUMMER25': { discount: 0.25, type: 'percent', name: '25% off' }
    };
    
    if (validCodes[promoCode]) {
        // Get current order summary
        const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
        const discount = validCodes[promoCode];
        
        // Apply discount based on type
        if (discount.type === 'percent') {
            const discountAmount = orderSummary.subtotal * discount.discount;
            orderSummary.discount = discountAmount;
            orderSummary.total = orderSummary.subtotal - discountAmount;
            
            // Update the DOM
            const totalElement = document.getElementById('total');
            totalElement.textContent = `₹${orderSummary.total.toFixed(2)}`;
            
            // Add discount row if it doesn't exist
            if (!document.getElementById('discount-row')) {
                const summaryTotals = document.querySelector('.summary-totals');
                const discountRow = document.createElement('div');
                discountRow.id = 'discount-row';
                discountRow.className = 'summary-row';
                discountRow.innerHTML = `
                    <span>Discount (${discount.name})</span>
                    <span id="discount">-₹${discountAmount.toFixed(2)}</span>
                `;
                summaryTotals.appendChild(discountRow);
            } else {
                // Update existing discount row
                document.getElementById('discount').textContent = `-₹${discountAmount.toFixed(2)}`;
            }
            
            showToast('success', 'Promo Code Applied', `${discount.name} has been applied to your order`);
        } else if (discount.type === 'shipping') {
            // For shipping discount, we'll just show a message since shipping is calculated later
            showToast('success', 'Promo Code Applied', 'Free shipping will be applied at the next step');
        }
        
        // Save updated order summary
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
        localStorage.setItem('promoCode', promoCode);
        
        // Disable the promo input and button
        promoInput.disabled = true;
        document.getElementById('apply-promo').disabled = true;
    } else {
        showToast('error', 'Invalid Code', 'This promo code is not valid or has expired');
    }
}

/**
 * Validate the checkout form
 * @returns {boolean} - Whether the form is valid
 */
function validateForm() {
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    });
    
    return isValid;
}

/**
 * Update cart count in the navigation
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
    });
}

/**
 * Show a toast notification
 * @param {string} type - The type of toast (success, error)
 * @param {string} title - The toast title
 * @param {string} message - The toast message
 */
function showToast(type, title, message) {
    // Check if toast container exists
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Show toast with slight delay for animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}
