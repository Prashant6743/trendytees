// Main JavaScript for TrendyTees

document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    initializeCart();

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                // Here you would typically send this to your backend
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            } else {
                alert('Please enter a valid email address');
            }
        });
    }

    // Product Action Buttons - Quick View removed as requested
    
    // Initialize Add to Cart buttons
    initializeAddToCartButtons();
    
    // Add to Wishlist Buttons
    const wishlistButtons = document.querySelectorAll('.action-btn.add-to-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Add to wishlist
            addToWishlist(productName);
            
            // Toggle heart icon color
            const heartIcon = button.querySelector('i');
            heartIcon.classList.toggle('fas');
            heartIcon.classList.toggle('far');
            
            // Show notification
            showWishlistNotification(productName);
        });
    });

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Helper Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

// Update cart count in the navigation with animation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cart.length;
        
        // Add animation effect
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 500);
    });
}

function showQuickViewModal(productName, productPrice) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${productName}</h2>
            <p class="price">${productPrice}</p>
            <div class="product-details">
                <div class="size-selector">
                    <label>Size:</label>
                    <select>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
                <div class="quantity-selector">
                    <label>Quantity:</label>
                    <input type="number" value="1" min="1" max="10">
                </div>
                <button class="add-to-cart">Add to Cart</button>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Add event listeners
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Add to cart functionality
    const addToCartBtn = modal.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        const size = modal.querySelector('select').value;
        const quantity = parseInt(modal.querySelector('input[type="number"]').value);
        
        addToCart({
            name: productName,
            price: productPrice,
            size: size,
            quantity: quantity
        });
        
        modal.remove();
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add product to cart with unique ID and timestamp
    cart.push({
        ...product,
        id: Date.now() + Math.random().toString(36).substr(2, 9), // Generate unique ID
        addedAt: new Date().toISOString()
    });
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

function showAddedToCartNotification(productName) {
    // Create a more detailed notification
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
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(toast);
    
    // Add event listener to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function addToWishlist(productName) {
    // Get wishlist from localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product is already in wishlist
    if (!wishlist.includes(productName)) {
        wishlist.push(productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } else {
        // Remove from wishlist if already there (toggle functionality)
        wishlist = wishlist.filter(item => item !== productName);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
}

function showWishlistNotification(productName) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification wishlist-notification';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-heart"></i>
        </div>
        <div class="toast-content">
            <p class="toast-title">Wishlist Updated</p>
            <p class="toast-message">${productName} has been added to your wishlist</p>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(toast);
    
    // Add event listener to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize Add to Cart buttons
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
        });
    });
}

// Add some dynamic styling for the modal and toast
const style = document.createElement('style');
style.textContent = `
    .quick-view-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        position: relative;
    }

    .close-modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .product-details {
        margin-top: 1rem;
    }

    .size-selector, .quantity-selector {
        margin: 1rem 0;
    }

    .add-to-cart {
        width: 100%;
        padding: 1rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 1rem;
    }

    /* Enhanced Notifications */
    .toast-notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: white;
        color: #333;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    
    .toast-notification.toast-hiding {
        animation: slideOut 0.3s ease-in forwards;
    }
    
    .toast-icon {
        margin-right: 1rem;
        font-size: 1.5rem;
    }
    
    .toast-content {
        flex: 1;
    }
    
    .toast-title {
        font-weight: 600;
        margin: 0 0 0.3rem 0;
    }
    
    .toast-message {
        font-size: 0.9rem;
        margin: 0;
        color: #666;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        font-size: 1rem;
        padding: 0.3rem;
    }
    
    .toast-close:hover {
        color: #333;
    }
    
    /* Specific notification types */
    .cart-notification .toast-icon {
        color: #2ecc71;
    }
    
    .wishlist-notification .toast-icon {
        color: #e74c3c;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

document.head.appendChild(style);
