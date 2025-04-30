// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Add page entrance animation
    document.body.classList.add('page-loaded');
    
    // Initialize cart with animation
    setTimeout(() => {
        initializeCart();
        
        // Render cart items with staggered animation
        renderCartItems();
        
        // Update cart summary with animation
        updateCartSummary();
        
        // Initialize Add to Cart buttons for related products
        initializeAddToCartButtons();
        
        // Add parallax effect to header
        initParallaxEffect();
        
        // Add scroll animations
        initScrollAnimations();
    }, 300);
});

// Initialize parallax effect
function initParallaxEffect() {
    const header = document.querySelector('.cart-header');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        if (header) {
            header.style.backgroundPosition = `50% ${scrollPosition * 0.4}px`;
        }
    });
}

// Initialize scroll animations
function initScrollAnimations() {
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const observer = new IntersectionObserver(animateOnScroll, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    const elements = document.querySelectorAll('.cart-items, .cart-summary, .related-products');
    elements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Render cart items from localStorage with staggered animation
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    console.log('Cart contents:', cart); // Debug log
    
    // If cart is empty, show empty cart message with animation
    if (cart.length === 0) {
        const emptyMessage = document.querySelector('.empty-cart-message');
        if (emptyMessage) {
            setTimeout(() => {
                emptyMessage.style.opacity = '1';
                emptyMessage.style.transform = 'translateY(0)';
            }, 300);
        }
        return;
    }
    
    // Clear the container
    cartItemsContainer.innerHTML = '';
    
    // Create cart items with staggered animation
    cart.forEach((item, index) => {
        const cartItemElement = createCartItemElement(item);
        cartItemElement.style.opacity = '0';
        cartItemElement.style.transform = 'translateX(20px)';
        cartItemsContainer.appendChild(cartItemElement);
        
        // Staggered animation
        setTimeout(() => {
            cartItemElement.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            cartItemElement.style.opacity = '1';
            cartItemElement.style.transform = 'translateX(0)';
        }, 100 * index);
    });
    
    // Add hover effects for cart items
    addCartItemHoverEffects();
}

// Add hover effects to cart items
function addCartItemHoverEffects() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    cartItems.forEach(item => {
        // Add 3D tilt effect on hover
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;
            
            const xPercent = x / rect.width - 0.5;
            const yPercent = y / rect.height - 0.5;
            
            const maxTilt = 2; // Max tilt in degrees
            const tiltX = maxTilt * yPercent * -1; // Reversed for natural feel
            const tiltY = maxTilt * xPercent;
            
            item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
        });
        
        // Reset on mouse leave
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// Create a cart item element with enhanced styling
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.dataset.id = item.id;
    
    // Format price for display
    let displayPrice;
    let itemTotal;
    
    // Handle different price formats (₹ or ₹)
    if (typeof item.price === 'string') {
        if (item.price.includes('₹')) {
            const price = item.price.replace('₹', '').replace(',', '');
            displayPrice = `₹${parseFloat(price).toFixed(2)}`;
            itemTotal = parseFloat(price) * item.quantity;
        } else {
            displayPrice = item.price;
            itemTotal = parseFloat(item.price) * item.quantity;
        }
    } else {
        // If price is a number
        displayPrice = `₹${item.price.toFixed(2)}`;
        itemTotal = item.price * item.quantity;
    }
    
    // Format the total price with the same currency symbol
    const formattedTotal = displayPrice.charAt(0) + itemTotal.toFixed(2);
    
    // Check if this is a custom design
    const isCustomDesign = item.name.includes('Custom');
    
    let itemTemplate;
    
    if (isCustomDesign && item.color) {
        // Template for custom t-shirt designs
        const colorStyle = item.color ? `background-color: ${item.color};` : '';
        
        itemTemplate = `
            <div class="cart-item-image" style="${colorStyle}">
                <span class="custom-badge">Custom Design</span>
                <img src="${item.image}" alt="${item.name}" class="overlay-image">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-price">${displayPrice}</p>
                <p class="item-size">Size: ${item.size}</p>
                <p class="item-quantity">Quantity: ${item.quantity}</p>
                <p class="item-total">Total: <span>${formattedTotal}</span></p>
            </div>
        `;
    } else {
        // Template for regular products
        itemTemplate = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-price">${displayPrice}</p>
                <p class="item-size">Size: ${item.size}</p>
                <p class="item-quantity">Quantity: ${item.quantity}</p>
                <p class="item-total">Total: <span>${formattedTotal}</span></p>
            </div>
        `;
    }
    
    cartItem.innerHTML = `
        ${itemTemplate}
        <div class="cart-item-actions">
            <div class="quantity-controls">
                <button class="quantity-btn decrease-quantity"><i class="fas fa-minus"></i></button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn increase-quantity"><i class="fas fa-plus"></i></button>
            </div>
            <button class="remove-item">Remove</button>
        </div>
    `;
    
    // Add event listeners
    const decreaseBtn = cartItem.querySelector('.decrease-quantity');
    const increaseBtn = cartItem.querySelector('.increase-quantity');
    const removeBtn = cartItem.querySelector('.remove-item');
    
    decreaseBtn.addEventListener('click', () => {
        updateItemQuantity(item.id, -1);
    });
    
    increaseBtn.addEventListener('click', () => {
        updateItemQuantity(item.id, 1);
    });
    
    removeBtn.addEventListener('click', () => {
        removeCartItem(item.id);
    });
    
    return cartItem;
}

// Update item quantity
function updateItemQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity + change);
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        const quantityElement = document.querySelector(`.cart-item[data-id="${itemId}"] .quantity-value`);
        if (quantityElement) {
            quantityElement.textContent = cart[itemIndex].quantity;
        }
        
        // Update cart summary
        updateCartSummary();
        
        // Update cart count in nav
        updateCartCount();
    }
}

// Remove cart item with enhanced animation
function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Store the item being removed for the notification
    const removedItem = cart.find(item => item.id === itemId);
    
    // Filter out the item to remove
    cart = cart.filter(item => item.id !== itemId);
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Remove item from UI with animation
    const cartItem = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    if (cartItem) {
        // First scale down and fade out
        cartItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        cartItem.style.opacity = '0';
        cartItem.style.transform = 'translateX(50px) scale(0.8)';
        cartItem.style.maxHeight = cartItem.scrollHeight + 'px';
        
        setTimeout(() => {
            // Then collapse height
            cartItem.style.transition = 'max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease, padding 0.3s ease';
            cartItem.style.maxHeight = '0';
            cartItem.style.marginTop = '0';
            cartItem.style.marginBottom = '0';
            cartItem.style.paddingTop = '0';
            cartItem.style.paddingBottom = '0';
            cartItem.style.overflow = 'hidden';
            
            setTimeout(() => {
                cartItem.remove();
                
                // If cart is now empty, show empty cart message with animation
                if (cart.length === 0) {
                    const cartItemsContainer = document.getElementById('cart-items-container');
                    cartItemsContainer.innerHTML = `
                        <div class="empty-cart-message" style="opacity: 0; transform: translateY(20px);">
                            <i class="fas fa-shopping-cart"></i>
                            <h3>Your cart is empty</h3>
                            <p>Looks like you haven't added any items to your cart yet.</p>
                            <a href="collections.html" class="btn primary-btn">Continue Shopping</a>
                        </div>
                    `;
                    
                    // Animate empty cart message
                    setTimeout(() => {
                        const emptyMessage = document.querySelector('.empty-cart-message');
                        if (emptyMessage) {
                            emptyMessage.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            emptyMessage.style.opacity = '1';
                            emptyMessage.style.transform = 'translateY(0)';
                        }
                    }, 100);
                }
                
                // Show removal notification
                if (removedItem) {
                    showItemRemovedNotification(removedItem.name);
                }
            }, 300);
        }, 300);
    }
    
    // Update cart summary with animation
    updateCartSummary(true);
    
    // Update cart count in nav
    updateCartCount();
}

// Show notification when item is removed from cart
function showItemRemovedNotification(itemName) {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = 'toast-notification remove-notification';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-trash-alt"></i>
        </div>
        <div class="toast-content">
            <p class="toast-title">Item Removed</p>
            <p class="toast-message">${itemName} has been removed from your cart</p>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(toast);
    
    // Add event listener to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
    


// Update cart summary with animation
function updateCartSummary(animate = false) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;
    
    // Calculate subtotal
    let subtotal = 0;
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
        subtotal += price * item.quantity;
    });
    
    // Calculate shipping (free over ₹999, otherwise ₹99)
    const shipping = subtotal > 999 ? 0 : 99;
    
    // Calculate tax (8.5%)
    const tax = subtotal * 0.085;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // If animation is requested, animate the changes
    if (animate) {
        animateValueChange(subtotalElement, subtotalElement.textContent, `₹${subtotal.toLocaleString('en-IN')}`);
        animateValueChange(shippingElement, shippingElement.textContent, shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`);
        animateValueChange(taxElement, taxElement.textContent, `₹${tax.toLocaleString('en-IN')}`);
        animateValueChange(totalElement, totalElement.textContent, `₹${total.toLocaleString('en-IN')}`);
    } else {
        // Update elements without animation
        subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        shippingElement.textContent = shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`;
        taxElement.textContent = `₹${tax.toLocaleString('en-IN')}`;
        totalElement.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
    
    // Enable/disable checkout button with animation
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('disabled');
        
        // Add click event listener to checkout button
        if (!checkoutBtn.hasAttribute('data-listener-added')) {
            checkoutBtn.addEventListener('click', function() {
                window.location.href = 'checkout.html';
            });
            checkoutBtn.setAttribute('data-listener-added', 'true');
        }
        
        if (animate) {
            checkoutBtn.classList.add('pulse-animation');
            setTimeout(() => {
                checkoutBtn.classList.remove('pulse-animation');
            }, 1000);
        }
    }
    
    // Update free shipping message
    updateFreeShippingMessage(subtotal);
}

// Animate value change with counting effect
function animateValueChange(element, oldValue, newValue) {
    // Add highlight class for animation
    element.classList.add('highlight-change');
    
    // If values are currency, animate the number
    if (oldValue.includes('₹') && newValue.includes('₹')) {
        const oldNum = parseFloat(oldValue.replace('₹', '').replace(',', ''));
        const newNum = parseFloat(newValue.replace('₹', '').replace(',', ''));
        
        // Only animate if there's a significant difference
        if (Math.abs(oldNum - newNum) > 0.01) {
            const duration = 500; // ms
            const steps = 20;
            const step = (newNum - oldNum) / steps;
            let current = oldNum;
            let count = 0;
            
            const timer = setInterval(() => {
                count++;
                current += step;
                element.textContent = `₹${current.toLocaleString('en-IN')}`;
                
                if (count >= steps) {
                    clearInterval(timer);
                    element.textContent = newValue; // Ensure final value is exact
                }
            }, duration / steps);
        } else {
            element.textContent = newValue;
        }
    } else {
        // For non-currency values
        element.textContent = newValue;
    }
    
    // Remove highlight class after animation
    setTimeout(() => {
        element.classList.remove('highlight-change');
    }, 1000);
}

// Update free shipping message
function updateFreeShippingMessage(subtotal) {
    const summaryElement = document.querySelector('.cart-summary');
    let freeShippingMessage = document.querySelector('.free-shipping-message');
    
    if (!summaryElement) return;
    
    // Remove existing message if it exists
    if (freeShippingMessage) {
        freeShippingMessage.remove();
    }
    
    // Create new message
    freeShippingMessage = document.createElement('div');
    freeShippingMessage.className = 'free-shipping-message';
    
    if (subtotal >= 999) {
        freeShippingMessage.innerHTML = `
            <i class="fas fa-truck"></i>
            <p>You've qualified for <span>FREE SHIPPING</span>!</p>
        `;
        freeShippingMessage.classList.add('qualified');
    } else {
        const remaining = (999 - subtotal).toFixed(2);
        freeShippingMessage.innerHTML = `
            <i class="fas fa-truck"></i>
            <p>Add <span>₹${remaining.toLocaleString('en-IN')}</span> more to qualify for <span>FREE SHIPPING</span></p>
            <div class="shipping-progress">
                <div class="shipping-progress-bar" style="width: ${(subtotal / 999) * 100}%"></div>
            </div>
        `;
    }
    
    // Insert after the first summary row
    const firstRow = summaryElement.querySelector('.summary-row');
    if (firstRow) {
        firstRow.parentNode.insertBefore(freeShippingMessage, firstRow.nextSibling);
    } else {
        summaryElement.appendChild(freeShippingMessage);
    }
    
    // Animate entrance
    setTimeout(() => {
        freeShippingMessage.classList.add('show');
    }, 100);
}

// Initialize cart from localStorage
function initializeCart() {
    // Check if cart exists in localStorage
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    
    // Update cart count in the navigation
    updateCartCount();
}

// Update cart count in the navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
    });
}

// Initialize Add to Cart buttons for related products
function initializeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.action-btn.add-to-cart');
    
    addToCartButtons.forEach(button => {
        // Remove existing event listeners by cloning the button
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new event listener
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = newButton.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('.product-image img').src;
            
            // Add to cart
            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                size: 'M', // Default size
                quantity: 1  // Default quantity
            });
            
            // Show notification
            showAddedToCartNotification(productName);
            
            // Add animation to the button
            newButton.classList.add('clicked');
            setTimeout(() => {
                newButton.classList.remove('clicked');
            }, 300);
            
            // Re-render cart items
            renderCartItems();
            
            // Update cart summary
            updateCartSummary();
        });
    });
}

// Add to cart function
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart (by name and size if available)
    const existingProductIndex = cart.findIndex(item => 
        (item.name === product.name) && 
        (!item.size || !product.size || item.size === product.size)
    );
    
    if (existingProductIndex !== -1) {
        // Increment quantity if product already in cart
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
        // Update timestamp
        cart[existingProductIndex].updatedAt = new Date().toISOString();
    } else {
        // Add product to cart with quantity
        cart.push({
            ...product,
            id: Date.now() + Math.random().toString(36).substr(2, 9), // Generate unique ID
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

// Show notification when product is added to cart with enhanced animation
function showAddedToCartNotification(productName) {
    // Create a toast notification with enhanced styling
    const toast = document.createElement('div');
    toast.className = 'toast-notification cart-notification';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="toast-content">
            <p class="toast-title">Added to Cart</p>
            <p class="toast-message">${productName} has been added to your cart</p>
        </div>
        <div class="toast-actions">
            <a href="cart.html" class="view-cart-btn">View Cart</a>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        </div>
    `;
    document.body.appendChild(toast);
    
    // Add event listener to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Add confetti effect
    createConfettiEffect(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Create confetti effect
function createConfettiEffect(element) {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    element.appendChild(confettiContainer);
    
    // Create confetti pieces
    const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];
    const confettiCount = 50; // Increased count for more visual impact
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Randomize confetti appearance
        const size = Math.random() * 10 + 5; // Size between 5-15px
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Randomize shape (circle or square)
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // Randomize color
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Randomize position
        confetti.style.left = Math.random() * 100 + '%';
        
        // Randomize animation timing
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = Math.random() * 1 + 1 + 's';
        
        // Randomize initial rotation
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        confettiContainer.appendChild(confetti);
    }
}
