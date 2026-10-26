
const params = new URLSearchParams(window.location.search);
const storeSlug = params.get("store");

const productsGrid = document.getElementById("products-grid");
const searchInput = document.getElementById("product-search");
const categoryFilter = document.getElementById("category-filter");
const productsCount = document.getElementById("products-count");
const productsEmpty = document.getElementById("products-empty");

let allProducts = [];
let storeCategories = [];

async function initializeProductsPage() {
    if (!storeSlug) {
        showProductsError("Store link is missing.");
        return;
    }

    try {
        const { data: store, error: storeError } = await supabaseClient
            .from("stores")
            .select("id, name, slug, status, is_active")
            .eq("slug", storeSlug)
            .maybeSingle();

        if (storeError) throw storeError;

        if (!store || store.status !== "ACTIVE" || store.is_active !== true) {
            showProductsError("This store is unavailable.");
            return;
        }

        document.title = `Products | ${store.name}`;

        const heading = document.querySelector(".products-heading h1");
        if (heading) heading.textContent = `Explore ${store.name} Products`;

        const [
            { data: products, error: productsError },
            { data: categories, error: categoriesError }
        ] = await Promise.all([
            supabaseClient
                .from("products")
                .select("*")
                .eq("store_id", store.id)
                .order("created_at", { ascending: false }),

            supabaseClient
                .from("categories")
                .select("*")
                .eq("store_id", store.id)
                .order("name", { ascending: true })
        ]);

        if (productsError) throw productsError;
        if (categoriesError) throw categoriesError;

        allProducts = (products || []).filter(
            product => product.is_active !== false
        );

        storeCategories = categories || [];

        populateCategoryFilter();
        renderProducts(allProducts);
    } catch (error) {
        console.error("Products page error:", error);
        showProductsError("Unable to load products. Please try again.");
    }
}

function escapeProductHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function formatProductPrice(value) {
    const amount = Number(value) || 0;

    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2
    }).format(amount);
}

function populateCategoryFilter() {
    categoryFilter.innerHTML = '<option value="">All Categories</option>';

    storeCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = String(category.id);
        option.textContent = category.name || "Category";
        categoryFilter.appendChild(option);
    });
}

function renderProducts(products) {
    productsGrid.innerHTML = "";
    productsCount.textContent =
        `${products.length} ${products.length === 1 ? "product" : "products"}`;

    productsEmpty.hidden = products.length !== 0;

    if (!products.length) return;

    productsGrid.innerHTML = products.map(product => {
        const image = product.image1 || product.image_url || product.image || "";
        const price = product.price ?? product.amount ?? 0;

        return `
            <article class="product-card"
                     data-product-id="${escapeProductHTML(product.id)}">
                <div class="product-image-wrap">
                    ${image
                        ? `<img class="product-image"
                                src="${escapeProductHTML(image)}"
                                alt="${escapeProductHTML(product.name || "Product")}"
                                loading="lazy">`
                        : `<div class="product-placeholder">
                               <i class="fa-solid fa-box"></i>
                           </div>`
                    }
                    ${product.badge
                        ? `<span class="product-badge">${escapeProductHTML(product.badge)}</span>`
                        : ""
                    }
                </div>

                <div class="product-info">
                    ${product.brand
                        ? `<div class="product-brand">${escapeProductHTML(product.brand)}</div>`
                        : ""
                    }

                    <h3 class="product-name">
                        ${escapeProductHTML(product.name || "Product")}
                    </h3>

                    <div class="product-bottom">
                        <strong class="product-price">
                            ${formatProductPrice(price)}
                        </strong>
                    </div>

                    <button class="add-cart-btn"
                            type="button"
                            data-add-cart="${escapeProductHTML(product.id)}">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <span>ADD TO CART</span>
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

function filterProductsPage() {
    const search = searchInput.value.trim().toLowerCase();
    const categoryId = categoryFilter.value;

    const filtered = allProducts.filter(product => {
        const matchesSearch = [
            product.name,
            product.brand,
            product.description
        ].some(value => String(value || "").toLowerCase().includes(search));

        const matchesCategory =
            !categoryId || String(product.category_id || "") === categoryId;

        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

function showProductsError(message) {
    productsGrid.innerHTML = "";
    productsCount.textContent = "";
    productsEmpty.hidden = false;
    productsEmpty.textContent = message;
}

searchInput.addEventListener("input", filterProductsPage);
categoryFilter.addEventListener("change", filterProductsPage);

initializeProductsPage();

