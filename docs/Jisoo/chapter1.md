# 01장. 리액트 개발을 위해 꼭 알아야 할 자바스크립트

## 1.1 자바스크립트의 동등 비교

### 1.1.1 자바스크립트의 데이터 타입

원시 타입

- boolean, null, undefined, number, string, symbol, bigint

객체 타입

- object

<br>

**원시 타입**

- undefined: 선언 후 값을 할당하지 않은 변수 또는 값이 주어지지 않은 인수에 자동 할당되는 값

```javascript
let ab
typeof ab === 'undefined' // true
```

- null: typeof로 확인했을 때 'object'로 반환, 명시적으로 비어 있음을 나타내는 값
- Boolean: 참과 거짓만을 가질 수 있는 데이터 타입

```javascript
if(1){
  // true
}
if(0){
  // false
}
if(NaN){
  // false
}
// 조건문 외에도 Boolean()으로 확인 가능
Boolean(1) // true
```

- Number: 모든 숫자 타입
- Bigint: number의 한계를 넘어 더 큰 숫자 저장
- String: 텍스트 타입의 데이터 저장, 변경 불가능

```javascript
const fruit = 'apple'
console.log(fruit[0]) // 'a'

fruit[0] = 'b'
console.log(fruit) // apple
```

- Symbol: 중복되지 않는 어떠한 고유값

```javascript
const aa = Symbol('aa')
const aa2 = Symbol('aa')

aa === aa2 // false

// 동일한 값 사용하려면 Symbol.for 활용
Symbol.for('aa') === Symbol.for('aa') // true
```

**객체 타입**

배열, 함수, 정규식, 클래스 등 자바스크립트를 이루는 대부분의 타입이 객체 타입

### 1.1.2 값을 저장하는 방식의 차이

원시 타입과 객체 타입의 가장 큰 차이점은 값을 저장하는 방식의 차이 → 이 차이가 동등 비교시 차이를 만드는 원인

```javascript
// 값을 전달하는 방식
let aa = 'hihi'
let bb = aa

console.log(aa === bb) // true
```
```
// 각각 선언하는 방식
let aa = 'hihi'
let bb = 'hihi'

console.log(aa === bb) // true
```
객체는 프로퍼티 삭제, 추가, 수정이 가능하므로 원시 값과 다르게 변경 가능한 형태로 저장되고, 값을 복사할 때도 참조를 전달하게 된다.

```javascript
var aa = {
  greet: 'hi',
}

var bb = {
  greet: 'hi',
}

// 동등 비교하면 false
console.log(aa === bb) // false
// 원시값 내부 속성값 비교하면 동일
console.log(aa.greet === bb.greet) // true
```

### 1.1.3 자바스크립트의 또 다른 비교 공식, Object.is
Object.is는 두 인수가 동일한지 확인하고 반환하는 메서드이다.

== vs Object.is:
== 비교는 같음을 비교하기 전에 양쪽 타입이 다르면 강제 형변환 후 비교해서 값이 동일하면 true.
하지만 Object.is는 이런 타입 변환 없이 엄격 비교를 수행한다.

=== vs Object.is:
===는 타입과 값이 모두 같아야 true를 반환한다.

### 1.1.4 리액트에서의 동등 비교
리액트에서 사용하는 동등 비교는 Object.is를 기반으로 한다.
Object.is로 먼저 비교를 수행한 후, Object.is로 수행하지 못하는 비교(객체 간 얕은 비교)를 추가로 수행한다.

```javascript
// Object.is는 참조가 다른 객체에 대해 비교 불가능
Object.is({ hello: 'world' }, { hello: 'world' }) // false

// shallowEqual은 객체의 1 depth까지는 비교 가능
shallowEqual({ hello: 'world' }, { hello: 'world' }) // true

// 2 depth 이상에서는 비교 방법이 없어 false 반환
shallowEqual({ hello: { hi: 'world' } }, { hello: { hi: 'world' } }) // false
```
리액트는 props에서 꺼내온 값을 기준으로 렌더링을 수행하기 때문에, 일반적인 케이스에서는 얕은 비교로 충분하다.

## 1.2 함수

### 1.2.1 함수란 무엇인가?

자바스크립트에서 함수는 작업을 수행하거나 값을 계산하는 등의 과정을 표현하고 이를 하나의 블록으로 감싸 실행 단위로 만들어 놓은 것이다.

