# Chapter 1 리액트 개발을 위해 꼭 알아야 할 자바스크립트

## 1.4 클로저

### 1.4.1 클로저의 정의

리액트의 클래스 컴포넌트에 대한 이해가 자바스크립트의 **클래스**, **프로토타입**, **this**에 달려 있다면,  
🆚 함수 컴포넌트에 대한 이해는 **클로저**에 달려 있다.

함수 컴포넌트의 구조와 작동 방식, 훅(Hook)의 원리, 의존성 배열 등 함수 컴포넌트의 대부분 기술은 모두 클로저에 기반하고 있다.

➡️ 함수 컴포넌트를 잘 작성하기 위해서는 클로저에 대한 이해가 필수적임!

<br>

### 클로저에 대한 MDN 정의

> "클로저는 함수와 함수가 선언된 어휘적 환경(Lexical Scope)의 조합이다."  
> 출처: [MDN Web Docs - Closures](https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures)

리액트 16.8 버전 이후 함수 컴포넌트와 훅(Hook)이 등장하면서,  
클로저를 이해하지 않고는 리액트를 제대로 이해할 수 없게 되었다.

<br>

### 어휘적 환경 (Lexical Environment)

"함수와 함수가 선언된 어휘적 환경의 조합" 중, 가장 이해가 어려운 부분인 **'어휘적 환경'**

```javascript
function add() {
  const a = 12;
  
  function innerAdd() {
    const b = 27;
    console.log(a + b);
  }
  
  innerAdd(); // 39
}

add();
```

- `add` 함수 내부에 `innerAdd` 함수
- `innerAdd` 함수는 자신의 내부에 있는 `b`와 외부에 있는 `a`를 더해 `39`을 출력함
- `a` 변수의 유효 범위는 `add` 함수 전체이고, `b` 변수의 유효 범위는 `innerAdd` 함수 전체
- `innerAdd`는 `add` 함수 내부에서 선언되었기 때문에 외부의 `a`를 참조할 수 있음

<br>

**정리하면:**

- **어휘적 환경(Lexical Environment)** 이란, 변수가 코드 내부에서 어디에 선언되었는지를 기준으로 범위(Scope)가 결정되는 것을 의미한다.
- 이는 `this`처럼 호출 방식에 따라 동적으로 결정되는 것이 아니라, **코드 작성 시 정적으로 결정된다**.
- **클로저란 이러한 어휘적 환경을 조합해 코딩하는 기법**이다.

---

## 1.4.2 변수의 유효범위, 스코프

변수의 유효 범위를 **스코프(scope)** 라고 하며, 자바스크립트에는 다양한 스코프가 존재한다.

<br>

### 전역 스코프 (Global Scope)

: 전역 레벨에서 변수를 선언하는 것 

전역(Global)이라는 이름처럼, 이 스코프에서 변수를 선언하면 **어디서든 접근 가능**하다.

- 브라우저 환경: 전역 객체는 `window`
- Node.js 환경: 전역 객체는 `global`

즉, 전역 스코프에 선언된 변수는 해당 환경의 전역 객체에 바인딩된다.

```javascript
var global = 'sopt 36th';

function hello() {
  console.log(global);
}

console.log(global); // sopt 36th
hello();             // sopt 36th
console.log(global === window.global); // true (브라우저 환경 기준)
```

`var`로 선언된 `global` 변수가 전역 스코프와 `hello` 함수 내부 모두에서 접근 가능함을 알 수 있다.

<br>

### 함수 레벨 스코프 (Function Scope)

: `{}` 중괄호 블록이 아니라 **함수**가 스코프 범위 결정

다른 언어와 달리, **자바스크립트는 기본적으로 함수 레벨 스코프**를 따른다.  

```javascript
if (true) {
  var global = 'sopt 36th';
}

console.log(global); // sopt 36th
console.log(global === window.global); // true
```

- `var global`은 `{}` 블록 안에서 선언됐지만, 바깥에서도 접근이 가능하다.
<br>

### 함수 내부에서는?

```javascript
function hello() {
  var local = 'sopt web';
  console.log(local); // sopt web
}

hello();

console.log(local); // Uncaught ReferenceError: local is not defined
```

- 함수 내부에서 선언한 `local`은 함수 안에서는 접근 가능하지만,
- 함수 외부에서는 접근할 수 없다.

