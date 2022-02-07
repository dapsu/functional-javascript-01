// const curry = f =>
//   (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

// const map = curry((f, iter) => {
//     let res = [];
//     iter = iter[Symbol.iterator]();
//     let cur;
//     while (!(cur = iter.next()).done) {
//         const a = cur.value;
//         res.push(f(a));
//     }
//     return res;
// });

// const filter = curry((f, iter) => {
//     let res = [];
//     iter = iter[Symbol.iterator]();
//     let cur;
//     while (!(cur = iter.next()).done) {
//         const a = cur.value;
//         if (f(a)) res.push(a);
//     }
//     return res;
// });

// const reduce = curry((f, acc, iter) => {
//     if (!iter) {
//         iter = acc[Symbol.iterator]();
//         acc = iter.next().value;
//     } else {
//         iter = iter[Symbol.iterator]();
//     }
//     let cur;
//     while (!(cur = iter.next()).done) {
//         const a = cur.value;
//         acc = f(acc, a);
//     }
//     return acc;
// });

// const go = (...args) => reduce((a, f) => f(a), args);

// const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

// // #############################################################

// const range = l => {
//     let res = [];
//     let i = -1;
//     while (++i < l) {
//         // console.log(i, 'range');
//         res.push(i);
//     }
//     return res;
// };
// // console.log(range(5));  // [0, 1, 2, 3, 4]

// const add = (a, b) => a+b;

// // 제너레이터로 range함수 구현
// const L = {};
// L.range = function* (l) {
//     let i = -1;
//     while (++i < l) {
//         // console.log(i, 'L.range');
//         yield i;
//     }
// }

// const list = L.range(4);
// // console.log(list);  // 이터레이터가 리턴됨
// // console.log(list.next());   // { value: 0, done: false }
// // console.log(list.next());
// // console.log(list.next());
// // console.log(list.next());
// // console.log(list.next());   // { value: undefined, done: true }

// // console.log(reduce(add, list));

// /**
//  * range는 반복문에 있는 코드들 순차적으로 실행
//  * L.range는 내부에 있는 코드 바로 실행하지 않음. next 있을 때 하나씩 실행
//  * range는 array를 만들고, 그 배열을 이터레이터로 만들고, 그 후 넥스트를 하면서 순회
//  * L.range는 실행하면서 이터레이터를 만들고, 그 이터레이터가 자신을 리턴하는 이터러블
//  * 해당하는 함수를 실행하면, 이미 만들어진 이터러블을 리턴, 그 후 순회
//  */


// // range, L.range test
// function test(name, time, f) {      // 이름, 얼마나 실행할지, 어떤 함수
//     console.time(name);     
//     while (time--) f();
//     console.timeEnd(name);
// }

// // test('range', 10, ()=>reduce(add, range(1000000)));
// // test('L.range', 10, ()=>reduce(add, L.range(1000000)));

// // L.range: 233.51611328125 ms
// // range: 325.8740234375 ms


// // take

// // 많은 값을 받아서 잘라주는 함수. l까지만 리턴
// const take = curry((l, iter) => { // l(리미트 값)과 iter(이터러블)을 받음
//     let res = [];
//     iter = iter[Symbol.iterator]();
//     let cur;
//     while (!(cur = iter.next()).done) {
//         const a = cur.value;
//         res.push(a);
//         if (res.length == l) return res;
//     }
//     return res;
// });

// // console.log(take(5,range(100)));    // [0,1,2,3,4]  하지만 range는 100까지 순회 다 함
// // console.log(take(5,L.range(100)));  // [0,1,2,3,4]  100까지 순회하지 않음


// // 지연 평가: 가장 필요할 때까지 평가를 미루기 cf. lazy loading 아이디어가 떠오르네
// // 배열처럼 미리 값을 평가하는 것이 아니라, take처럼 앞 부분의 값만 필요할 때만 평가하여 연산을 효율적으로!
// // 이러한 지연성은 es6부터 공식적인 프로토콜로 사용 가능
// // 이터러블 중심 프로그래밍 지연 평가!! 지연성 어떻게 구현? 공식적인 값으로 조합성 만들어 가는지 살펴보자

// // L.map
// // 평가를 미루는 성질을 가지고 
// L.map = function* (f, iter) {
//     for (const a of iter) yield f(a);
// }
// // let it = L.map(a => a+10, [1,2,3]);
// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log([...it]);   // 전개 연산을 통해 출력 가능 
// // console.log([it.next().value]);

// // L.filter
// L.filter = function* (f, iter) {
//     for (const a of iter) if (f(a)) yield a;
// };
// // let it = filter(a => a % 2, [1,2,3,4]);
// // console.log([...it]);   // [1, 3]

// // range, map, filter, take, reduce 중첩 사용
// // console.time('');
// // go(range(100000),
// //     map(n => n + 10),
// //     filter(n => n % 2),
// //     take(10),
// //     console.log);
// // console.timeEnd('');


// // L.range, L.map, L.filter, take 평가 순서
// // go(L.range(Infinity),
// //     L.map(n => n + 10),
// //     L.filter(n => n % 2),
// //     take(10),
// //     console.log);
// // console.timeEnd('L');


// // map, filter 계열 함수들이 가지는 결합 법칙
// /**
//  * 가로로 결합하던 것들을 세로로 결합해도 결과는 같다.
//  */


