const log = console.log;

const curry = f =>
  (a, ..._) => _.length ? f(a, ..._) : (..._) => f(a, ..._);

const isIterable = a => a && a[Symbol.iterator];

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);

const reduce = curry((f, acc, iter) => {
  if (!iter) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  } else {
    iter = iter[Symbol.iterator]();
  }
  return go1(acc, function recur(acc) {
    let cur;
    while (!(cur = iter.next()).done) {
      const a = cur.value;
      acc = f(acc, a);
      if (acc instanceof Promise) return acc.then(recur);
    }
    return acc;
  });
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

L.flatten = function* (iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* a;
    else yield a;
  }
};

L.deepFlat = function* f(iter) {
  for (const a of iter) {
    if (isIterable(a)) yield* f(a);
    else yield a;
  }
};

L.flatMap = curry(pipe(L.map, L.flatten));

const map = curry(pipe(L.map, takeAll));

const filter = curry(pipe(L.filter, takeAll));

const find = curry((f, iter) => go(
  iter,
  L.filter(f),
  take(1),
  ([a]) => a));

const flatten = pipe(L.flatten, takeAll);

const flatMap = curry(pipe(L.map, flatten));

var add = (a, b) => a + b;

const range = l => {
  let i = -1;
  let res = [];
  while (++i < l) {
    res.push(i);
  }
  return res;
};

/***********************************************/

// callback과 promise

// function add10(a, callback) {
//     setTimeout(() => callback(a + 10), 100);
// }

// add10(5, res => {
//     console.log(res);
// });     // 100 m/s 이후 15 반환

// 위의 식을 promise로!!
// function add20(a) {
//     return new Promise(resolve => setTimeout(() => resolve(a + 20), 100));
// }
/**
 * add10과의 큰 차이점은 return이 있다는 것. 이는 매우 중요한 점!
 */

// 콜백보다 더 가시적으로 표현할 수 있음
// add20(5)
//     .then(add20)
//     .then(add20)
//     .then(console.log);

// 위의 방법을 콜백 방식으로 한다면? 아래처럼 조금 더 복잡함
// add10(5, res => {
//     add10(res, res => {
//       add10(res, res => {
//         console.log(res);
//       });
//     });
//   });


// 비동기를 값으로 만드는 Promise
/**
 * 프로미스는 then()을 통해 콜백 지옥을 벗어날 수 있다는 점에서
 * 콜백과 다른 점이라고 많이 설명 됨.
 * 하지만 프로미스가 콜백과 진짜 다른 점은 비동기 상황을 일급 값으로
 * 다룬다는 점!
 * 프로미스라는 클래스를 통해서 만들어진 인스턴스를 반환,
 * 그 값은 대기와 성공, 실패를 다루는 일급 값으로 되어 있음
 * 대기되어 있는 값을 가진다는 점에서 콜백과 가장 다른 점(이 점이 가장 중요!)
 * 이 차이를 생각하면서 코드를 작성하는 것이 매우 중요
 */

// 위의 add10, add20을 통해 예시를 만들어 보겠음
// let a = add10(5, res => {
//     add10(res, res => {
//         add10(res, res => {
//             console.log(res);
//         });
//     });
//   });

// let b = add20(5)
//     .then(add20)
//     .then(add20)
//     .then(console.log);

// 반환되는 값이 다름!
// console.log(a);   // undefined
// console.log(b);   // Promise { <pending> }
/**
 * add10은 실행되고 나면 끝. 그 이후 어떤 것을 할 수 없음
 * add20은 then을 통해 실행 이후에 하고 싶은 일을 추가적으로 할 수 있음
 */
// console.log(add10(5, _ => _));  // undefined
// let c = add20(5, _ => _);
// console.log(c);  // Promise {<fulfilled>: 25}
/**
 * 즉 비동기가 일어난 것들을 값으로 다룰 수 있고, 이는 일급이라는 말
 * 일급이라는 말은 어떤 변수에 담길 수도 있고, 어떤 함수에 전달할 수도 있음
 * 전달한 값을 계속 이어갈 수 있음
 */


