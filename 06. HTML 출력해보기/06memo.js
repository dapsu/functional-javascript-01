const curry = f =>
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

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

const go = (...args) => reduce((a, f) => f(a), args);

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const products = [
    {name: '반팔티', price: 15000, quantity: 1, is_selected: true},
    {name: '긴팔티', price: 20000, quantity: 2, is_selected: false},
    {name: '핸드폰케이스', price: 15000, quantity: 3, is_selected: true},
    {name: '후드티', price: 30000, quantity: 4, is_selected: false},
    {name: '바지', price: 25000, quantity: 5, is_selected: false}
];

const add = (a, b) => a + b;

// 총 수량
const total_quantity = go(products,
    map(p => p.quantity),
    reduce(add));

console.log(total_quantity);    // 15

const total_quantity_pipe = pipe(
    map(p => p.quantity),
    reduce(add));

console.log(total_quantity_pipe(products));    // 15

// 총 가격
const total_price = pipe(
    map(p => p.price * p.quantity),
    reduce(add)
);

console.log(total_price(products));     // 345000


// 추상화 레벨 높이기
const sum = (f, iter) => go(
    iter,
    map(f),
    reduce(add)
);
console.log(sum(p=>p.quantity, products));
console.log(sum(p => p.price * p.quantity, products));

// 더 간결하게! 커링!