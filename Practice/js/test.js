// Do-While loop

// let i=5;
// do{
//     i++;
//     if(i==8){
//         continue;
//     }
//      console.log(i);
//     i++;
// } while(i <=10);



// functions

// function add(a,b){
//     r= a+b;
// console.log(r);
// }
// add(10,20);



// function multiply(a,b){ //MULTIPLY is the function name and a,b are the parameters of the function
//    let r= a*b; // r is the local variable of the function multiply and it will return the value of a*b
// return r;  // return is used to return the value of r to the calling function
// }
// let result= multiply(10,20);// multiply(10,20) is the function call and it will return the value of r to the variable result
// console.log(result);//print the value of result 



// function divide(a,b){
//     let r= a/b;
//     return r;
// }
// let rem= divide(10,2);
// console.log(rem);



//pure function
// function incomeTax(salary){
//     return `My salary is $${salary}`;
// }
// let line= incomeTax(10000);
// console.log(line);



//impure function
// let incetive= Number(prompt("Enter your salary :"));
// function income(salary){
//     let total= salary+incetive;
//     return `My salary is $${total}`;
// }
// let result= income(50000);
// console.log(result);


// first class function

// let add= function(a,b){
//  z=a+b;
//     return z;
// }
// let result= add(10,20);
// console.log(result);

// higher order function

// function hello(){
//     console.log("Hello");

// }

// function higherOrder(hello){
//     for(let i=1; i<3; i++){
//         hello();
//     }
// }
// higherOrder(hello);


// //arrow function
// const greet= (name)=> `Hello ${name}`;
// let result= greet("John");
// console.log(result);    

//default parameter
// function greet(name = "Samarth") {
//     console.log("Hello " + name);
// }

// greet("Rahul");

//anonymous function
// let greet = function() {
//     console.log("Hello World");
// };

// greet();


//The Secrets of number formatting in JavaScript

//math.tofixed()
let num = 12.5678;
console.log(num.toFixed(2));//makes the number to the specified length of decimal places

//math.toPrecision()
let no = 123.456;
console.log(no.toPrecision(4));//makes the number to the specified length of significant digits

//math.round()
let number = 12.5678;
console.log(Math.round(number));//makes the number to the nearest integer

//math.floor()
let num1 = 12.5678;
console.log(Math.floor(num1));//makes the number to the nearest integer less than or equal to the given number

//math.ceil()
let num2 = 12.5678;
console.log(Math.ceil(num2));//makes the number to the nearest integer greater than or equal to the given number