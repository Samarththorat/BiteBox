// const student = {
//     name: "Samarth",
//     age: 20,
//     branch: "Computer Engineering",

//     display: function() {
//         console.log("Student Name: " + this.name);
//     }
// };

// console.log(student);
// student.display();

//access properties and methods of JavaScript objects

// const student = {
//     name: "Samarth",
//     age: 20,

//     greet: function() {
//         console.log("Hello " + this.name);
//     }
// };
// console.log(student.name);
// console.log(student["age"]);

// student.greet();

const student = {
    name: "Samarth",
    age: 20,

    display: function() {
        console.log("Name: " + this.name);
        console.log("Age: " + this.age);
    }
};

student.display();