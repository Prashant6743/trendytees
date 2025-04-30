// Collections Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage
    initializeCart();
    
    // Initialize product database if it doesn't exist
    initializeProductDatabase();
    
    // Initialize product card click events
    initializeProductCardLinks();
    
    // Parallax Scrolling Effect
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const parentOffset = element.parentElement.offsetTop;
            const distance = (scrollPosition - parentOffset) * 0.5;
            
            // Apply parallax effect only if the element is in the viewport
            if (isInViewport(element.parentElement)) {
                element.style.transform = `translateY(${distance}px)`;
            }
        });
    });

    // Filter Sidebar Toggle
    const filterButton = document.querySelector('.filter-button');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const closeFilter = document.querySelector('.close-filter');
    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    document.body.appendChild(overlay);
    
    // Function to open filter sidebar
    function openFilterSidebar() {
        filterSidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when filter is open
    }
    
    // Function to close filter sidebar
    function closeFilterSidebar() {
        filterSidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    if (filterButton && filterSidebar) {
        filterButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            openFilterSidebar();
        });
    }
    
    if (closeFilter && filterSidebar) {
        closeFilter.addEventListener('click', () => {
            closeFilterSidebar();
        });
    }

    // Close filter sidebar when clicking on overlay
    overlay.addEventListener('click', () => {
        closeFilterSidebar();
    });

    // Close filter sidebar when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && filterSidebar.classList.contains('active')) {
            closeFilterSidebar();
        }
    });

    // Collection Tabs Navigation
    const tabLinks = document.querySelectorAll('.collection-tabs a');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            tabLinks.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section ID
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to target section with offset for the sticky navigation
            const navHeight = document.querySelector('.collection-nav').offsetHeight;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Load More Functionality
    const loadMoreButtons = document.querySelectorAll('.load-more-btn');
    
    loadMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productGrid = this.closest('.collection-section').querySelector('.product-grid');
            
            // Simulate loading more products
            loadMoreProducts(productGrid);
            
            // Show loading state
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Simulate delay and reset button
            setTimeout(() => {
                this.textContent = 'Load More';
                this.disabled = false;
            }, 1500);
        });
    });
    
    // Add to Cart Functionality for all product cards
    initializeAddToCartButtons();

    // Filter Functionality
    const applyFiltersButton = document.querySelector('.apply-filters');
    const clearFiltersButton = document.querySelector('.clear-filters');
    
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', () => {
            // Get all selected filters
            const selectedColors = Array.from(document.querySelectorAll('.color-filter input:checked'))
                .map(input => input.value);
                
            const selectedSizes = Array.from(document.querySelectorAll('.size-filter input:checked'))
                .map(input => input.value);
                
            const priceRange = document.querySelector('.price-slider').value;
            
            // Apply filters (simulation)
            applyFilters(selectedColors, selectedSizes, priceRange);
            
            // Close filter sidebar
            filterSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', () => {
            // Clear all checkboxes
            document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(input => {
                input.checked = false;
            });
            
            // Reset price slider
            const priceSlider = document.querySelector('.price-slider');
            if (priceSlider) {
                priceSlider.value = 50;
            }
        });
    }
});

// Helper Functions
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

function loadMoreProducts(productGrid) {
    // This would typically be an AJAX call to get more products
    // For demo purposes, we'll clone existing products
    const existingProducts = productGrid.querySelectorAll('.product-card');
    
    // Clone the first 3 products (or fewer if there are less than 3)
    const numToClone = Math.min(3, existingProducts.length);
    
    for (let i = 0; i < numToClone; i++) {
        const clone = existingProducts[i].cloneNode(true);
        
        // Modify the clone slightly to make it look different
        const productName = clone.querySelector('h3');
        if (productName) {
            productName.textContent = productName.textContent + ' - New';
        }
        
        productGrid.appendChild(clone);
    }
    
    // Animate the new products
    const newProducts = Array.from(productGrid.children).slice(-numToClone);
    newProducts.forEach((product, index) => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            product.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Re-initialize Add to Cart buttons for the newly added products
    initializeAddToCartButtons();
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
        
        // Add animation effect
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 500);
    });
}

// Add to cart function
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add product to cart
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