단순한 `if` 블록과는 다르게, **함수 블록** 안에서는 우리가 예상하는 대로 스코프가 구분된다.

<br>

### 스코프의 중첩

만약 스코프가 중첩되어 있다면?

```javascript
var x = 10;

function foo() {
  var x = 100;
  console.log(x); // 100

  function bar() {
    var x = 1000;
    console.log(x); // 1000
  }

  bar();
}

console.log(x); // 10
foo();
```

자바스크립트에서는 변수를 참조할 때 **가장 가까운 스코프부터** 찾는다.

- 전역에서는 `x = 10`
- `foo` 함수 내부에서는 `x = 100`
- `bar` 함수 내부에서는 `x = 1000`

이처럼 **스코프 체인(Scope Chain)** 에 따라 가장 가까운 스코프에 선언된 변수를 우선 사용하게 된다.

---

## 1.4.3 클로저의 활용

```javascript
function outerFunction() {
  var x = 'at sopt';
  
  function innerFunction() {
    console.log(x);
  }
  
  return innerFunction;
}

const innerFunction = outerFunction();
innerFunction(); // at sopt
```

- 위 예제에서 `outerFunction`은 `innerFunction`을 반환하며 실행이 종료됨  
- 반환한 함수에는 `x`라는 변수가 존재하지 않지만, 해당 함수가 선언된 어휘적 환경, 즉 `outerFunction`에는 `x`라는 변수가 존재하며 접근할 수도 있음

➡️ 같은 환경에서 선언되고 반환된 `innerFunction`은 `x` 변수가 존재하던 환경을 기억하기 때문에 정상적으로 "at sopt"를 출력할 수 있는 것이다.

<br>

### 전역 스코프와 클로저

전역 스코프는 어디서든 원하는 값을 꺼내올 수 있다는 장점이 있지만, 반대로 누구나 접근하고 수정할 수 있다는 단점도 있다.

```javascript
var counter = 0;

function handleClick() {
  counter++;
}
```

이 `counter` 변수는 다음과 같은 문제를 가진다.

- 전역 레벨에 선언되어 누구나 수정할 수 있다.
- `window.counter`로 쉽게 접근이 가능하다.

만약 리액트의 `useState` 변수가 전역 레벨에 저장돼 있다면, 누구나 리액트 애플리케이션을 망가뜨릴 수 있을 것이다.

<br>

💡 리액트에서는 내부 상태 값을 별도로 관리하는 클로저 내부에서만 접근 가능하게 한다.

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
    counter: function () {
      console.log('counter에 접근!');
      return counter;
    },
  };
}

var c = Counter();
console.log(c.increase()); // 1
console.log(c.increase()); // 2
console.log(c.increase()); // 3
console.log(c.decrease()); // 2
console.log(c.counter());  // 2
```
<br>

### 클로저 활용의 장점
- `counter` 변수를 직접 노출하지 않아 무분별한 수정을 방지함
- 변수에 접근할 때마다 로그를 남기거나 특정 조건을 걸 수 있음
- 변수 업데이트를 `increase`와 `decrease`로 제한해 의도하지 않은 변경을 방지함

✔️ 이처럼 클로저를 활용하면 전역 스코프 사용을 막고, 필요한 정보만 안전하게 노출할 수 있다!

<br>

### 리액트에서의 클로저

- `useState`를 통해 변수를 저장하고,  
- `useState` 변수의 접근 및 수정 또한 클로저 내부에서 이루어진다.  
- 값이 변할 때마다 렌더링 함수를 호출하는 등 다양한 처리가 가능하다.
<br>

### useState와 클로저

리액트 함수 컴포넌트에서 클로저를 활용하는 대표적인 예는 `useState`이다.

```javascript
function Component() {
  const [state, setState] = useState(0);

  function handleClick() {
    // useState 호출은 위에서 끝났지만,
    // setState는 내부의 최신값(prev)을 계속 알고 있다.
    // 이는 클로저 덕분이다.
    setState((prev) => prev + 1);
  }

  // ...
}
```

`useState` 함수 호출은 `Component` 함수 내부에서 완료됐지만,  
그 이후에도 `setState`는 `useState` 내부의 최신 `state` 값을 알고 있다.

➡️ **클로저가 `useState` 내부에서 활용되었기 때문**

외부 함수(`useState`)가 반환한 내부 함수(`setState`)는 외부 함수 호출이 끝난 후에도  
자신이 선언된 환경(`state` 값이 저장된 메모리 공간)을 기억하고 접근할 수 있다.

---

## 1.4.4 주의할 점

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

위 코드의 의도는 0부터 시작해 1초 간격으로 `console.log`로 0, 1, 2, 3, 4를 차례대로 출력하는 것이다.  
그러나 실제로 실행해보면, 0, 1, 2, 3, 4초 뒤에 모두 5만 출력된다.

이는 `setTimeout`의 익명 함수가 **클로저로 i를 참조**하는데,  
`var i`가 함수 레벨 스코프를 따르기 때문에 for문이 끝난 후 i가 5로 업데이트되어 있기 때문이다.

<br>

### 문제의 원인❗

- `var`는 블록 스코프가 아닌 함수 레벨 스코프를 따름
- for 문을 순회한 후, `i`는 전역 또는 함수 스코프 레벨에서 5로 결정되어 있음
- `setTimeout`의 콜백 함수가 실행될 때 이미 `i = 5`로 되어있음

<br>

### 올바르게 수정하는 방법

#### 1. `let`을 사용하여 블록 스코프 만들기

```javascript
for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

