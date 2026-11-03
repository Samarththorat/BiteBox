// let restaurantName = "BiteBox";

// alert("Welcome to " + restaurantName + "!");

// let customerName = prompt(
//     "Welcome to " + restaurantName + "!\n\nWhat is your name?"
// );

// alert(
//     "Hello " + customerName + "!\n\nWelcome to BiteBox." );

//     let exploreMenu = confirm(
//     "Would you like to explore our menu?"
// );

// if (exploreMenu) {

//     alert("Great! Let's explore the BiteBox menu.");

// }

// else {

//     alert("No problem! You can explore the menu anytime.");

// }

// let choice = prompt( "Choose a BiteBox category:\n" +
//     "1. Pizza\n" +
//     "2. Burgers\n" +
//     "3. Pasta\n" +
//     "4. Desserts"
// );

// switch (choice) {
//     case "1":
//         alert("You selected Pizza!");
//         break;
//     case "2":
//         alert("You selected Burgers!");
//         break;
//     case "3":
//         alert("You selected Pasta!");
//         break;
//     case "4":
//         alert("You selected Desserts!");
//         break;
//     default:
//         alert("Invalid category selection.");
// }

// for (let i = 1; i <= 3; i++) {
//     let food = prompt("Enter food item " + i);
//     let quantity = prompt("Enter quantity for " + food );
//     console.log(food + " - Quantity: " + quantity);
// }


function calculateItemTotal(price, quantity) {
    return price * quantity;
}
let cartRows = document.querySelectorAll("#shopping-cart tbody tr");//makes an array of all the rows in the shopping cart table

function calculateSubtotal() {
    let subtotal = 0;
    let cartRows = document.querySelectorAll("#shopping-cart tbody tr");

    cartRows.forEach(function (row) {
        let priceText = row.children[1].textContent;

        let price = parseFloat(priceText.replace("₹", ""));
        let quantityText = row.querySelector(".quantity-box span").textContent;
        let quantity = parseInt(quantityText);
        let itemTotal = calculateItemTotal(price, quantity);
        subtotal += itemTotal;
    });
    return subtotal;
}
//Delivery and Packaging Charges
function calculateDeliveryCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }
    return 40;
}

function calculatePackagingCharge(subtotal) {
    if (subtotal === 0) {
        return 0;
    }

    return 20;
}
//Discount Calculation
function calculateDiscount(subtotal) {
    if (subtotal > 500) {
        return subtotal * 0.10;
    }
    return 0;
}

//Calculate final amount
function calculateTotal(subtotal, deliveryCharge, packagingCharge, discount) {
    return subtotal + deliveryCharge + packagingCharge - discount;
}

function updateOrderSummary() {

    let subtotalElement = document.getElementById("subtotal-amount");

    if (!subtotalElement) {
        return;
    }

    let subtotal = calculateSubtotal();
    let deliveryCharge = calculateDeliveryCharge(subtotal);
    let packagingCharge = calculatePackagingCharge(subtotal);
    let discount = calculateDiscount(subtotal);

    let totalAmount = calculateTotal(subtotal, deliveryCharge, packagingCharge, discount);

    document.getElementById("subtotal-amount").textContent = "₹" + subtotal.toFixed(2);

    document.getElementById("delivery-amount").textContent = "₹" + deliveryCharge.toFixed(2);

    document.getElementById("packaging-amount").textContent = "₹" + packagingCharge.toFixed(2);

    document.getElementById("discount-amount").textContent = "-₹" + discount.toFixed(2);

    document.getElementById("total-amount").textContent = "₹" + totalAmount.toFixed(2);

}

updateOrderSummary();