// Show notification when product is added to cart
function showAddedToCartNotification(productName) {
    // Create a toast notification
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

function applyFilters(colors, sizes, priceRange) {
    // This would typically filter products based on the selected criteria
    // For demo purposes, we'll just log the filters and show a notification
    
    console.log('Applying filters:', { colors, sizes, priceRange });
    
    // Create a toast notification for filter application
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-filter"></i>
        </div>
        <div class="toast-content">
            <p class="toast-title">Filters Applied</p>
            <p class="toast-message">Showing products matching your criteria</p>
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

// Initialize product database with sample products
function initializeProductDatabase() {
    // Skip if database already exists
    if (localStorage.getItem('trendyTees_products')) {
        return;
    }
    
    const products = [
        {
            id: "tshirt1",
            name: "Level Up Stay Iconic Typography Oversized T-shirt",
            brand: "TrendyTees",
            category: "Men's Printed T-Shirts",
            price: 599,
            originalPrice: 1299,
            discount: "53% OFF",
            rating: 4.6,
            reviewCount: 101,
            popularity: "101 people bought this in the last 7 days",
            fit: "OVERSIZED FIT",
            material: "100% COTTON",
            colors: [
                { name: "Gardenia", code: "#f5f5dc" },
                { name: "Pink", code: "#ffb6c1" },
                { name: "Black", code: "#000000" }
            ],
            sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
            description: "Elevate your casual wardrobe with this trendy oversized t-shirt featuring a bold \"Level Up Stay Iconic\" typography print. Made from premium 100% cotton fabric, this t-shirt offers exceptional comfort and durability for all-day wear.",
            images: {
                main: "https://images.bewakoof.com/t640/men-s-black-oversized-t-shirt-439421-1734427687-1.jpg",
                thumbnails: [
                    "https://images.bewakoof.com/t640/men-s-black-oversized-t-shirt-439421-1734427687-1.jpg",
                    "../assets/images/tshirt1-back.jpg",
                    "../assets/images/tshirt1-side.jpg",
                    "../assets/images/tshirt1-detail.jpg"
                ]
            }
        },
        {
            id: "tshirt2",
            name: "Urban Street Graphic Tee",
            brand: "TrendyTees",
            category: "Men's Printed T-Shirts",
            price: 499,
            originalPrice: 999,
            discount: "50% OFF",
            rating: 4.5,
            reviewCount: 87,
            popularity: "87 people bought this in the last 7 days",
            fit: "REGULAR FIT",
            material: "100% COTTON",
            colors: [
                { name: "White", code: "#ffffff" },
                { name: "Black", code: "#000000" },
                { name: "Grey", code: "#808080" }
            ],
            sizes: ["S", "M", "L", "XL", "2XL"],
            description: "Make a statement with our Urban Street Graphic Tee featuring bold street art-inspired designs. This comfortable regular fit t-shirt is perfect for casual outings.",
            images: {
                main: "../assets/images/tshirt2.jpg",
                thumbnails: [
                    "../assets/images/tshirt2.jpg",
                    "../assets/images/tshirt2-back.jpg",
                    "../assets/images/tshirt2-side.jpg",
                    "../assets/images/tshirt2-detail.jpg"
                ]
            }
        },
        {
            id: "tshirt3",
            name: "Minimalist Logo Tee",
            brand: "TrendyTees",
            category: "Men's Printed T-Shirts",
            price: 649,
            originalPrice: 1299,
            discount: "50% OFF",
            rating: 4.7,
            reviewCount: 112,
            popularity: "112 people bought this in the last 7 days",
            fit: "SLIM FIT",
            material: "100% ORGANIC COTTON",
            colors: [
                { name: "Navy", code: "#000080" },
                { name: "Green", code: "#008000" },
                { name: "Red", code: "#ff0000" }
            ],
            sizes: ["S", "M", "L", "XL", "2XL"],
            description: "Our Minimalist Logo Tee combines simplicity with style. The subtle logo design gives a sophisticated look to this comfortable slim-fit t-shirt.",
            images: {
                main: "../assets/images/tshirt3.jpg",
                thumbnails: [
                    "../assets/images/tshirt3.jpg",
                    "../assets/images/tshirt3-back.jpg",
                    "../assets/images/tshirt3-side.jpg",
                    "../assets/images/tshirt3-detail.jpg"
                ]
            }
        }
    ];
    
    // Save to localStorage
    localStorage.setItem('trendyTees_products', JSON.stringify(products));
}

// Initialize product card click events
function initializeProductCardLinks() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        const productImage = card.querySelector('.product-image');
        const productInfo = card.querySelector('.product-info');
        
        // Set cursor style to indicate clickable
        card.style.cursor = 'pointer';
        
        // Determine product ID based on index or existing data
        // In a real application, you would have a proper ID for each product
        let productId = `tshirt${index + 1}`;
        
        // Make both the image and info sections clickable
        [productImage, productInfo].forEach(element => {
            if (element) {
                // Clone the element to remove any existing event listeners
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                
                // Add click event listener to navigate to product detail page
                newElement.addEventListener('click', (e) => {
                    // Don't navigate if clicking on action buttons
                    if (e.target.closest('.action-btn')) {
                        return;
                    }
                    
                    // Navigate to product detail page with ID parameter
                    window.location.href = `./pd1.html?id=${productId}`;
                });
            }
        });
    });
}