- `let`은 블록 레벨 스코프를 갖기 때문에, for 문을 순회할 때마다 각각 고유한 `i`를 가지게 된다.
- 결과적으로 의도한 대로 0, 1, 2, 3, 4를 출력할 수 있다.

#### 2. 클로저를 명시적으로 활용하기 (즉시 실행 함수 사용)

```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(
    (function (sec) {
      return function () {
        console.log(sec);
      };
    })(i),
    i * 1000
  );
}
```

- for 문 내부에서 **즉시 실행 함수(IIFE)** 를 사용하여 `i` 값을 고정한다.
- `sec`이라는 고유한 변수를 만들어서 콜백이 참조하도록 한다.
<br>

### 클로저의 비용


⚠️ **클로저를 생성할 때는 추가적인 비용이 발생**한다.
생성될 때마다 선언적 환경을 기억해야 하므로 메모리에 추가 부하를 준다.
<br>

#### 1. 긴 작업을 일반적인 함수로 처리

```javascript
// 일반적인 함수
const aButton = document.getElementById('a');

function heavyJob() {
  const longArr = Array.from({ length: 10000000 }, (_, i) => i + 1);
  console.log(longArr.length);
}

aButton.addEventListener('click', heavyJob);
```


#### 2. 긴 작업을 클로저로 처리

```javascript
// 클로저 사용
function heavyJobWithClosure() {
  const longArr = Array.from({ length: 10000000 }, (_, i) => i + 1);
  return function () {
    console.log(longArr.length);
  };
}

const innerFunc = heavyJobWithClosure();

const bButton = document.getElementById('b');
bButton.addEventListener('click', function () {
  innerFunc();
});
```

<br>

### 메모리 차이 분석

- **일반 함수**: 클릭할 때마다 배열을 생성하고 즉시 사용 → 메모리에 큰 영향을 주지 않음
- **클로저 사용**: 긴 배열(`longArr`)이 미리 생성되고, 클로저가 이를 기억 → 프로그램 시작 시부터 메모리에 큰 부담

크롬 개발자 도구(DevTools)로 확인하면:

- 일반 함수는 메모리 사용량 변화가 적음
- 클로저 함수는 약 40MB 크기의 배열이 프로그램 시작 시 메모리에 상주

---

## 1.4.5 정리

지금까지 클로저란 무엇이고, 어떻게 활용할 수 있으며  리액트에서는 어떻게 사용되고 있을지를 살펴보았다.

- 클로저는 함수형 프로그래밍에서 중요한 개념이다.
- 부수 효과(side effect)가 없고 순수성(purity)을 지키는 데 필수적이다.
- 클로저 개념은 어렵게 정의되어 있지만, 실제로는 그렇게 어렵지 않다.

그러나,

- 클로저는 공짜로 사용할 수 있는 기능이 아니다.
- 메모리 사용량에 주의해야 하며, 클로저를 남발하면 오히려 성능에 악영향을 줄 수 있다.

**🤙🏻 클로저를 사용할 때는 신중하게 고려하자!**
