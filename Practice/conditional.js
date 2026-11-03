// let age =18;
// if (age >= 18) {
//     let weight = 45;
//     if (weight >= 50) {
//         console.log("You are eligible to donate blood");
//     } else {
//         console.log("You are not eligible to donate blood");
//     }
// } else {
//     console.log("You are child so be 18 years old to be eligible to donate blood");
// }


let pay="upi";
switch (pay) {
    case "cash":
        console.log("You have selected cash payment");
        break;
    case "upi":
        console.log("You have selected UPI payment");
        break;
    case "card":
        console.log("You have selected card payment");
        break;             
    default:
        console.log("Invalid payment method");
}