// // ES6의 기본 규약을 통해 구현하는 지연 평가의 장점
// /**
//  * 함수와 함수과 리턴 값을 통해서 원하는 시점에 지연할 수 있게 됨
//  * JS의 고유한 규악을 통해 안전하게 합성 가능
//  * 서로 다른 라이브러리, 서로 다른 사람이 작성한 코드라도
//  * JS의 기본 값을 토대로 소통되기 때문에 조합성이 높고 안전하게 합성 가능
//  */


// // 결과를 만드는 함수 reduce, take
// /**
//  * map, filter는 지연성을 가질 수 있는 함수인 반면,
//  * reduce, take는 실제로 연산을 시작하는, 
//  * 최종적으로 결과를 만드는 함수
//  * A로부터 B라는 값을 만드려고 할 때, map 등을 거친 후
//  * rduce를 통해 리턴하겠다! 라는 사고로 접근하면 좋을 듯?
//  */


// // queryStr 함수 만들기

// const queryStr = obj => obj;

// // console.log(queryStr({limit:10, offset:10, type:'notice'}));


// // take, find
// const users = [
//     {age: 32},
//     {age: 31},
//     {age: 37},
//     {age: 28},
//     {age: 25},
//     {age: 32},
//     {age: 31},
//     {age: 37}
// ];

// const find = curry((f, iter) => go(
//     iter,
//     L.filter(f),
//     take(1),
//     ([a]) => a));

// // console.log(find(u => u.age < 30)(users));

// // go(users,
// //     L.map(u => u.age),
// //     find(n => n < 30),
// //     console.log);


// // L.map, L.filter로 map과 filter 만들기


// // L.flatten
// /**
//  * [...[1, 2], 3, 4, ...[5, 6], ...[7, 8, 9]] 같은 배열이 있을 때
//  * [1, 2, ..., 9] 처럼 하나로 만들기 위한 함수
//  * 지연적으로 동작
//  */

//  const isIterable = a => a && a[Symbol.iterator];

//  L.flatten = function* (iter) {
//    for (const a of iter) {
//      if (isIterable(a)) for (const b of a) yield b
//      else yield a;
//    }
//  };

// let it = L.flatten([[1, 2], 3, 4, [5, 6], [7, 8, 9]]);

// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log(it.next());
// // console.log([...it]);


// // L.flatMap, flatMap
// /**
//  * map과 flatten 동시에 하는 함수로 최신 js에서 나옴
//  * 나온 이유? js가 기본적으로 지연적으로 동작하지 않기 때문
//  * 시간복잡도 두 개 동시에 해도..
//  */


// // 2차원 배열 다루기
// const arr = [
//     [1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [9, 10]
// ];

// // go(arr,
// //     L.flatten,
// //     L.filter(a => a % 2),
// //     L.map(a => a * a),
// //     take(4),
// //     reduce(add),
// //     console.log);

/***********************************************/


const curry = f =>
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    acc = f(acc, a);
  }
  return acc;
});

const go = (...args) => reduce((a, f) => f(a), args);

const pipe = (f, ...fs) => (...as) => go(f(...as), ...fs);

const take = curry((l, iter) => {
  let res = [];
  iter = iter[Symbol.iterator]();
  let cur;
  while (!(cur = iter.next()).done) {
    const a = cur.value;
    res.push(a);
    if (res.length == l) return res;
  }
  return res;
});

const takeAll = take(Infinity);

const L = {};

L.range = function* (l) {
  let i = -1;
  while (++i < l) yield i;
};

L.map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

L.filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});

L.entries = function* (obj) {
  for (const k in obj) yield [k, obj[k]];
};

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  ([a]) => a));

var add = (a, b) => a + b;

const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};
const isIterable = a => a && a[Symbol.iterator];

L.flatten = function* (iter) {
    for (const a of iter) {
      if (isIterable(a)) yield* a;
      else yield a;
    }
};

const flatten = pipe(L.flatten, takeAll);

L.flatMap = curry(pipe(L.map, L.flatten));
const flatMap = curry(pipe(L.map, flatten));

// 지연성 / 이터러블 실무 코드
/**
 * 실무에서 필터, 맵 등 정말 자주 사용됨
 * 아래 예제로 살펴보겠음
 */

let users = [
    {
      name: 'a', age: 21, family: [
        {name: 'a1', age: 53}, {name: 'a2', age: 47},
        {name: 'a3', age: 16}, {name: 'a4', age: 15}
      ]
    },
    {
      name: 'b', age: 24, family: [
        {name: 'b1', age: 58}, {name: 'b2', age: 51},
        {name: 'b3', age: 19}, {name: 'b4', age: 22}
      ]
    },
    {
      name: 'c', age: 31, family: [
        {name: 'c1', age: 64}, {name: 'c2', age: 62}
      ]
    },
    {
      name: 'd', age: 20, family: [
        {name: 'd1', age: 42}, {name: 'd2', age: 42},
        {name: 'd3', age: 11}, {name: 'd4', age: 7}
      ]
    }
];

go(users,
    L.flatMap(u => u.family),
    L.filter(u => u.age > 20),
    L.map(u => u.age),
    take(4),
    reduce(add),
    console.log);   // 209