```javascript
function sum(a, b) {
  return a + b;
}

sum(1, 2); // 3
```

```javascript
function Component(props) {
  return <div>{props.hello}</div>;
}
```

### 1.2.2 함수를 정의하는 4가지 방법

**함수 선언문**

```javascript
function add(a, b) {
  return a + b;
}
```

함수 선언문은 표현식이 아닌 일반 문으로 분류된다.  
위 코드에서 함수 선언으로는 어떤 값도 표현되지 않았으므로 표현식이 아닌 문으로 분류된다.

```javascript
const sum = function sum(a, b) {
  return a + b;
};

sum(1, 2); // 3
```

위 예제에서는 `sum` 변수에 `function sum`을 할당하는, 표현식과 같은 작동을 보인다.

**함수 표현식**

자바스크립트에서 함수는 '일급 객체'이다.  
'일급 객체'는 다른 객체들에 일반적으로 적용 가능한 연산을 모두 지원하는 객체를 의미한다.

```javascript
const sum = function (a, b) {
  return a + b;
};

sum(1, 2); // 3
```

함수 표현식에서는 보통 함수 이름을 생략하는 것이 일반적이다.

**함수 표현식과 선언문의 차이**

두 방식의 가장 큰 차이는 **호이스팅 여부**다.  
호이스팅은 함수 선언문이 마치 코드 맨 앞단에 작성된 것처럼 작동하는 특징을 의미한다.

```javascript
hi(); // hi

function hi() {
  console.log('hi');
}

hi(); // hi
```

함수 선언문은 코드 순서와 관계없이 미리 메모리에 등록되기 때문에 위처럼 호출할 수 있다.

```javascript
console.log(typeof hi === 'undefined'); // true

hi(); // Uncaught TypeError: hi is not a function

var hi = function () {
  console.log('hi');
};

hi();
```

함수 표현식은 런타임 시점에 함수가 할당되므로 할당 이전에 호출할 수 없다.

**Function 생성자**

```javascript
const add = new Function('a', 'b', 'return a + b');
add(1, 2); // 3
```

생성자 함수를 통해 함수를 만드는 방식은 권장하지 않는다.

**화살표 함수**

```javascript
const add = (a, b) => {
  return a + b;
};

const add = (a, b) => a + b;
```

화살표 함수는 `constructor`를 사용할 수 없고, `arguments` 객체도 존재하지 않는다.  
또한 `this` 바인딩을 하지 않고, 자신을 감싼 외부 컨텍스트의 `this`를 그대로 사용한다.

### 1.2.3 다양한 함수 살펴보기

**즉시 실행 함수**

함수를 정의하고 즉시 실행되는 함수로 단 한 번만 호출되고 다시 호출할 수 없다.

```javascript
(function (a, b) {
  return a + b;
})(1, 2); // 3

((a, b) => a + b)(1, 2); // 3
```

**고차 함수**

함수를 인수로 받거나, 결과를 함수로 반환하는 함수를 고차 함수라고 한다.

```javascript
// 함수를 매개변수로 받는 고차 함수
const doubleArray = [1, 2, 3].map((item) => item * 2);

doubleArray; // [2, 4, 6]

// 함수를 반환하는 고차 함수
const add = function (a) {
  return function (b) {
    return a + b;
  };
};

add(1)(2); // 3
```

### 1.2.4 함수를 만들 때 주의해야 하는 사항

**함수의 부수 효과 억제**

함수의 부수 효과란 함수 내의 작동으로 함수 외부에 영향을 끼치는 것을 의미한다.  
이런 부수 효과가 없는 함수를 '순수 함수'라고 하며, 항상 동일한 입력에는 동일한 결과를 반환해야 한다.

```javascript
function PureComponent(props) {
  const { a, b } = props;
  return <div>{a + b}</div>;
}
```

**가능한 한 함수를 작게 만들기**

함수는 가능한 한 작은 단위로 쪼개서 작성하는 것이 유지보수와 재사용성 측면에서 좋다.

**누구나 이해할 수 있는 이름 붙이기**

함수명은 간결하고 명확하게, 함수의 목적을 알 수 있도록 지어야 한다.

## 1.3 클래스

### 1.3.1 클래스란 무엇인가?

클래스는 특정 객체를 만들기 위한 일종의 템플릿이다.

**constructor**

constructor는 생성자로, 객체를 생성하는 데 사용하는 특수한 메서드이다. 클래스 안에 단 하나만 존재할 수 있으며, 생략할 수도 있다.

