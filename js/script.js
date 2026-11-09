"use strict";

const CART_STORAGE_KEY = "biteboxCart";
const CART_IMAGE_PATH = /^(?:\.\/)?assets\/images\/[\w.-]+$/;
let cart = loadCart();
let notificationTimer;

function showNotification(message, isError) {
    let notification = document.getElementById("bitebox-notification");

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "bitebox-notification";
        notification.className = "bitebox-notification";
        notification.setAttribute("role", "status");
        notification.setAttribute("aria-live", "polite");
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.toggle("is-error", Boolean(isError));
    notification.classList.add("is-visible");
    window.clearTimeout(notificationTimer);
    notificationTimer = window.setTimeout(function () {
        notification.classList.remove("is-visible");
    }, 3000);
}

function productIdFromName(name) {
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function loadCart() {
    let savedCart;

    try {
        savedCart = localStorage.getItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error("Unable to read the BiteBox cart from localStorage.", error);
        return [];
    }

    if (savedCart === null) {
        return [];
    }

    let parsedCart;
    try {
        parsedCart = JSON.parse(savedCart);
    } catch (error) {
        console.error("The saved BiteBox cart contains invalid JSON.", error);
        clearInvalidCart();
        return [];
    }

    if (!Array.isArray(parsedCart)) {
        console.error("The saved BiteBox cart is not a valid item list.");
        clearInvalidCart();
        return [];
    }

    let validItems = [];
    parsedCart.forEach(function (item) {
        if (!item || typeof item !== "object" || typeof item.name !== "string") {
            return;
        }

        let name = item.name.trim();
        let id = typeof item.id === "string" && item.id.trim()
            ? item.id.trim()
            : productIdFromName(name);
        let price = Number(item.price);
        let quantity = Number(item.quantity);

        if (
            !id ||
            !name ||
            !Number.isFinite(price) ||
            price <= 0 ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            typeof item.image !== "string" ||
            !CART_IMAGE_PATH.test(item.image)
        ) {
            return;
        }

        let existingItem = validItems.find(function (savedItem) {
            return savedItem.id === id;
        });

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            validItems.push({
                id: id,
                name: name,
                image: item.image,
                price: price,
                quantity: quantity
            });
        }
    });

    return validItems;
}

function clearInvalidCart() {
    try {
        localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
        console.error("Unable to clear invalid BiteBox cart data.", error);
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Unable to save the BiteBox cart to localStorage.", error);
        showNotification("Your cart could not be saved in this browser.", true);
        return false;
    }
}

function getTotalQuantity() {
    return cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);
}

function formatCurrency(amount) {
    return "₹" + amount.toFixed(2);
}

function updateCartCount() {
    let itemCount = getTotalQuantity();
    document.querySelectorAll("[data-cart-count]").forEach(function (countElement) {
        countElement.textContent = String(itemCount);
        let cartLink = countElement.closest("a");
        if (cartLink) {
            cartLink.setAttribute("aria-label", "Cart, " + itemCount + " items");
        }
    });
}

function calculateSubtotal() {
    return cart.reduce(function (subtotal, item) {
        return subtotal + item.price * item.quantity;
    }, 0);
}

function calculateDeliveryCharge(subtotal) {
    return subtotal === 0 ? 0 : 40;
}

function calculatePackagingCharge(subtotal) {
    return subtotal === 0 ? 0 : 20;
}

function calculateDiscount(subtotal) {
    return subtotal > 500 ? subtotal * 0.1 : 0;
}

function updateOrderSummary() {
    let subtotal = calculateSubtotal();
    let deliveryCharge = calculateDeliveryCharge(subtotal);
    let packagingCharge = calculatePackagingCharge(subtotal);
    let discount = calculateDiscount(subtotal);
    let totalAmount = subtotal + deliveryCharge + packagingCharge - discount;
    let quantityLabel = document.querySelector("[data-cart-total-quantity]");

    if (quantityLabel) {
        let itemCount = getTotalQuantity();
        quantityLabel.textContent = "Subtotal (" + itemCount + " " + (itemCount === 1 ? "Item" : "Items") + ")";
    }

    let summaryValues = [
        ["subtotal-amount", subtotal],
        ["delivery-amount", deliveryCharge],
        ["packaging-amount", packagingCharge],
        ["discount-amount", discount],
        ["total-amount", totalAmount]
    ];

    summaryValues.forEach(function (summaryValue) {
        let element = document.getElementById(summaryValue[0]);
        if (element) {
            let prefix = summaryValue[0] === "discount-amount" && summaryValue[1] > 0 ? "-₹" : "₹";
            element.textContent = prefix + summaryValue[1].toFixed(2);
        }
    });
}

