//making clickable navbar

const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if(bar){
    bar.addEventListener('click',() => {
        nav.classList.add('active');
    })
}

// this is for making cross clickable 
if(close){
    close.addEventListener('click',() => {
        nav.classList.remove('active');
    })
}

// Product Data Structure
const products = [
    { id: 1, title: "Classic Casual Shirt", price: 399, image: "img/products/f1.jpg", brand: "adidas", rating: 5 },
    { id: 2, title: "Striped Casual Shirt", price: 699, image: "img/products/f2.jpg", brand: "adidas", rating: 4 },
    { id: 3, title: "Regular Fit Shirt", price: 1299, image: "img/products/f3.jpg", brand: "adidas", rating: 5 },
    { id: 4, title: "Printed Cotton Shirt", price: 449, image: "img/products/f4.jpg", brand: "adidas", rating: 4 },
    { id: 5, title: "Half Sleeve Shirt", price: 999, image: "img/products/f5.jpg", brand: "adidas", rating: 4 },
    { id: 6, title: "Full Sleeve Shirt", price: 549, image: "img/products/f6.jpg", brand: "adidas", rating: 5 },
    { id: 7, title: "Classic Full Palazzo", price: 799, image: "img/products/f7.jpg", brand: "adidas", rating: 3 },
    { id: 8, title: "Hooded Sweatshirt", price: 1199, image: "img/products/f8.jpg", brand: "adidas", rating: 5 },
    { id: 9, title: "Plain Shirt", price: 899, image: "img/products/n1.jpg", brand: "adidas", rating: 4 },
    { id: 10, title: "Oxford Shirt", price: 349, image: "img/products/n2.jpg", brand: "adidas", rating: 3 },
    { id: 11, title: "Formal Dress Shirt", price: 949, image: "img/products/n3.jpg", brand: "adidas", rating: 4 },
    { id: 12, title: "Short Sleeve Resort Shirt", price: 1499, image: "img/products/n4.jpg", brand: "adidas", rating: 5 },
    { id: 13, title: "Oversized Shirt", price: 299, image: "img/products/n5.jpg", brand: "adidas", rating: 3 },
    { id: 14, title: "Short Pants", price: 849, image: "img/products/n6.jpg", brand: "adidas", rating: 4 },
    { id: 15, title: "Double Pocket Shirt", price: 649, image: "img/products/n7.jpg", brand: "adidas", rating: 4 },
    { id: 16, title: "Regular Fit Shirt", price: 749, image: "img/products/n8.jpg", brand: "adidas", rating: 5 }
];

// Cart Data
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;

// Available Coupon Codes
const coupons = [
    { code: "WELCOME10", discount: 10, type: "percentage", description: "10% off on your first order" },
    { code: "SAVE20", discount: 20, type: "percentage", description: "20% off on orders above 1000 Rs" },
    { code: "FLAT500", discount: 500, type: "fixed", description: "Flat 500 Rs off on orders above 2000 Rs" },
    { code: "SUMMER25", discount: 25, type: "percentage", description: "25% off on summer collection" },
    { code: "FLAT200", discount: 200, type: "fixed", description: "Flat 200 Rs off on all orders" }
];

// Clean up cart data on load - remove any invalid items
cart = cart.filter(item => {
    const productExists = products.find(p => p.id === item.id);
    return productExists && item.quantity > 0;
});
localStorage.setItem("cart", JSON.stringify(cart));

// Initialize cart icon badge on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
    setupCartButtons();
    
    // If on cart page, render cart items and setup coupon
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        displayCouponSuggestions();
        setupCouponEvents();
        updateAppliedCouponDisplay();
        updateCartTotal(); // Update total with any applied coupon
    }
});

// Setup coupon event listeners
function setupCouponEvents() {
    const applyBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-input');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyCoupon();
        });
    }
    
    if (couponInput) {
        couponInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCoupon();
            }
        });
    }
}

// Setup cart buttons on all product pages
function setupCartButtons() {
    // Find all cart icons in product cards
    const cartButtons = document.querySelectorAll('.pro .cart a, .pro .cart i');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the parent product card
            const productCard = button.closest('.pro');
            if (!productCard) return;
            
            // Get product image
            const productImg = productCard.querySelector('img');
            const imgSrc = productImg ? productImg.src : '';
            
            // Extract product ID from image path
            const imgPath = imgSrc.split('/').pop();
            const product = products.find(p => p.image.includes(imgPath));
            
            if (product) {
                addToCart(product);
                showNotification('Item added to cart!');
            }
        });
    });
}

// Add to cart function
function addToCart(product) {
    if (!product || !product.id) return;

    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartIcon();
    
    // If on cart page, update cart display
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
}