```javascript
// ❌
class Car {
  constructor(name) {
    this.name = name;
  }

  constructor(name) {
    this.name = name;
  }
}

// ⭕
class Car {
  constructor(name) {
    this.name = name;
  }
}
```

**프로퍼티**

프로퍼티는 클래스로 인스턴스를 생성할 때 내부에 정의할 수 있는 속성값이다.

```javascript
class Car {
  constructor(name) {
    this.name = name;
  }
}

const myCar = new Car('자동차');
```

**getter와 setter**

getter는 특정 값을 가져오는 메서드이다. `get` 키워드를 붙여 사용한다.  
setter는 값을 설정할 때 사용하며 `set` 키워드를 붙인다.

```javascript
class Car {
  constructor(name) {
    this.name = name;
  }

  get firstCharacter() {
    return this.name[0];
  }

  set firstCharacter(char) {
    this.name = [char, ...this.name.slice(1)].join('');
  }
}

const myCar = new Car('자동차');

console.log(myCar.firstCharacter); // 자

myCar.firstCharacter = '차';
console.log(myCar.name); // 차동차
```

**인스턴스 메서드**

클래스 내부에 선언한 메서드는 인스턴스 메서드로서, 생성된 인스턴스에 의해 사용된다.  
메서드는 프로토타입 체이닝을 통해 실행된다.

**정적 메서드 (static method)**

정적 메서드는 클래스 이름으로 호출하는 메서드이다. 인스턴스를 만들지 않아도 사용할 수 있다.

```javascript
class Car {
  static hello() {
    console.log('hello');
  }
}

Car.hello(); // hello
```

정적 메서드 내부에서 `this`는 클래스 자체를 가리킨다.

**상속**

`extends` 키워드를 사용해 기존 클래스를 상속받아 자식 클래스가 부모 클래스를 확장할 수 있다.

---

### 1.3.2 클래스와 함수의 관계

클래스는 사실상 자바스크립트의 **프로토타입**을 기반으로 동작한다.  
클래스 문법은 프로토타입을 쉽게 사용하기 위한 문법적 설탕이다.

## 1.4 클로저

### 1.4.1 클로저의 정의

클로저는 "**함수와 함수가 선언된 어휘적 환경의 조합**"이다.  
어휘적 환경이란, 변수가 코드 내부 어디서 선언되었는지를 말한다.  
클로저는 이런 어휘적 환경을 기억하는 함수를 뜻한다.

### 1.4.2 변수의 유효 범위, 스코프

**전역 스코프**

전역 레벨에 선언한 변수는 어디서든 접근할 수 있다.

```javascript
var globalVar = 'global';

console.log(globalVar); // global
```

**함수 스코프**

자바스크립트는 기본적으로 함수 레벨 스코프를 따른다.  
`{}` 블록은 스코프를 만들지 않고 함수가 스코프를 생성한다.

```javascript
if(true) {
  var global = 'global scope'
}

console.log(global) // 'global scope'
console.log(global === window.global) // true
```
var global은 {} 내부에 선언되어 있는데 밖에서도 접근이 가능한 것을 확인할 수 있다. 

```javascript
function hi() {
  var local = 'local variable'
  console.log(local) // local variable
}

hi()
console.log(local) // Uncaught ReferenceError: local is not defined
```

### 1.4.3 클로저의 활용

함수 레벨 스코프를 활용하여 외부로부터 변수를 보호할 수 있다.

**전역 스코프의 문제점**

```javascript
var counter = 0;

function handleClick() {
  counter++;
}
```

counter 변수가 전역에 노출되어 있어 누구든 수정할 수 있다.

**클로저를 사용한 캡슐화**

```javascript
function Counter() {
  var counter = 0;

  return {
    increase: function () {
      return ++counter;
    },
    decrease: function () {
      return --counter;
    },
    getCounter: function () {
      return counter;
    },
  };
}

const c = Counter();

console.log(c.increase()); // 1
console.log(c.increase()); // 2
console.log(c.decrease()); // 1
console.log(c.getCounter()); // 1
```

counter 변수는 외부에 직접 노출되지 않으며 오직 반환된 메서드를 통해서만 접근할 수 있다.

**리액트에서의 클로저 활용 예: useState**

```javascript
function Component() {
  const [state, setState] = useState(0);

  function handleClick() {
    setState((prev) => prev + 1);
  }
}
```

