// Profile Overlay JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initProfileOverlay();
});

// Initialize profile overlay
function initProfileOverlay() {
    // Create overlay elements if they don't exist
    if (!document.querySelector('.profile-overlay')) {
        createProfileOverlay();
    }
    
    // Add event listeners
    const profileIcons = document.querySelectorAll('.nav-icons .icon .fa-user');
    profileIcons.forEach(icon => {
        icon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            
            if (userData.isLoggedIn) {
                // Show profile overlay if logged in
                toggleProfileOverlay();
            } else {
                // Redirect to login page if not logged in
                const loginPath = getCorrectPath('login.html');
                window.location.href = loginPath;
            }
        });
    });
}

// Create profile overlay HTML
function createProfileOverlay() {
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'overlay-backdrop';
    document.body.appendChild(backdrop);
    
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.className = 'profile-overlay';
    
    // Determine correct profile path based on current location
    const profilePath = getCorrectPath('profile.html');
    const contactPath = getCorrectPath('contact.html');
    
    // Get user data from localStorage or use default
    const userData = JSON.parse(localStorage.getItem('userData')) || {
        name: 'Guest User',
        email: 'Sign in to view your profile',
        orders: 0,
        wishlist: 0,
        reviews: 0
    };
    
    // Get cart data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Create HTML content with proper path substitution
    let htmlContent = `
        <div class="overlay-header">
            <button class="overlay-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="overlay-user">
                <div class="overlay-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="overlay-user-info">
                    <h3>${userData.name}</h3>
                    <p>${userData.email}</p>
                </div>
            </div>
        </div>
        
        <div class="overlay-content">
            <div class="overlay-stats">
                <div class="overlay-stat">
                    <span class="overlay-stat-value">${userData.orders}</span>
                    <span class="overlay-stat-label">Orders</span>
                </div>
                <div class="overlay-stat">
                    <span class="overlay-stat-value">${userData.wishlist}</span>
                    <span class="overlay-stat-label">Wishlist</span>
                </div>
                <div class="overlay-stat">
                    <span class="overlay-stat-value">${cart.length}</span>
                    <span class="overlay-stat-label">Cart</span>
                </div>
            </div>
            
            <div class="overlay-section">
                <h3 class="overlay-section-title">My Account</h3>
                <ul class="overlay-menu">
                    <li>
                        <a href="#" class="profile-link" data-path="orders-tab">
                            <i class="fas fa-box"></i>
                            My Orders
                        </a>
                    </li>
                    <li>
                        <a href="#" class="profile-link" data-path="wishlist-tab">
                            <i class="fas fa-heart"></i>
                            My Wishlist
                        </a>
                    </li>
                    <li>
                        <a href="#" class="profile-link" data-path="track-tab">
                            <i class="fas fa-truck"></i>
                            Track Order
                        </a>
                    </li>
                    <li>
                        <a href="#" class="profile-link" data-path="settings-tab">
                            <i class="fas fa-user-cog"></i>
                            Account Settings
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="overlay-section">
                <h3 class="overlay-section-title">Help & Support</h3>
                <ul class="overlay-menu">
                    <li>
                        <a href="#" class="profile-link" data-path="help-tab">
                            <i class="fas fa-question-circle"></i>
                            Help Center
                        </a>
                    </li>
                    <li>
                        <a href="#" class="contact-link">
                            <i class="fas fa-envelope"></i>
                            Contact Us
                        </a>
                    </li>
                </ul>
            </div>
            
            <a href="#" class="view-profile-btn">
                View Full Profile
            </a>
        </div>
        
        <div class="overlay-footer">
            <button class="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                Sign Out
            </button>
        </div>
    `;
    
    // Set the HTML content
    overlay.innerHTML = htmlContent;
    
    // Append overlay to body
    document.body.appendChild(overlay);
    
    // Add event listeners
    const closeBtn = overlay.querySelector('.overlay-close');
    closeBtn.addEventListener('click', toggleProfileOverlay);
    
    backdrop.addEventListener('click', toggleProfileOverlay);
    
    // Add click handler for profile links
    const profileLinks = overlay.querySelectorAll('.profile-link');
    profileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Close overlay
            toggleProfileOverlay();
            // Get the tab to navigate to
            const tabPath = this.getAttribute('data-path');
            // Navigate to profile page with correct tab
            window.location.href = profilePath + '#' + tabPath;
        });
    });
    
    // Add click handler for contact link
    const contactLink = overlay.querySelector('.contact-link');
    if (contactLink) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleProfileOverlay();
            window.location.href = contactPath;
        });
    }
    
    // Add click handler for view profile button
    const viewProfileBtn = overlay.querySelector('.view-profile-btn');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleProfileOverlay();
            window.location.href = profilePath;
        });
    }
    
    // Add logout functionality
    const logoutBtn = overlay.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', function() {
        // Clear user data
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        userData.isLoggedIn = false;
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Close the overlay
        toggleProfileOverlay();
        
        // Show notification
        showNotification('You have been signed out successfully');
        
        // After a delay, redirect to login page
        setTimeout(() => {
            const loginPath = getCorrectPath('login.html');
            window.location.href = loginPath;
        }, 1500);
    });
}

// Toggle profile overlay visibility
function toggleProfileOverlay() {
    const overlay = document.querySelector('.profile-overlay');
    const backdrop = document.querySelector('.overlay-backdrop');
    
    if (overlay.classList.contains('active')) {
        // Hide overlay
        overlay.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // Show overlay
        overlay.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Update cart count
        updateOverlayCartCount();
    }
}

// Get correct path based on current location
function getCorrectPath(pageName) {
    // Determine if we're on the index page or in a subdirectory
    const isIndexPage = window.location.pathname.endsWith('index.html') || 
                        window.location.pathname.endsWith('/') ||
                        window.location.pathname.endsWith('/code/');
    
    return isIndexPage ? `pages/${pageName}` : pageName;
}

// Update cart count in overlay
function updateOverlayCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartStat = document.querySelector('.overlay-stat:nth-child(3) .overlay-stat-value');
    
    if (cartStat) {
        cartStat.textContent = cart.length;
        
        // Add animation if count changed
        const oldCount = parseInt(cartStat.getAttribute('data-count') || '0');
        if (oldCount !== cart.length) {
            cartStat.classList.add('highlight');
            setTimeout(() => {
                cartStat.classList.remove('highlight');
            }, 1000);
        }
        
        cartStat.setAttribute('data-count', cart.length);
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.profile-notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'profile-notification';
        document.body.appendChild(notification);
        
        // Add styles if not already in CSS
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
                    color: #3498db;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Set content
    notification.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>${message}</span>
    `;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
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
