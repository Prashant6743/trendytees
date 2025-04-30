// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize profile page with animations
    setTimeout(() => {
        document.body.classList.add('page-loaded');
        initTabSwitching();
        initAccordion();
        setupOrderTracking();
        setupWishlistActions();
        setupFormValidation();
    }, 100);
});

// Initialize tab switching
function initTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Add animation class
            document.getElementById(`${tabId}-tab`).classList.add('animated');
            setTimeout(() => {
                document.getElementById(`${tabId}-tab`).classList.remove('animated');
            }, 500);
        });
    });
    
    // Track button click handler
    const trackButtons = document.querySelectorAll('.btn-track');
    trackButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Switch to track tab
            tabButtons.forEach(btn => {
                if (btn.getAttribute('data-tab') === 'track') {
                    btn.click();
                }
            });
        });
    });
}

// Initialize accordion for FAQ section
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Toggle active class
            const isActive = item.classList.contains('active');
            
            // Close all accordions
            accordionItems.forEach(accItem => {
                accItem.classList.remove('active');
            });
            
            // Open clicked accordion if it wasn't already open
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Setup order tracking functionality
function setupOrderTracking() {
    const trackForm = document.querySelector('.tracking-form');
    const trackResult = document.querySelector('.tracking-result');
    
    if (trackForm) {
        trackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const orderIdInput = document.getElementById('order-id');
            const emailInput = document.getElementById('email');
            
            // Simple validation
            if (orderIdInput.value.trim() === '' || emailInput.value.trim() === '') {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Show tracking result with animation
            trackResult.style.display = 'block';
            trackResult.classList.add('animated');
            
            // Scroll to result
            setTimeout(() => {
                trackResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
            
            // Animate timeline
            animateTimeline();
        });
    }
}

// Animate order tracking timeline
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animated');
            
            // Add pulse animation to active item
            if (item.classList.contains('active')) {
                item.querySelector('.timeline-icon').classList.add('pulse');
            }
        }, index * 300);
    });
}

// Setup wishlist actions
function setupWishlistActions() {
    // Remove from wishlist
    const removeButtons = document.querySelectorAll('.remove-wishlist');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const wishlistItem = button.closest('.wishlist-item');
            
            // Add remove animation
            wishlistItem.style.opacity = '0';
            wishlistItem.style.transform = 'scale(0.8) translateY(-10px)';
            
            // Remove item after animation
            setTimeout(() => {
                wishlistItem.remove();
                updateWishlistCount();
                showNotification('Item removed from wishlist', 'info');
            }, 300);
        });
    });
    
    // Add to cart from wishlist
    const addToCartButtons = document.querySelectorAll('.wishlist-item .add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const wishlistItem = button.closest('.wishlist-item');
            const productName = wishlistItem.querySelector('h3').textContent;
            const productPrice = wishlistItem.querySelector('.wishlist-item-price').textContent;
            const productImage = wishlistItem.querySelector('img').src;
            
            // Create product object
            const product = {
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            // Add to cart (using existing cart functionality)
            if (typeof addToCart === 'function') {
                addToCart(product);
                showNotification(`${productName} added to cart!`, 'success');
            } else {
                // Fallback if cart.js is not loaded
                console.log('Adding to cart:', product);
                showNotification(`${productName} added to cart!`, 'success');
                
                // Update cart count
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    const currentCount = parseInt(cartCount.textContent) || 0;
                    cartCount.textContent = currentCount + 1;
                    
                    // Add animation
                    cartCount.classList.add('bounce');
                    setTimeout(() => {
                        cartCount.classList.remove('bounce');
                    }, 1000);
                }
            }
        });
    });
}