// Render cart items on cart page
function renderCartItems() {
    const cartTableBody = document.querySelector('#cart table tbody');
    const cartTotalElement = document.getElementById('cart-total');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    
    if (!cartTableBody) return;

    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <p style="font-size: 16px; color: #888;">Your cart is empty</p>
                    <a href="shop.html" style="color: #088178; text-decoration: none; font-weight: 600;">Continue Shopping</a>
                </td>
            </tr>
        `;
        if (cartSubtotalElement) cartSubtotalElement.textContent = '0 Rs';
        if (cartTotalElement) cartTotalElement.textContent = '0 Rs';
        return;
    }

    cartTableBody.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return '';
        
        const subtotal = product.price * (item.quantity || 1);
        
        return `
            <tr>
                <td><a href="#" class="remove-item" data-id="${item.id}"><i class="fas fa-times-circle"></i></a></td>
                <td><img src="${product.image}" alt="${product.title}"></td>
                <td>${product.title}</td>
                <td>${product.price} Rs</td>
                <td><input type="number" value="${item.quantity || 1}" min="1" class="quantity-input" data-id="${item.id}"></td>
                <td>${subtotal} Rs</td>
            </tr>
        `;
    }).filter(Boolean).join("");

    // Setup event listeners for cart items
    setupCartItemListeners();
    updateCartTotal();
}

// Setup event listeners for cart items
function setupCartItemListeners() {
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
            removeFromCart(id);
        });
    });

    // Quantity inputs
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const value = parseInt(e.target.value);
            if (value >= 1) {
                updateQuantity(id, value);
            } else {
                e.target.value = 1;
                updateQuantity(id, 1);
            }
        });
    });
}

// Update quantity
function updateQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    updateCartIcon();
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartItems();
    updateCartIcon();
    showNotification('Item removed from cart');
}

// Update cart total
function updateCartTotal() {
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const discountRow = document.getElementById('discount-row');
    const discountAmountElement = document.getElementById('discount-amount');
    const discountCodeNameElement = document.getElementById('discount-code-name');

    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return sum;
        return sum + (product.price * (item.quantity || 1));
    }, 0);
    
    let discount = 0;
    let finalTotal = subtotal;
    
    // Calculate discount if coupon is applied
    if (appliedCoupon) {
        const coupon = coupons.find(c => c.code === appliedCoupon.code);
        if (coupon) {
            if (coupon.type === "percentage") {
                discount = Math.round((subtotal * coupon.discount) / 100);
            } else {
                discount = coupon.discount;
            }
            
            // Apply minimum order conditions
            if (coupon.code === "SAVE20" && subtotal < 1000) {
                discount = 0;
            } else if (coupon.code === "FLAT500" && subtotal < 2000) {
                discount = 0;
            }
            
            finalTotal = Math.max(0, subtotal - discount);
            
            // Show discount row
            if (discountRow) {
                discountRow.style.display = 'table-row';
                if (discountAmountElement) discountAmountElement.textContent = discount;
                if (discountCodeNameElement) discountCodeNameElement.textContent = appliedCoupon.code;
            }
        }
    } else {
        // Hide discount row if no coupon
        if (discountRow) discountRow.style.display = 'none';
    }
    
    if (cartSubtotalElement) cartSubtotalElement.textContent = `${subtotal} Rs`;
    if (cartTotalElement) cartTotalElement.textContent = `${finalTotal} Rs`;
}

// Apply coupon code
function applyCoupon(couponCode) {
    const couponInput = document.getElementById('coupon-input');
    const couponMessage = document.getElementById('coupon-message');
    
    if (!couponCode) {
        couponCode = couponInput ? couponInput.value.trim().toUpperCase() : '';
    }
    
    if (!couponCode) {
        if (couponMessage) {
            couponMessage.innerHTML = '<span style="color: #ef3636;">Please enter a coupon code</span>';
        }
        return false;
    }
    
    const coupon = coupons.find(c => c.code === couponCode);
    
    if (!coupon) {
        if (couponMessage) {
            couponMessage.innerHTML = '<span style="color: #ef3636;">Invalid coupon code. Please try again.</span>';
        }
        return false;
    }
    
    // Check minimum order conditions
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return sum;
        return sum + (product.price * (item.quantity || 1));
    }, 0);
    
    if (coupon.code === "SAVE20" && subtotal < 1000) {
        if (couponMessage) {
            couponMessage.innerHTML = '<span style="color: #ef3636;">This coupon requires minimum order of 1000 Rs</span>';
        }
        return false;
    }
    
    if (coupon.code === "FLAT500" && subtotal < 2000) {
        if (couponMessage) {
            couponMessage.innerHTML = '<span style="color: #ef3636;">This coupon requires minimum order of 2000 Rs</span>';
        }
        return false;
    }
    
    // Apply coupon
    appliedCoupon = { code: coupon.code, discount: coupon.discount, type: coupon.type };
    localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    
    if (couponInput) couponInput.value = '';
    if (couponMessage) {
        couponMessage.innerHTML = `<span style="color: #088178; font-weight: 600;">✓ Coupon "${coupon.code}" applied successfully! ${coupon.description}</span>`;
    }
    
    updateCartTotal();
    updateAppliedCouponDisplay();
    showNotification(`Coupon "${coupon.code}" applied successfully!`);
    return true;
}

// Remove coupon
window.removeCoupon = function() {
    appliedCoupon = null;
    localStorage.removeItem("appliedCoupon");
    
    const couponMessage = document.getElementById('coupon-message');
    const appliedCouponDisplay = document.getElementById('applied-coupon-display');
    
    if (couponMessage) couponMessage.innerHTML = '';
    if (appliedCouponDisplay) appliedCouponDisplay.style.display = 'none';
    
    updateCartTotal();
    showNotification('Coupon removed');
}

// Update applied coupon display
function updateAppliedCouponDisplay() {
    const appliedCouponDisplay = document.getElementById('applied-coupon-display');
    const appliedCouponCode = document.getElementById('applied-coupon-code');
    
    if (appliedCoupon && appliedCouponDisplay && appliedCouponCode) {
        appliedCouponDisplay.style.display = 'block';
        appliedCouponCode.textContent = appliedCoupon.code;
    } else if (appliedCouponDisplay) {
        appliedCouponDisplay.style.display = 'none';
    }
}

// Display coupon suggestions
function displayCouponSuggestions() {
    const suggestionsList = document.getElementById('suggestions-list');
    if (!suggestionsList) return;
    
    suggestionsList.innerHTML = coupons.map(coupon => {
        return `
            <div style="background-color: #f5f5f5; padding: 8px 15px; border-radius: 4px; cursor: pointer; border: 1px solid #e2e9e1; transition: 0.3s;" 
                 onmouseover="this.style.backgroundColor='#e8f6ea'; this.style.borderColor='#088178';" 
                 onmouseout="this.style.backgroundColor='#f5f5f5'; this.style.borderColor='#e2e9e1';"
                 onclick="applyCouponFromSuggestion('${coupon.code}')">
                <span style="font-weight: 600; color: #088178;">${coupon.code}</span>
                <span style="font-size: 12px; color: #465b52; margin-left: 8px;">${coupon.description}</span>
            </div>
        `;
    }).join('');
}

// Apply coupon from suggestion
window.applyCouponFromSuggestion = function(code) {
    const couponInput = document.getElementById('coupon-input');
    if (couponInput) couponInput.value = code;
    applyCoupon(code);
}

// Update cart icon badge
function updateCartIcon() {
    const cartIcons = document.querySelectorAll('#cart-icon, #mobile-cart-icon, #lg-bag a, #mobile a[href="cart.html"]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    cartIcons.forEach(icon => {
        // Remove existing badge
        const existingBadge = icon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add badge if there are items
        if (totalItems > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = totalItems;
            icon.style.position = 'relative';
            icon.appendChild(badge);
        }
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Handle contact form submission (global function)
window.handleContactSubmit = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Store contact form data
    const contactData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('contactData', JSON.stringify(contactData));
    
    // Redirect to success page
    window.location.href = 'contact-success.html';
}

// Handle checkout form submission (global function)
window.handleCheckout = function(event) {
    event.preventDefault();
    
    const name = document.getElementById('checkout-name').value;
    const email = document.getElementById('checkout-email').value;
    const paymentMode = document.getElementById('payment-mode').value;
    
    if (!name || !email || !paymentMode) {
        alert('Please fill in all fields');
        return;
    }
    
    // Calculate total with discount
    const subtotal = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        if (!product) return sum;
        return sum + (product.price * (item.quantity || 1));
    }, 0);
    
    let discount = 0;
    if (appliedCoupon) {
        const coupon = coupons.find(c => c.code === appliedCoupon.code);
        if (coupon) {
            if (coupon.type === "percentage") {
                discount = Math.round((subtotal * coupon.discount) / 100);
            } else {
                discount = coupon.discount;
            }
            
            // Apply minimum order conditions
            if (coupon.code === "SAVE20" && subtotal < 1000) {
                discount = 0;
            } else if (coupon.code === "FLAT500" && subtotal < 2000) {
                discount = 0;
            }
        }
    }
    
    const finalTotal = Math.max(0, subtotal - discount);
    
    // Store order details
    const orderDetails = {
        name: name,
        email: email,
        paymentMode: paymentMode,
        cart: cart,
        subtotal: subtotal,
        discount: discount,
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        total: finalTotal,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    
    // Clear cart and coupon
    cart = [];
    appliedCoupon = null;
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.removeItem("appliedCoupon");
    updateCartIcon();
    
    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
}
