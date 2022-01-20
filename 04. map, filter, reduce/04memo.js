// map
/**
 * 함수형 프로그래밍은 인자와 인자값으로 소통
 * 맵은 결과를 리턴해서 리턴된 값을 개발자가 이후에 변화를 일으키는데 사용
 * 고차 함수
 */
const products = [
    {name: '반팔티', price: 15000},
    {name: '긴팔티', price: 20000},
    {name: '핸드폰케이스', price: 15000},
    {name: '후드티', price: 30000},
    {name: '바지', price: 25000}
];

let names = [];
for (const p of products) {
    names.push(p.name);
}
// console.log(names);

const map = (f, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(f(a));
    }
    return res;
}
// console.log(map(p => p.name, products));


// 이터러블 프로토콜을 따르는 map의 다형성
// let m = new Map();
// m.set('a', 10);
// m.set('b', 20);
// console.log(m);
// console.log(new Map(map(([k, a]) => [k, a * 2], m)));


// filter
// 특정 조건만 걸러내는 함수
let under20000 = [];
for (const p of products) {
    if (p.price < 20000) under20000.push(p);
}
// console.log(under20000);

const filter = (f, iter) => {
    let res = [];
    for (const a of iter) {
        if (f(a)) res.push(a); 
    }
    return res;
}
// console.log(filter(p => p.price < 20000, products));


// reduce
// 값을 축약하는 함수. 값들을 더해서 하나로 만듦
// 즉 값을 누적시켜 감
const nums = [1, 2, 3, 4, 5];

let total = 0;
for (const n of nums) {
    total = total + n;
}
// console.log(total);

const reduce = (f, acc, iter) => {
    if (!iter) {    // 이터레이터가 아니라면 이터러블 값을 이터레이터로!
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a);    // recursion
    }
    return acc;
};

const add = (a, b) => a+b;

console.log(reduce(add, 0, [1, 2, 3, 4, 5]));
console.log(add(add(add(add(add(0, 1), 2), 3), 4), 5));

const totalPrice = reduce((sumPrice, product) => sumPrice + product.price);
// console.log(totalPrice);