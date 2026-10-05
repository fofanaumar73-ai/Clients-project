// ==========================================
// SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL = "https://difamwnbnfjevvgcprig.supabase.co";

const SUPABASE_KEY = "sb_publishable_pETuvhi__8zgCn2_Vc19BQ_IeW2PfLl";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   BUSINESS NAME— MAIN JAVASCRIPT
========================================================= */


/* ================= PRODUCT DATA ================= */

const products = [

    {
        id: 1,
        name: "iPhone 17 Pro Max",
        price: 1500000,
        category: "smartphones",
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1592286927505-2fd9e8f4b4b7?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 2,
        name: "Samsung Galaxy Ultra",
        price: 1250000,
        category: "smartphones",
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 3,
        name: "Premium Wireless Headphones",
        price: 185000,
        category: "audio",
        tag: "BEST SELLER",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 4,
        name: "Wireless Earbuds Pro",
        price: 95000,
        category: "audio",
        tag: "",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 5,
        name: "Premium Smartwatch",
        price: 220000,
        category: "accessories",
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e1c?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 6,
        name: "Fast Charging Station",
        price: 75000,
        category: "accessories",
        tag: "",
        image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 7,
        name: "Modern Gaming Controller",
        price: 120000,
        category: "accessories",
        tag: "POPULAR",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=85"
    },

    {
        id: 8,
        name: "Premium Phone Case",
        price: 25000,
        category: "accessories",
        tag: "",
        image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=85"
    }

];


/* ================= STATE ================= */

let cart = JSON.parse(localStorage.getItem("businessnameCart")) || [];

let currentCategory = "all";


/* ================= DOM ================= */

const productGrid = document.getElementById("productGrid");

const featuredProducts =
    document.getElementById("featuredProducts");

const cartDrawer =
    document.getElementById("cartDrawer");

const overlay =
    document.getElementById("overlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.querySelector(".cart-count");

const cartBtn =
    document.getElementById("cartBtn");

const closeCart =
    document.getElementById("closeCart");

const menuBtn =
    document.getElementById("menuBtn");

const mobileMenu =
    document.getElementById("mobileMenu");


/* ================= FORMAT MONEY ================= */

function formatMoney(amount) {

    return new Intl.NumberFormat("en-NG", {

        style: "currency",

        currency: "NGN",

        maximumFractionDigits: 0

    }).format(amount);

}


/* ================= PRODUCT CARD ================= */

function productCard(product) {

    return `

        <article class="product-card">

            <div class="product-image">

                ${product.tag
                    ? `<span class="product-tag">
                        ${product.tag}
                       </span>`
                    : ""
                }

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                <button
                    class="product-action"
                    onclick="addToCart(${product.id})"
                    aria-label="Add ${product.name} to cart"
                >
                    <i class="fa-solid fa-plus"></i>
                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${product.category}
                </span>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <p class="product-price">
                    ${formatMoney(product.price)}
                </p>

            </div>

        </article>

    `;

}


/* ================= RENDER PRODUCTS ================= */

function renderProducts() {

    let filteredProducts = [...products];


    if (currentCategory !== "all") {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.category === currentCategory
            );

    }


    const sortValue =
        document.getElementById("sortProducts").value;


    if (sortValue === "low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sortValue === "high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    }


    productGrid.innerHTML =
        filteredProducts.map(productCard).join("");


    featuredProducts.innerHTML =
        products
            .slice(0, 4)
            .map(productCard)
            .join("");

}


/* ================= ADD TO CART ================= */

function addToCart(productId) {

    const product =
        products.find(
            product => product.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart();

    updateCartUI();

    openCart();

}


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "problematicCart",
        JSON.stringify(cart)
    );

}


/* ================= CART UI ================= */