// 값으로서의 Promise 활용

// 일급 활용
const tmpGo = (a, f) => f(a);
const add5 = a => a+5;
// console.log(tmpGo(10, add5));   // 15
// console.log(tmpGo(Promise.resolve(10), add5));   // [object Promise]5
// 정상적으로 작동되지 않음

const delay100 = a => new Promise(resolve =>
    setTimeout(() => resolve(a), 100));
// console.log(tmpGo(delay100(10), add5)); // [object Promise]5
// 역시 정상적으로 작동 X

// 위의 것들을 일급이를 성질을 이용하여 정상적으로 작동하도록 해보자
// const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a);
// let nn = go1(delay100(10), add5);
// console.log(nn);   // Promise { <pending> }
// nn.then(console.log);   // 15
// go1(go1(nn, add5), console.log);    // 왜 20 나옴?


// 합성 관점에서의 promise와 모나드
/**
 * 합성 함수?
 * f(g(x))
 * 안전하게 합성하기 위해 모나드라는 개념 있음
 * 비동기 상황을 안전하게 합성하는 것이 프로미스
 * 자바스크립트는 동적 타입 언어. 타입을 중점적으로 사고하면서 프로그래밍하는 언어 아님
 * 모나드 등이 잘 묻어나지 않는 경향이 있음
 * 그래서 자바스크립트에서 모나드를 굳이 알 필요는 없지만,
 * 모나드에 대해서 알고 있다면 안전한 함수 합성을 만드는 데 응용력 등을 더 좋게 할 수 있음
 * js에서 직접적으로 모나드 설명하지 않지만, 배열 등을 통해 살펴볼 수 있음
 * 그래서 모나드? 함수 합성을 안전하게 하기 위한 도구
 * 박스라고 생각하면 됨. [1]
 */
 const g = a => a + 1;
 const f = a => a * a;

// console.log(f(g(1)));   // 4

// console.log(f(g()));    // NaN
// g()에게 제대로 된 값을 주지 않음. 안전한 인자를 줘야 함

// array는 필요한 값이 아님. 즉 개발할 때 필요한 도구이지, 사용자 화면에 출력될 실제 결론은 아님
// console.log([1].map(g).map(f));     // [4]
// [1].map(g).map(f).forEach(r => console.log(r));     // 4
// [].map(g).map(f).forEach(r => console.log(r));     // 진행 안 됨
// Array.of(1).map(g).map(f).forEach(r => console.log(r));     // 4

/**
 * 이렇게 했을 때 이점은?
 * 안전하게 합성 가능! [].map ... 이렇게 하면 실행 자체가 안 됨(안정적)
 */

// 프로미스로는 어떻게 구현?
// Promise.resolve(2).then(g).then(f).then(r => log(r));   // 9
// Promise.resolve().then(g).then(f).then(r => log(r));   // NaN
// new Promise(resolve =>
//     setTimeout(() => resolve(2), 100)
//   ).then(g).then(f).then(r => log(r));
// 모나드라는 개념에 집중할 필요는 X!!!


// Kleisli Composition 관점에서의 Promise

/**
 * 함수 합성이 원하는대로 되지 않을 가능성 있음
 * 
 */


// go, pipe, reduce에서 비동기 제어

/**
 * reduce, 리턴값을 재귀 유명함수로
 */

 go(Promise.resolve(1),
    a => a + 10,
    a => Promise.reject('error~~'),
    a => console.log('----'),
    a => a + 1000,
    a => a + 10000,
    log).catch(a => console.log(a));


// promise.then의 중요한 규칙

//프로미스 체인이 연속적으로 걸려있어도 then을 이용해서 내가 원할 때 한 번에 가능!
Promise.resolve(Promise.resolve(1)).then(function (a) {
    log(a);
});

