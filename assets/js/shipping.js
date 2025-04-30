// Shipping Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the shipping page
    initShippingPage();
    
    // Add event listeners
    setupEventListeners();
});

/**
 * Initialize the shipping page
 */
function initShippingPage() {
    // Load customer information from localStorage
    loadCustomerInfo();
    
    // Load cart items
    loadCartItems();
    
    // Calculate and update order summary
    updateOrderSummary();
    
    // Show toast notification
    showToast('success', 'Select Shipping Method', 'Choose your preferred shipping option');
}

/**
 * Load customer information from localStorage and display in the summary
 */
function loadCustomerInfo() {
    const customerInfo = JSON.parse(localStorage.getItem('customerInfo'));
    
    if (!customerInfo) {
        // Redirect to checkout page if no customer info is available
        window.location.href = 'checkout.html';
        return;
    }
    
    // Update contact info summary
    const contactInfoSummary = document.getElementById('contact-info-summary');
    contactInfoSummary.innerHTML = `
        <p><strong>Email:</strong> ${customerInfo.email}</p>
        ${customerInfo.phone ? `<p><strong>Phone:</strong> ${customerInfo.phone}</p>` : ''}
    `;
    
    // Update shipping info summary
    const shippingInfoSummary = document.getElementById('shipping-info-summary');
    shippingInfoSummary.innerHTML = `
        <p>${customerInfo.firstName} ${customerInfo.lastName}</p>
        <p>${customerInfo.address}${customerInfo.apartment ? ', ' + customerInfo.apartment : ''}</p>
        <p>${customerInfo.city}, ${customerInfo.state} ${customerInfo.zip}</p>
        <p>${getCountryName(customerInfo.country)}</p>
    `;
}

/**
 * Get country name from country code
 * @param {string} countryCode - The country code
 * @returns {string} - The country name
 */
function getCountryName(countryCode) {
    const countries = {
        'US': 'United States',
        'CA': 'Canada',
        'UK': 'United Kingdom',
        'AU': 'Australia',
        'IN': 'India'
    };
    
    return countries[countryCode] || countryCode;
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
    const shippingCostElement = document.getElementById('shipping-cost');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    // Calculate subtotal
    let subtotal = 0;
    cart.forEach(item => {
        const price = typeof item.price === 'string' ? parseFloat(item.price.replace('$', '')) : item.price;
        subtotal += price * item.quantity;
    });
    
    // Get selected shipping method cost
    const shippingMethod = document.querySelector('input[name="shipping-method"]:checked');
    let shippingCost = 499; // Default to standard shipping
    
    if (shippingMethod) {
        switch (shippingMethod.value) {
            case 'express':
                shippingCost = 999;
                break;
            case 'overnight':
                shippingCost = 1999;
                break;
            default:
                shippingCost = 5.99;
        }
    }
    
    // Check if there's a free shipping promo code applied
    const promoCode = localStorage.getItem('promoCode');
    if (promoCode === 'FREESHIP') {
        shippingCost = 0;
    }
    
    // Calculate tax (8.5%)
    const taxRate = 0.085;
    const tax = subtotal * taxRate;
    
    // Calculate total
    const total = subtotal + shippingCost + tax;
    
    // Update the DOM
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    shippingCostElement.textContent = shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
    
    // Check if there's a discount applied
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};
    if (orderSummary.discount) {
        // Add discount row if it doesn't exist
        if (!document.getElementById('discount-row')) {
            const summaryTotals = document.querySelector('.summary-totals');
            const discountRow = document.createElement('div');
            discountRow.id = 'discount-row';
            discountRow.className = 'summary-row';
            discountRow.innerHTML = `
                <span>Discount</span>
                <span id="discount">-₹${orderSummary.discount.toFixed(2)}</span>
            `;
            summaryTotals.appendChild(discountRow);
            
            // Recalculate total with discount
            const discountedTotal = total - orderSummary.discount;
            totalElement.textContent = `$${discountedTotal.toFixed(2)}`;
        }
    }
    
    // Save updated order summary to localStorage
    localStorage.setItem('orderSummary', JSON.stringify({
        subtotal,
        shippingCost,
        tax,
        total: orderSummary.discount ? total - orderSummary.discount : total,
        discount: orderSummary.discount
    }));
}

/**
 * Set up event listeners for the shipping page
 */
