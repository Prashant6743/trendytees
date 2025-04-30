# TrendyTees - Modern T-Shirt Store

TrendyTees is a modern, feature-rich e-commerce web application for premium t-shirts. It offers a seamless shopping experience, including product collections, cart, checkout, user authentication, and a unique 3D customizable t-shirt designer powered by three.js.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Main Pages](#main-pages)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Customizable T-Shirt Designer](#customizable-t-shirt-designer)
- [Credits](#credits)

---

## Features
- Modern, responsive UI for t-shirt shopping
- Product collections: New Arrivals, Best Sellers, Limited Edition, Trending
- Add to Cart, Wishlist, and smooth cart management
- User authentication (Sign Up/Sign In)
- Profile management
- Checkout and shipping pages
- Newsletter subscription
- Contact form and FAQ
- About page with team and story
- 3D T-shirt customization (see [Customizable T-Shirt Designer](#customizable-t-shirt-designer))

---

## Project Structure
```
/ (root)
│
├── index.html                # Main landing page
├── pages/                    # All main site pages (collections, about, contact, cart, etc.)
├── assets/
│   ├── css/                  # All CSS stylesheets
│   ├── js/                   # All JavaScript files (cart, main, profile, etc.)
│   └── images/               # Product and team images
├── products/                 # (If present) Product data or images
├── threejs-t-shirt-main/     # 3D customizable t-shirt designer (React + three.js)
└── README.md                 # This file
```

---

## Main Pages
- **index.html**: Home page with featured products, highlights, categories, and newsletter
- **pages/collections.html**: Browse all t-shirt collections, filter by color, size, price
- **pages/cart.html**: View and manage cart items
- **pages/checkout.html**: Checkout process
- **pages/shipping.html**: Shipping details
- **pages/login.html**: User authentication (Sign In/Sign Up)
- **pages/profile.html**: User profile and order history
- **pages/about.html**: About TrendyTees, team, values, and story
- **pages/contact.html**: Contact form, info, FAQ, and map
- **Product detail pages (pages/pd1.html, ...)**: Individual product details

---

## Tech Stack
- **HTML5, CSS3, JavaScript (ES6+)**
- **Font Awesome** for icons
- **LocalStorage** for cart and wishlist persistence
- **three.js, React, Vite** (in `threejs-t-shirt-main/` for 3D customization)

---

## Getting Started

### Main Website
1. Clone this repository:
   ```bash
   git clone <your-repo-url>
   cd <project-root>
   ```
2. Open `index.html` directly in your browser, or use a local server (recommended for full JS features):
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   # Or use Live Server extension in VSCode
   ```
3. Visit `http://localhost:8000` in your browser.

### Customizable T-Shirt Designer (threejs-t-shirt-main)
1. Navigate to the subproject:
   ```bash
   cd threejs-t-shirt-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Customizable T-Shirt Designer
The `threejs-t-shirt-main` folder contains a full-featured 3D t-shirt customization tool built with React and three.js. Users can:
- Select t-shirt colors
- Upload their own logos/designs
- Preview in a 3D interactive environment
- Experience realistic lighting and shading

**Tech Used:** React, Vite, @react-three/fiber, @react-three/drei, three.js, framer-motion, maath, react-color, valtio

**To run:** See [Getting Started](#getting-started) above.

---

## Credits
- **Project Lead:** Prashant (Founder & Creative Director)
- **Team:** Kamran Raza (Co-Founder), Prithvi Raj (Lead Designer)
- **3D Designer:** Based on open-source three.js t-shirt projects
- **Design inspiration:** Bewakoof, Anderson Mancini, Paul Henschel
- **Icons:** Font Awesome
- **Images:** Demo images from Bewakoof and custom assets

---

## License
This project is for educational/demo purposes. The 3D t-shirt designer (`threejs-t-shirt-main`) is MIT licensed. See its [LICENSE](threejs-t-shirt-main/LICENSE) for details. 