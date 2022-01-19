const log = console.log;

// Array
const arr = [1, 2, 3];
// for (const a of arr) log(a);
/*
배열은 키와 값이 결과로 나옴
키는 인덱스!
*/

// Set
const set = new Set([1, 2, 3]);
// for (const a of set) log(a);
/*
셋은 배열과 달리 키값이 없음. 즉 인덱스 활용 X (set[0]: undefined)
즉 배열과는 다른 for문으로 추상화되어 있음
*/

// Symbol
// 심볼은 어떤 객체의 키가 될 수 있음
// log(Symbol.iterator);
let iter1 = arr[Symbol.iterator]();
// for (const a of iter1) log(a);

let iter2 = set[Symbol.iterator]();
// for (const a of iter2) log(a);

/* 
## 이터러블/이터레이터 프로토콜
- 이터러블: 이터레이터를 리턴하는 [Symbol.iterator]() 를 가진 값
- 이터레이터: { value, done } 객체를 리턴하는 next() 를 가진 값
- 이터러블/이터레이터 프로토콜: 이터러블을 for...of, 전개 연산자 등과 함께 동작하도록한 규약
*/
log(iter2.next());
log(iter2.next());
log(iter2.next());
log(iter2.next());  // undefined, done: true --> for문 빠져나감
log('Arr=======');
log(iter1.next());
log(iter1.next());
log(iter1.next());
log(iter1.next());


// Map
// const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
// for (const a of map.keys()) log(a);     // key값만 반환
// for (const a of map.values()) log(a);   // value값만 반환
// for (const a of map.entries()) log(a);  // 키, 밸류 반환
// for (const a of map) log(a);  // 키, 밸류 반환
// console.clear();

// let iter3 = map.values();
// log(iter3[Symbol.iterator]);
// log(iter3.next());
// log(iter3.next());
// log(iter3.next());
// log(iter3.next());