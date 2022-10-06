/*
    JS Example for week 2
*/

let num  = 100;

function foo() {
    let num2 = 200;
    console.log(num);
}

foo();

// let anonFun = function() {
//     console.log("hello");
// }

let anonFun = () => console.log("hello");

let person = "Summer";

(function (peopleName) {
    console.log("Hello " + peopleName);
})(person);

let arr = ["foo", 123, ["za"]];

console.log(arr[1]);

for (let j of arr) {
    console.log(j);
}

for (let i in arr) {
    console.log(i + " " + arr[i]);
}

arr.forEach((item, i) => console.log(i + " " + item));

let obj1 = {
    name: "Jill",
    age: 85,
    job: "Cactus Hunter",
}

console.log(obj1.job);

for (let key in obj1) {
    let value = obj1[key];
    console.log(`${key}: ${value}`);
}

console.log(`hello ${obj1["name"]} ${num}`);

let x = 75;
if (x > 50) {
    console.log("Above average");
}
else if (x > 5) {
    console.log("Below Average");
}
else {
    console.log("Really Below Average");
}

let y = (x > 50) ? "Above average" : "Below Average";

let example = document.getElementById("example");
example.innerHTML += "Hello world!";