function createCartCell(content) {
    let cell = document.createElement("td");
    if (typeof content === "string") {
        cell.textContent = content;
    } else {
        cell.appendChild(content);
    }
    return cell;
}

function renderCart() {
    let cartBody = document.querySelector("#shopping-cart tbody");
    if (!cartBody) {
        return;
    }

    cartBody.replaceChildren();

    if (cart.length === 0) {
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        let message = document.createElement("div");
        let heading = document.createElement("h3");
        let description = document.createElement("p");

        cell.colSpan = 5;
        message.className = "empty-cart";
        heading.textContent = "Your Cart is Empty";
        description.textContent = "Add some delicious food from our Menu!";
        message.append(heading, description);
        cell.appendChild(message);
        row.appendChild(cell);
        cartBody.appendChild(row);
        return;
    }

    cart.forEach(function (item) {
        let row = document.createElement("tr");
        let itemCellContent = document.createElement("div");
        let image = document.createElement("img");
        let itemDetails = document.createElement("div");
        let name = document.createElement("h3");

        itemCellContent.className = "cart-item";
        image.src = item.image;
        image.alt = item.name;
        image.width = 80;
        name.textContent = item.name;
        itemDetails.appendChild(name);
        itemCellContent.append(image, itemDetails);

        let quantityBox = document.createElement("div");
        let decreaseButton = document.createElement("button");
        let quantity = document.createElement("span");
        let increaseButton = document.createElement("button");
        quantityBox.className = "quantity-box";
        decreaseButton.type = "button";
        decreaseButton.className = "decrease";
        decreaseButton.dataset.productId = item.id;
        decreaseButton.setAttribute("aria-label", "Decrease quantity of " + item.name);
        decreaseButton.textContent = "−";
        quantity.textContent = String(item.quantity);
        increaseButton.type = "button";
        increaseButton.className = "increase";
        increaseButton.dataset.productId = item.id;
        increaseButton.setAttribute("aria-label", "Increase quantity of " + item.name);
        increaseButton.textContent = "+";
        quantityBox.append(decreaseButton, quantity, increaseButton);

        let removeLink = document.createElement("a");
        let removeImage = document.createElement("img");
        removeLink.href = "#";
        removeLink.className = "remove-item";
        removeLink.dataset.productId = item.id;
        removeLink.setAttribute("aria-label", "Remove " + item.name + " from cart");
        removeImage.src = "assets/icons/delete.png";
        removeImage.alt = "Delete";
        removeImage.width = 25;
        removeLink.appendChild(removeImage);

        row.append(
            createCartCell(itemCellContent),
            createCartCell(formatCurrency(item.price)),
            createCartCell(quantityBox),
            createCartCell(formatCurrency(item.price * item.quantity)),
            createCartCell(removeLink)
        );
        cartBody.appendChild(row);
    });
}

function addToCart(card) {
    let nameElement = card.querySelector("h3");
    let priceElement = card.querySelector(".price");
    let imageElement = card.querySelector("img");
    let id = card.dataset.productId;
    let name = nameElement ? nameElement.textContent.trim() : "";
    let price = priceElement ? Number(priceElement.textContent.replace(/[^\d.]/g, "")) : NaN;
    let image = imageElement ? imageElement.getAttribute("src") : "";

    if (!id || !name || !Number.isFinite(price) || price <= 0 || !CART_IMAGE_PATH.test(image)) {
        console.error("Unable to add this menu item because its product details are invalid.");
        showNotification("This item could not be added to your cart.", true);
        return;
    }

    let existingItem = cart.find(function (item) {
        return item.id === id;
    });

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            image: image,
            price: price,
            quantity: 1
        });
    }

    renderCart();
    updateCartCount();
    updateOrderSummary();

    if (saveCart()) {
        showNotification("Item added to cart successfully!");
    }
}

function changeQuantity(id, amount) {
    let item = cart.find(function (cartItem) {
        return cartItem.id === id;
    });
    if (!item) {
        return;
    }

    item.quantity = Math.max(1, item.quantity + amount);
    renderCart();
    updateCartCount();
    updateOrderSummary();
    saveCart();
}

function removeFromCart(id) {
    cart = cart.filter(function (item) {
        return item.id !== id;
    });
    renderCart();
    updateCartCount();
    updateOrderSummary();
    saveCart();
}