function setupEventListeners() {
    // Shipping method selection
    const shippingMethods = document.querySelectorAll('input[name="shipping-method"]');
    shippingMethods.forEach(method => {
        method.addEventListener('change', function() {
            updateOrderSummary();
        });
    });
    
    // Continue to payment button
    const continueBtn = document.getElementById('continue-to-payment');
    if (continueBtn) {
        continueBtn.addEventListener('click', continueToPayment);
    }
    
    // Apply promo code button
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
}

/**
 * Continue to the payment step
 */
function continueToPayment() {
    // Save selected shipping method to localStorage
    const selectedMethod = document.querySelector('input[name="shipping-method"]:checked').value;
    
    // Get current order summary
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};
    
    // Add shipping method to order summary
    orderSummary.shippingMethod = selectedMethod;
    
    // Save updated order summary
    localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
    
    // Show loading state
    const continueBtn = document.getElementById('continue-to-payment');
    continueBtn.innerHTML = '<span class="loading-indicator"></span> Processing...';
    continueBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(() => {
        // In a real application, this would navigate to the payment page
        // For this demo, we'll show a success message
        showOrderConfirmation();
        
        // Reset button state
        continueBtn.innerHTML = 'Continue to Payment';
        continueBtn.disabled = false;
    }, 1500);
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
            orderSummary.total = orderSummary.subtotal + orderSummary.shippingCost + orderSummary.tax - discountAmount;
            
            // Add discount row if it doesn't exist
            if (!document.getElementById('discount-row')) {
                const summaryTotals = document.querySelector('.summary-totals');
                const discountRow = document.createElement('div');
                discountRow.id = 'discount-row';
                discountRow.className = 'summary-row';
                discountRow.innerHTML = `
                    <span>Discount (${discount.name})</span>
                    <span id="discount">-$${discountAmount.toFixed(2)}</span>
                `;
                summaryTotals.appendChild(discountRow);
            } else {
                // Update existing discount row
                document.getElementById('discount').textContent = `-₹${discountAmount.toFixed(2)}`;
            }
            
            // Update total
            document.getElementById('total').textContent = `$${orderSummary.total.toFixed(2)}`;
            
            showToast('success', 'Promo Code Applied', `${discount.name} has been applied to your order`);
        } else if (discount.type === 'shipping') {
            // Apply free shipping
            orderSummary.shippingCost = 0;
            orderSummary.total = orderSummary.subtotal + orderSummary.tax - (orderSummary.discount || 0);
            
            // Update shipping cost display
            document.getElementById('shipping-cost').textContent = 'FREE';
            
            // Update total
            document.getElementById('total').textContent = `$${orderSummary.total.toFixed(2)}`;
            
            showToast('success', 'Promo Code Applied', 'Free shipping has been applied to your order');
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
 * Show order confirmation (simulating payment completion)
 */
function showOrderConfirmation() {
    // Create a modal for order confirmation
    const modal = document.createElement('div');
    modal.className = 'order-confirmation-modal';
    
    // Generate a random order number
    const orderNumber = 'TT' + Math.floor(100000 + Math.random() * 900000);
    
    // Get order summary
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Order Confirmed!</h2>
            <p>Thank you for your purchase. Your order has been successfully placed.</p>
            <div class="order-details">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Total Amount:</strong> ₹${orderSummary.total.toFixed(2)}</p>
            </div>
            <p>A confirmation email has been sent to your email address.</p>
            <button id="continue-shopping" class="btn primary-btn">Continue Shopping</button>
        </div>
    `;
    
    // Add modal to the page
    document.body.appendChild(modal);
    
    // Add styles for the modal
    const style = document.createElement('style');
    style.textContent = `
        .order-confirmation-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
        }
        
        .success-icon {
            font-size: 5rem;
            color: #06d6a0;
            margin-bottom: 20px;
        }
        
        .order-details {
            background-color: #f5f5f5;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    
    // Add event listener to continue shopping button
    document.getElementById('continue-shopping').addEventListener('click', function() {
        // Clear cart and order information
        localStorage.removeItem('cart');
        localStorage.removeItem('orderSummary');
        localStorage.removeItem('customerInfo');
        localStorage.removeItem('promoCode');
        
        // Redirect to collections page
        window.location.href = 'collections.html';
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