`useState`는 호출된 시점의 state를 기억하는 클로저를 활용하여 최신 값을 관리한다.

### 1.4.4 주의할 점

클로저는 메모리에 선언 당시의 환경을 계속 유지한다.  
불필요한 클로저 사용은 메모리 누수를 초래할 수 있으므로 꼭 필요한 경우에만 사용해야 한다.

## 1.5 이벤트 루프와 비동기 통신의 이해

### 1.5.1 싱글 스레드 자바스크립트

**프로세스와 스레드**

- 프로세스: 메모리상에서 실행되는 작업 단위
- 스레드: 프로세스 내에서 작업을 수행하는 실행 단위

자바스크립트는 **싱글 스레드** 언어로, 한 번에 하나의 작업만 처리할 수 있다.

**동기와 비동기**

- 동기: 코드가 순차적으로 실행된다.
- 비동기: 다음 작업을 기다리지 않고 동시에 여러 작업을 처리할 수 있다.

### 1.5.2 이벤트 루프란?

**호출 스택과 이벤트 루프**

- 호출 스택은 자바스크립트에서 수행해야 할 코드나 함수를 순차적으로 담아두는 스택이다.
- 이벤트 루프는 호출 스택이 비어 있는지 대기 중인 작업이 있는지를 확인한다.

**동작 순서**

1. 호출 스택이 비어 있으면
2. 태스크 큐에 대기 중인 작업이 호출 스택으로 이동하여 실행된다.

```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout Callback');
}, 0);

console.log('End');
```

출력 순서:
```
Start
End
Timeout Callback
```

`setTimeout` 콜백은 비동기적으로 대기하며, 메인 스레드 작업이 끝난 후 실행된다.

### 1.5.3 태스크 큐와 마이크로 태스크 큐

**태스크 큐(Task Queue)**

- setTimeout, setInterval과 같은 비동기 작업의 콜백이 저장된다.

**마이크로 태스크 큐(Microtask Queue)**

- Promise, MutationObserver와 같은 미세 비동기 작업이 저장된다.
- **우선순위가 더 높다.**

```javascript
console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise1');
}).then(() => {
  console.log('promise2');
});

console.log('script end');
```

출력 순서:
```
script start
script end
promise1
promise2
setTimeout
```

Promise는 마이크로 태스크 큐에 등록되어 먼저 실행된다.

---

## 1.6 리액트에서 자주 사용하는 자바스크립트 문법

### 1.6.1 구조 분해 할당 (Destructuring Assignment)

배열이나 객체의 값을 분해해서 개별 변수에 할당하는 문법이다.

**배열 구조 분해 할당**

```javascript
const array = [1, 2, 3, 4, 5];

const [first, second, third, ...arrayRest] = array;
// first: 1
// second: 2
// third: 3
// arrayRest: [4, 5]
```

필요 없는 인덱스를 건너뛸 수도 있다.

```javascript
const [first, , , , fifth] = array;
// first: 1
// fifth: 5
```

기본값을 지정할 수도 있다.

```javascript
const array = [1, 2];
const [a = 10, b = 10, c = 10] = array;
// a: 1
// b: 2
// c: 10
```

**객체 구조 분해 할당**

```javascript
const object = { a: 1, b: 2, c: 3, d: 4, e: 5 };

const { a, b, c, ...objectRest } = object;
// a: 1
// b: 2
// c: 3
// objectRest: { d: 4, e: 5 }
```

컴포넌트 props를 받을 때도 구조 분해 할당을 자주 사용한다.

```javascript
function SampleComponent({ a, b }) {
  return a + b;
}

SampleComponent({ a: 2, b: 5 }); // 7
```

### 1.6.2 전개 구문 (Spread Syntax)

배열, 객체, 문자열 등 순회 가능한 값을 전개(spread)하는 문법이다.

**배열의 전개 구문**

```javascript
const arr1 = ['a', 'b'];
const arr2 = [...arr1, 'c', 'd', 'e'];
// ['a', 'b', 'c', 'd', 'e']
```

**객체의 전개 구문**

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

const newObj = { ...obj1, ...obj2 };
// { a: 1, b: 2, c: 3, d: 4 }
```

객체 전개 시 **순서**에 주의해야 한다. 뒤에 오는 값이 앞의 값을 덮어쓴다.

### 1.6.3 객체 초기자 (Object Initializer)

키와 값이 동일한 이름을 가질 경우 축약할 수 있다.

```javascript
const a = 1;
const b = 2;

