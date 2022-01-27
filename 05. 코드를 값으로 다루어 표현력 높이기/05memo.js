const curry = f =>
    (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);
    // a와 나머지 요소들을 인자로
    // _가 여러개가 있다면 length에서 true로 걸러짐
    // 즉 인자가 두 개 이상이면 받아둔 함수를 즉시 실행,
    // 두 개보다 작다면 함수를 다시 리턴 후에 그 이후에 받은 함수로 실행
    // currying? 여러 개의 인수를 각각 하나의 인수만 취하는 함수를 일련의 함수로 분해하는 것


const map = curry((f, iter) => {
    let res = [];
    for (const a of iter) {
        res.push(f(a));
    }
    return res;
});
  
const filter = curry((f, iter) => {
    let res = [];
    for (const a of iter) {
        if (f(a)) res.push(a);
    }
    return res;
});

const reduce = curry((f, acc, iter) => {
    if (!iter) {
      iter = acc[Symbol.iterator]();
      acc = iter.next().value;
    }
    for (const a of iter) {
      acc = f(acc, a);
    }
    return acc;
  });

const products = [
    {name: '반팔티', price: 15000},
    {name: '긴팔티', price: 20000},
    {name: '핸드폰케이스', price: 15000},
    {name: '후드티', price: 30000},
    {name: '바지', price: 25000}
];

const add = (a, b) => a + b;

const go = (...args) => reduce((a, f) => f(a), args);
const pipe = (...fs) => (a) => go(a, ...fs);

// go함수: 함수와 인자를 전달해서 즉시 어떤 값을 평가 
// go(
//     add(0, 1),
//     a => a + 10,
//     a => a + 100,
//     console.log
// );

// 파이프함수: 함수를 리턴하는 함수. 함수들이 나열되어 있는 합성된 함수 만듦
// const f = pipe(
//     a => a + 1,
//     a => a + 10,
//     a => a + 100
// );

// console.log(f(0));

// go(
//     products,
//     products => filter(p => p.price < 20000, products),
//     products => map(p => p.price, products),
//     prices => reduce(add, prices),
//     console.log
// );

// curry: 함수를 값으로 다루면서 받은 값을 원하는 시점에 평가시키는 것
const mult = curry((a, b) => a * b);
// console.log(mult(1)(2));

const mult3 = mult(3);
// console.log(mult3(10));
// console.log(mult3(100));
// console.log(mult3(1000));

// curry를 통해 go를 다음처럼 더 간단하게 표현 가능
go(
    products,
    products => filter(p => p.price < 20000, products),
    products => map(p => p.price, products),
    prices => reduce(add, prices),
    console.log
);

go(
    products,
    filter(p => p.price < 20000),
    map(p => p.price),
    reduce(add),
    console.log
);


// 함수 조합으로 함수 만들기
// total_price 만들어서 중복 제거해보자!!