// Update wishlist count
function updateWishlistCount() {
    const wishlistItems = document.querySelectorAll('.wishlist-item');
    const wishlistCount = wishlistItems.length;
    
    // Update count in profile stats
    const wishlistStat = document.querySelector('.profile-stats .stat:nth-child(2) .stat-value');
    if (wishlistStat) {
        wishlistStat.textContent = wishlistCount;
        
        // Add animation
        wishlistStat.classList.add('highlight');
        setTimeout(() => {
            wishlistStat.classList.remove('highlight');
        }, 1000);
    }
}

// Setup form validation
function setupFormValidation() {
    const saveButtons = document.querySelectorAll('.save-btn');
    
    saveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get parent form
            const form = button.closest('.settings-section');
            const inputs = form.querySelectorAll('input');
            let isValid = true;
            
            // Simple validation
            inputs.forEach(input => {
                if (input.hasAttribute('required') && input.value.trim() === '') {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success notification
                showNotification('Changes saved successfully!', 'success');
                
                // Add animation to button
                button.classList.add('success');
                setTimeout(() => {
                    button.classList.remove('success');
                }, 1000);
            } else {
                showNotification('Please fill in all required fields', 'error');
            }
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.profile-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'profile-notification';
        document.body.appendChild(notification);
    }
    
    // Set notification type
    notification.className = 'profile-notification';
    notification.classList.add(`notification-${type}`);
    
    // Set icon based on type
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    
    // Set content
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.remove('show');
        
        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        if (notification.classList.contains('show')) {
            notification.classList.remove('show');
            
            // Remove after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 3000);
}

// Add notification styles if not already in CSS
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .profile-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                padding: 15px 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                z-index: 1000;
                max-width: 350px;
            }
            
            .profile-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .profile-notification i {
                font-size: 1.5rem;
            }
            
            .profile-notification span {
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                color: #999;
                transition: color 0.3s ease;
            }
            
            .notification-close:hover {
                color: #333;
            }
            
            .notification-success i {
                color: #2ecc71;
            }
            
            .notification-error i {
                color: #e74c3c;
            }
            
            .notification-warning i {
                color: #f1c40f;
            }
            
            .notification-info i {
                color: #3498db;
            }
        `;
        document.head.appendChild(style);
    }
}

// Add notification styles on load
addNotificationStyles();

// Handle reorder button clicks
document.querySelectorAll('.btn-reorder').forEach(button => {
    button.addEventListener('click', function() {
        const orderCard = this.closest('.order-card');
        const orderItems = orderCard.querySelectorAll('.order-item');
        
        // Reorder all items in the order
        orderItems.forEach(item => {
            const productName = item.querySelector('h4').textContent;
            const productDetails = item.querySelector('p').textContent;
            
            // Show notification
            showNotification(`Reordering ${productName}...`, 'info');
            
            // After a delay, show success
            setTimeout(() => {
                showNotification(`${productName} added to cart!`, 'success');
                
                // Update cart count
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    const currentCount = parseInt(cartCount.textContent) || 0;
                    cartCount.textContent = currentCount + 1;
                }
            }, 1000);
        });
    });
});

// Handle review button clicks
document.querySelectorAll('.btn-review').forEach(button => {
    button.addEventListener('click', function() {
        const orderCard = this.closest('.order-card');
        const productName = orderCard.querySelector('.order-item h4').textContent;
        
        // Show notification
        showNotification(`Write a review for ${productName}`, 'info');
    });
});

// Add animation to profile avatar
const avatar = document.querySelector('.avatar-container');
if (avatar) {
    avatar.addEventListener('mouseover', function() {
        this.classList.add('animated');
    });
    
    avatar.addEventListener('mouseout', function() {
        this.classList.remove('animated');
    });
}

// Add animation to stats
const stats = document.querySelectorAll('.stat');
stats.forEach((stat, index) => {
    setTimeout(() => {
        stat.classList.add('animated');
        setTimeout(() => {
            stat.classList.remove('animated');
        }, 1000);
    }, index * 200);
});

// Update cart count from localStorage on page load
function updateCartCountFromStorage() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount.textContent = cart.length;
    }
}

// Call this function on page load
updateCartCountFromStorage();