const obj = { a, b };
// { a: 1, b: 2 }
```

### 1.6.4 Array 프로토타입 메서드

**Array.prototype.map**  
각 요소를 변환하여 새로운 배열을 반환한다.

```javascript
const arr = [1, 2, 3, 4, 5];
const doubledArr = arr.map((item) => item * 2);
// [2, 4, 6, 8, 10]
```

**Array.prototype.filter**  
조건을 만족하는 요소만 골라 새로운 배열을 반환한다.

```javascript
const evenArr = arr.filter((item) => item % 2 === 0);
// [2, 4]
```

**Array.prototype.reduce**  
모든 요소를 누적해 하나의 결과를 반환한다.

```javascript
const sum = arr.reduce((result, item) => result + item, 0);
// 15
```

**Array.prototype.forEach**  
각 요소에 대해 함수를 실행하지만, 반환값은 없다.

```javascript
arr.forEach((item) => console.log(item));
// 1, 2, 3, 4, 5
```

### 1.6.5 삼항 조건 연산자 (Ternary Operator)

조건에 따라 값을 선택하는 짧은 조건문이다.

```javascript
const value = 10;
const result = value % 2 === 0 ? '짝수' : '홀수';
// result: '짝수'
```

```javascript
// 문법
조건문 ? 참일_때_값 : 거짓일_때_값
```

---

## 1.7 선택이 아닌 필수, 타입스크립트

### 1.7.1 타입스크립트란?

타입스크립트는 자바스크립트에 타입을 추가한 언어다.

- 자바스크립트는 런타임 시점에 오류를 발견하지만
- 타입스크립트는 **컴파일(빌드) 타임에 오류를 발견**할 수 있다.

```typescript
function test(a: number, b: number): number {
  return a / b;
}
```

타입스크립트는 자바스크립트의 슈퍼셋으로서 함수의 반환 타입, 배열, enum 등 기존에 사용하기 어려웠던 타입 관련 작업들을 손쉽게 처리 가능하다.

### 1.7.2 리액트 코드를 효과적으로 작성하기 위한 타입스크립트 활용법

**any 대신 unknown 사용하기**

- `any`: 아무 타입이나 허용하지만 타입 안전성을 잃는다.
- `unknown`: 타입을 알 수 없는 경우 사용. 타입 체크 없이 사용할 수 없다.

```typescript
function doSomething(callback: unknown) {
  if (typeof callback === 'function') {
    callback();
    return;
  }
  throw new Error('callback은 함수여야 한다.');
}
```

**타입 가드 적극 활용**

타입을 좁히는 데 사용하는 기법이다.

- `instanceof`

```typescript
if (obj instanceof Array) {
  // 배열임을 알 수 있다
}
```

- `typeof`

```typescript
if (typeof value === 'string') {
  // 문자열임을 알 수 있다
}
```

- `in`

```typescript
if ('property' in obj) {
  // obj에 'property' 키가 존재함
}
```

**제네릭(Generic)**

함수나 클래스 내부에서 단일 타입이 아닌 다양한 타입에 대응할 수 있게 도와주는 도구이다.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const output = identity<string>('Hello');
```

리액트에서는 `useState` 같은 훅에서 많이 사용한다.

```typescript
const [state, setState] = useState<string>('');
```

**인덱스 시그니처(Index Signature)**

객체의 키 타입을 명시할 수 있다.

```typescript
type Hello = {
  [key: string]: string;
}

const hello: Hello = {
  hi: 'hi',
  hello: 'hello',
};

console.log(hello['hi']); // hi
```

### 1.7.3 타입스크립트 전환 가이드

**1. tsconfig.json 작성**

- 프로젝트 최상단에 `tsconfig.json` 파일을 작성한다.
- 컴파일러 옵션과 타입 체크 규칙을 정의한다.

**2. JSDoc과 @ts-check 활용 (점진적 전환)**

- 기존 자바스크립트 파일 상단에 `//@ts-check`를 추가하고,
- JSDoc으로 타입을 명시하여 점진적으로 타입스크립트로 전환한다.

**3. @types 모듈 설치**

- 타입스크립트 프로젝트에서 라이브러리를 사용할 때 타입 정의가 필요하다.
- 예: `npm install @types/react`

**4. 파일 단위로 점진적 전환**

- `.js` → `.ts` 또는 `.jsx` → `.tsx`로 점진적으로 변환한다.

---

