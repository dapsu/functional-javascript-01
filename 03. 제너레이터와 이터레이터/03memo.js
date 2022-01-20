/*
제너레이터: 이터레이터를 리턴하는 함수
함수 앞에 *을 붙임
*/
function *gen() {
    yield 1;
    if (false) yield 2;
    yield 3;
    return 100; // 리턴값은 마지막 done이 true가 될 때 리턴
}

let iter = gen();   // 이터레이터이자 이터러블

// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
// console.log(iter.next());
/* expected output
{ value: 1, done: false }
{ value: 2, done: false }
{ value: 3, done: false }
{ value: undefined, done: true } 
 */

// console.log(iter[Symbol.iterator]() == iter);  // true
/**
 * 이터레이터는 심볼.이터레이터를 가지고 있고, 심볼.이터레이터의
 * 실행 결과는 자기 자신
 * 제너레이터는 웰컴투이터레이터를 리턴하는 함수
 * 또한 제너레이터는 yield를 통해 몇 번에 넥스트를 통해 값을 꺼낼지 정할 수 있음
 */

// for (const a of gen()) console.log(a);
/**
 * 제너레이터의 실행 결과는 이터러블이자 이터레이터이기 때문에
 * 순회 가능
 * 단, 순회할 때는 리턴 값 없이 진행됨
 */

/**
 * 자바스크립트에서는 어떠한 값이든 이터러블이면 순회 가능
 * 제너레이터는 문장을 값으로 만들 수 있고,
 * 문장을 통해 순회할 수 있는 값을 만들 수 있기 때문에
 * 자바스크립트에서는 어떠한 값이든 순회할 수 있게 만들 수 있음
 * 굉장히 상징적이고 FP관점에서도 매우 중요한 부분임 --> 다양성 높음
 */

//##########################################

// 홀수만 반환하는 제너레이터
// function *odds() {
//     yield 1;
//     yield 3;
//     yield 5;
// }

// let iter2 = odds();
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());
// 위 방식을 자동화해서!

// 단순히 for문만 이용한 제너레이터
// function *odds(l) {
//     for (let i = 0; i < l; i++) {
//         if (i % 2) yield i;
//     }
// }

// let iter2 = odds(10);
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());

function *infinity(i = 0) {     // 무한 수열
    while (true) yield i++;
}
// let iter3 = infinity();
// console.log(iter3.next());
// console.log(iter3.next());
// console.log(iter3.next());
// console.log(iter3.next());

function *limit(l, iter) {      // 리미트 함수
    for (const a of iter) {
        yield a;
        if (a == l) return;
    }
}

function *odds(l) {
    for (const a of limit(l, infinity(1))) {
        if (a % 2) yield a;
    }
}

// for (const a of odds(40)) console.log(a);

// ##########################

// for of, 전개 연산자, 구조 분해, 나머지 연산자
// 전개연산자
console.log(...odds(10));
console.log([...odds(10)], [...odds(20)]);

// 구조분해
const [head, ...tail] = odds(5);
console.log(head);
console.log(tail);

const [a, b, ...rest] = odds(10);
console.log(a);
console.log(b);
console.log(rest);