function filterMenu(category) {
    let menuContainer = document.getElementById("menu-items");
    if (!menuContainer) {
        return;
    }

    let selectedCategory = menuContainer.dataset.selectedCategory === category ? "" : category;
    menuContainer.dataset.selectedCategory = selectedCategory;
    let visibleItems = 0;

    menuContainer.querySelectorAll("article[data-product-id]").forEach(function (card) {
        let isVisible = !selectedCategory || card.dataset.category === selectedCategory;
        card.hidden = !isVisible;
        if (card.nextElementSibling && card.nextElementSibling.tagName === "BR") {
            card.nextElementSibling.hidden = !isVisible;
        }
        if (isVisible) {
            visibleItems += 1;
        }
    });

    document.querySelectorAll("#categories [data-category][aria-pressed]").forEach(function (categoryCard) {
        categoryCard.setAttribute("aria-pressed", String(categoryCard.dataset.category === selectedCategory));
    });

    let message = menuContainer.querySelector(".menu-empty-message");
    if (!message && visibleItems === 0) {
        message = document.createElement("p");
        message.className = "menu-empty-message";
        message.setAttribute("role", "status");
        menuContainer.appendChild(message);
    }
    if (message) {
        message.textContent = visibleItems === 0 ? "No food items are available in this category." : "";
    }
}

function initializePage() {
    updateCartCount();
    renderCart();
    updateOrderSummary();

    let categoryContainer = document.getElementById("categories");
    if (categoryContainer) {
        categoryContainer.addEventListener("click", function (event) {
            let target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            let categoryCard = target.closest("article[data-category][aria-pressed]");
            if (categoryCard) {
                filterMenu(categoryCard.dataset.category);
            }
        });

        categoryContainer.addEventListener("keydown", function (event) {
            let target = event.target;
            if (!(target instanceof Element) || (event.key !== "Enter" && event.key !== " ")) {
                return;
            }

            let categoryCard = target.closest("article[data-category][aria-pressed]");
            if (categoryCard) {
                event.preventDefault();
                filterMenu(categoryCard.dataset.category);
            }
        });
    }

    let menuContainer = document.getElementById("menu-items");
    if (menuContainer) {
        menuContainer.addEventListener("click", function (event) {
            let target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            let addButton = target.closest("button");
            let card = addButton ? addButton.closest("article[data-product-id]") : null;
            if (card && addButton.textContent.includes("Add to Cart")) {
                addToCart(card);
                return;
            }

        });
    }

    let cartBody = document.querySelector("#shopping-cart tbody");
    if (cartBody) {
        cartBody.addEventListener("click", function (event) {
            let target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            let removeLink = target.closest("a.remove-item");
            if (removeLink) {
                event.preventDefault();
                removeFromCart(removeLink.dataset.productId);
                return;
            }

            let quantityButton = target.closest("button.increase, button.decrease");
            if (quantityButton) {
                let amount = quantityButton.classList.contains("increase") ? 1 : -1;
                changeQuantity(quantityButton.dataset.productId, amount);
            }
        });
    }

    document.querySelectorAll('[data-cart-action="clear"]').forEach(function (button) {
        button.addEventListener("click", function () {
            cart = [];
            renderCart();
            updateCartCount();
            updateOrderSummary();
            if (saveCart()) {
                showNotification("Your cart has been cleared.");
            }
        });
    });

    document.querySelectorAll('[data-cart-action="checkout"]').forEach(function (button) {
        button.addEventListener("click", function () {
            if (cart.length === 0) {
                showNotification("Your cart is empty. Add items before checkout.", true);
                return;
            }

            showNotification("Checkout is not connected to a payment or ordering service yet.");
        });
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage, { once: true });
} else {
    initializePage();
}


//search and filtering 

let menuCards = document.querySelectorAll("#menu-items article");


let searchInput = document.getElementById("menu-search");

let searchButton = document.getElementById("search-button");

function searchMenu(searchText) {
    let searchValue =  searchText .trim().toLowerCase();

    menuCards.forEach(function(card) {
        let foodName = card.querySelector("h3").textContent.trim().toLowerCase();

        if (foodName.includes(searchValue)) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }
    });

}      

if (searchButton) {
    searchButton.addEventListener(
        "click",
        function() {
            searchMenu(searchInput.value);
        }
    );
}

let categoryCards = document.querySelectorAll("#categories article");

function filterMenu(category) {

    menuCards.forEach(function(card) {
        let cardCategory = card.dataset.category.toLowerCase();

        if (cardCategory === category) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }
    });

}

categoryCards.forEach(
    function(card) {

        card.addEventListener("click",function() {
                let category = card.querySelector("h3")
                        .textContent
                        .trim()
                        .toLowerCase();
                filterMenu(category);
            }
        );
    }
);      