function updateCartUI() {

    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    cartCount.textContent =
        totalItems;


    if (!cart.length) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <h3>Your cart is empty</h3>

                <p>
                    Add products to see them here.
                </p>

            </div>

        `;

        cartTotal.textContent =
            formatMoney(0);

        return;

    }


    cartItems.innerHTML =
        cart.map(cartItem).join("");


    const total =
        cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );


    cartTotal.textContent =
        formatMoney(total);

}


/* ================= CART ITEM ================= */

function cartItem(item) {

    return `

        <div class="cart-item">

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>


            <div class="cart-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ${formatMoney(item.price)}
                </p>


                <div class="cart-item-controls">

                    <button
                        class="qty-btn"
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        class="qty-btn"
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${item.id})"
            >
                Remove
            </button>

        </div>

    `;

}


/* ================= CHANGE QUANTITY ================= */

function changeQuantity(productId, change) {

    const item =
        cart.find(
            item => item.id === productId
        );


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );

    }


    saveCart();

    updateCartUI();

}


/* ================= REMOVE ITEM ================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    updateCartUI();

}


/* ================= OPEN CART ================= */

function openCart() {

    cartDrawer.classList.add("active");

    overlay.classList.add("active");

    document.body.style.overflow =
        "hidden";

}


/* ================= CLOSE CART ================= */

function closeCartDrawer() {

    cartDrawer.classList.remove("active");

    overlay.classList.remove("active");

    document.body.style.overflow =
        "";

}


/* ================= EVENTS ================= */

cartBtn.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartDrawer
);


overlay.addEventListener(
    "click",
    closeCartDrawer
);


menuBtn.addEventListener(
    "click",
    () => {

        mobileMenu.classList.toggle(
            "active"
        );

    }
);


/* ================= FILTERS ================= */

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".filter-btn"
                    )
                    .forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );


                button.classList.add(
                    "active"
                );


                currentCategory =
                    button.dataset.category;


                renderProducts();

            }
        );

    });


/* ================= SORT ================= */

document
    .getElementById("sortProducts")
    .addEventListener(
        "change",
        renderProducts
    );


/* ================= CHECKOUT ================= */

document
    .querySelector(".checkout-btn")
    .addEventListener(
        "click",
        () => {

            if (!cart.length) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            alert(
                "Customer login will be required before submitting this order."
            );

        }
    );


/* ================= INITIALIZE ================= */

renderProducts();

updateCartUI();


/* ================= SEARCH ================= */

const searchBtn =
    document.getElementById("searchBtn");

const searchPanel =
    document.getElementById("searchPanel");

const closeSearch =
    document.getElementById("closeSearch");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");


function openSearch() {

    searchPanel.classList.add("active");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
        searchInput.focus();
    }, 150);

}


function closeSearchPanel() {

    searchPanel.classList.remove("active");

    document.body.style.overflow = "";

    searchInput.value = "";

    searchResults.innerHTML = `
        <p class="search-placeholder">
            Start typing to search products.
        </p>
    `;

}


searchBtn.addEventListener(
    "click",
    openSearch
);


closeSearch.addEventListener(
    "click",
    closeSearchPanel
);


searchPanel.addEventListener(
    "click",
    (event) => {

        if (event.target === searchPanel) {
            closeSearchPanel();
        }

    }
);


searchInput.addEventListener(
    "input",
    () => {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        if (!query) {

            searchResults.innerHTML = `
                <p class="search-placeholder">
                    Start typing to search products.
                </p>
            `;

            return;

        }


        const results =
            products.filter(product =>

                product.name
                    .toLowerCase()
                    .includes(query)

                ||

                product.category
                    .toLowerCase()
                    .includes(query)

            );


        if (!results.length) {

            searchResults.innerHTML = `
                <div class="search-no-results">
                    No products found for
                    "<strong>${searchInput.value}</strong>"
                </div>
            `;

            return;

        }


        searchResults.innerHTML =
            results.map(product => `

                <div
                    class="search-result"
                    onclick="searchAddProduct(${product.id})"
                >

                    <div class="search-result-image">

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                        >

                    </div>

                    <div class="search-result-info">

                        <h4>
                            ${product.name}
                        </h4>

                        <p>
                            ${formatMoney(product.price)}
                        </p>

                    </div>

                </div>

            `).join("");

    }
);


function searchAddProduct(productId) {

    addToCart(productId);

    closeSearchPanel();

}


// ==========================================
// SUPABASE CONNECTION TEST
// ==========================================

async function testSupabaseConnection() {
    const { data, error } = await supabaseClient
        .from("stores")
        .select("id")
        .limit(1);

    if (error) {
        console.error("Supabase connection failed:", error);
        return;
    }

    console.log("Supabase connected successfully:", data);
}

testSupabaseConnection();
