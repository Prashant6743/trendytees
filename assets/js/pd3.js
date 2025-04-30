
document.addEventListener('DOMContentLoaded', function() {
    // Load product details from URL parameters
    loadProductDetails();
    
    // Initialize thumbnail image switching
    initThumbnailSwitcher();
    
    // Initialize size selection
    initSizeSelection();
    
    // Initialize color selection
    initColorSelection();
    
    // Initialize add to cart functionality
    initAddToCart();
    
    // Initialize add to wishlist functionality
    initAddToWishlist();
});

// Load product details from URL parameters
function loadProductDetails() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // If no product ID is provided, use the default product displayed
    if (!productId) {
        return;
    }
    
    // In a real application, you would fetch the product details from an API or database
    // For this demo, we'll use a simple product database stored in localStorage
    let products = JSON.parse(localStorage.getItem('trendyTees_products'));
    
    // If no products exist in localStorage, create a default database
    if (!products) {
        initializeProductDatabase();
        products = JSON.parse(localStorage.getItem('trendyTees_products'));
    }
    
    // Find the product by ID
    const product = products.find(p => p.id === productId);
    
    // If product is found, update the page with its details
    if (product) {
        updateProductDetails(product);
    }
}

// Initialize product database with sample products
function initializeProductDatabase() {
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

// Update the product details on the page
function updateProductDetails(product) {
    // Update page title
    document.title = `${product.name} - TrendyTees`;
    
    // Update breadcrumb
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-name').textContent = product.name;
    
    // Update product name
    document.getElementById('detail-product-name').textContent = product.name;
    
    // Update product brand
    document.getElementById('product-brand-name').textContent = product.brand;
    
    // Update product price
    document.getElementById('current-price').textContent = `₹${product.price}`;
    document.getElementById('original-price').textContent = `₹${product.originalPrice}`;
    document.getElementById('discount').textContent = product.discount;
    
    // Update product fit and material
    document.getElementById('product-fit').textContent = product.fit;
    document.getElementById('product-material').textContent = product.material;
    
    // Update product description
    document.getElementById('product-description').textContent = product.description;
    
    // Update main product image
    document.getElementById('main-product-image').src = product.images.main;
    
    // Update thumbnail images
    updateThumbnails(product.images.thumbnails);
    
    // Update colors
    updateColorOptions(product.colors);
}

// Update thumbnail images
function updateThumbnails(thumbnails) {
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    thumbnailContainer.innerHTML = '';
    
    thumbnails.forEach((thumbnail, index) => {
        const div = document.createElement('div');
        div.className = index === 0 ? 'thumbnail active' : 'thumbnail';
        div.setAttribute('data-image', thumbnail);
        
        const img = document.createElement('img');
        img.src = thumbnail;
        img.alt = `Thumbnail ${index + 1}`;
        
        div.appendChild(img);
        thumbnailContainer.appendChild(div);
    });
    
    // Reinitialize thumbnail switcher
    initThumbnailSwitcher();
}

// Update color options
function updateColorOptions(colors) {
    const colorContainer = document.querySelector('.color-options');
    colorContainer.innerHTML = '';
    
    colors.forEach((color, index) => {
        const div = document.createElement('div');
        div.className = index === 0 ? 'color-option active' : 'color-option';
        div.setAttribute('data-color', color.name);
        div.style.backgroundColor = color.code;
        
        colorContainer.appendChild(div);
    });
    
    // Update selected color text
    document.getElementById('selected-color').textContent = colors[0].name;
    
    // Reinitialize color selection
    initColorSelection();
}

// Initialize thumbnail image switcher
function initThumbnailSwitcher() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const imageSrc = this.getAttribute('data-image');
            mainImage.src = imageSrc;
            
            // Add fade-in animation
            mainImage.classList.add('fade-in');
            setTimeout(() => {
                mainImage.classList.remove('fade-in');
            }, 500);
        });
    });
}

// Initialize size selection
function initSizeSelection() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all size options
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
        });
    });
}

// Initialize color selection
function initColorSelection() {
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorText = document.getElementById('selected-color');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all color options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update selected color text
            const colorName = this.getAttribute('data-color');
            selectedColorText.textContent = colorName;
        });
    });
}

// Initialize add to cart functionality
function initAddToCart() {
    const addToCartBtn = document.querySelector('.add-to-bag-btn');
    
    addToCartBtn.addEventListener('click', function() {
        // Get product details
        const productName = document.getElementById('detail-product-name').textContent;
        const productPrice = document.getElementById('current-price').textContent;
        const selectedSize = document.querySelector('.size-option.active').getAttribute('data-size');
        const selectedColor = document.getElementById('selected-color').textContent;
        const productImage = document.getElementById('main-product-image').src;
        
        // Create cart item
        const cartItem = {
            id: Date.now().toString(),
            name: productName,
            price: productPrice,
            size: selectedSize,
            color: selectedColor,
            image: productImage,
            quantity: 1
        };
        
        // Get existing cart or create new one
        let cart = JSON.parse(localStorage.getItem('trendyTees_cart')) || [];
        
        // Add item to cart
        cart.push(cartItem);
        
        // Save cart to localStorage
        localStorage.setItem('trendyTees_cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show success message
        showNotification('Product added to bag successfully!', 'success');
    });
}

// Initialize add to wishlist functionality
function initAddToWishlist() {
    const addToWishlistBtn = document.querySelector('.add-to-wishlist-btn');
    
    addToWishlistBtn.addEventListener('click', function() {
        // Get product details
        const productName = document.getElementById('detail-product-name').textContent;
        const productPrice = document.getElementById('current-price').textContent;
        const productImage = document.getElementById('main-product-image').src;
        
        // Create wishlist item
        const wishlistItem = {
            id: Date.now().toString(),
            name: productName,
            price: productPrice,
            image: productImage
        };
        
        // Get existing wishlist or create new one
        let wishlist = JSON.parse(localStorage.getItem('trendyTees_wishlist')) || [];
        
        // Add item to wishlist
        wishlist.push(wishlistItem);
        
        // Save wishlist to localStorage
        localStorage.setItem('trendyTees_wishlist', JSON.stringify(wishlist));
        
        // Show success message
        showNotification('Product added to wishlist!', 'success');
        
        // Change button appearance
        this.innerHTML = '<i class="fas fa-heart"></i> WISHLISTED';
        this.classList.add('wishlisted');
    });
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const cart = JSON.parse(localStorage.getItem('trendyTees_cart')) || [];
    
    cartCount.textContent = cart.length;
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `product-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification">×</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Add close button functionality
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}
