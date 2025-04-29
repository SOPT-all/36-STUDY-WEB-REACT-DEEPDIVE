# 리액트 개발을 위해 꼭 알아야 할 자바스크립트

## 자바스크립트의 동등비교

리액트의 컴포넌트 렌더링이 일어나는 이유 중 하나가 바로 props의 동등 비교에 따른 결과이다. 이 prop의 동등 비교는 객체의 얕은 비교를 기반으로 이루어진다.

### 1.1.1 자바스크립트의 데이터 타입

- 자바스크립트의 모든 값은 데이터 타입을 갖고 있으며, 이 데이터 타입은 크게 원시 타입과 객체 타입으로 나눌 수 있다.

#### 원시 타입

| 타입        | 설명                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| `boolean`   | 참과 거짓을 나타내는 데이터 타입                                         |
| `null`      | 값이 없거나 비어 있음을 나타내는 값                                      |
| `undefined` | 선언 후 값을 할당하지 않은 변수 또는 값이 주어지지 않은 인수에 할당된 값 |
| `number`    | 숫자를 나타내는 데이터 타입                                              |
| `string`    | 문자열을 나타내는 데이터 타입                                            |
| `symbol`    | 고유하고 변경 불가능한 값을 나타내는 데이터 타입                         |
| `bigint`    | 임의의 정밀도를 가진 정수를 나타내는 데이터 타입                         |

#### 객체 타입

| 타입     | 설명                        |
| -------- | --------------------------- |
| `object` | 객체를 나타내는 데이터 타입 |

#### 원시 타입 상세 설명

| 타입        | 특징                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| `undefined` | 선언 후 값을 할당하지 않은 변수 또는 값이 주어지지 않은 인수에 자동으로 할당되는 값 |
| `null`      | 값이 없거나 비어 있음을 명시적으로 나타내는 값                                      |
| `boolean`   | 참(`true`)과 거짓(`false`)을 나타내며, truthy와 falsy 값도 존재                     |

##### `undefined` 예제

```js
let foo;
typeof foo == "undefined"; // true
function bar(hello) {
  return hello;
}
typeof bar() === "undefined"; // true
```

##### `null` 예제

```js
typeof null === "object"; // true?
```

`null`은 `typeof`로 확인했을 때 `'object'`라는 결과가 반환된다. 일반적으로 `undefined`는 '선언됐지만 할당되지 않은 값', `null`은 '명시적으로 비어 있음을 나타내는 값'으로 사용된다.

##### `boolean` 예제

| 값          | 설명                                            |
| ----------- | ----------------------------------------------- |
| `false`     | Boolean `false`는 대표적인 falsy 값             |
| `0, -0`     | 숫자 0은 부호나 소수점 유무에 상관없이 falsy 값 |
| `0n`        | BigInt 0은 falsy 값                             |
| `NaN`       | 숫자가 아님을 나타내는 `NaN`은 falsy 값         |
| `""`        | 공백이 없는 빈 문자열은 falsy 값                |
| `null`      | `null`은 falsy 값                               |
| `undefined` | `undefined`는 falsy 값                          |

여기서 말하는 truthy는 조건문 내부에서 true로 취급되는 값이다. 앞에서 언급한 falsy로 취급되는 값 이외에는 모두 true로 취급한다.
중요한 점은 객체와 배열은 내부에 값이 존재하는 지 여부와는 관계없이 모두 truthy로 취급된다는 것이다.

### Truthy와 Falsy의 존재 이유

자바스크립트에서 truthy와 falsy 개념은 조건문과 같은 논리적 평가에서 유연성을 제공하기 위해 존재한다. 이 개념은 다양한 데이터 타입을 논리적으로 평가할 수 있도록 하며, 개발자가 명시적으로 `true` 또는 `false`로 변환하지 않아도 조건문에서 값을 사용할 수 있게 한다.

#### Truthy와 Falsy의 장점

1. **코드 간결성**: 조건문에서 명시적인 비교 없이도 다양한 값들을 평가할 수 있다.

   ```js
   let value = "Hello";
   if (value) {
     console.log("Truthy!"); // value가 truthy이므로 실행
   }
   ```

2. **유연한 데이터 처리**: 다양한 데이터 타입을 논리적으로 평가할 수 있어, 데이터의 존재 여부나 유효성을 간단히 확인할 수 있다.
   ```js
   let items = [];
   if (!items.length) {
     console.log("배열이 비어 있습니다."); // falsy 값으로 평가
   }
   ```

#### Truthy와 Falsy의 주의점

truthy와 falsy는 자바스크립트의 동적 타이핑 특성에서 비롯된 개념으로, 때로는 의도치 않은 결과를 초래할 수 있다. 따라서 다음과 같은 상황에서는 주의가 필요하다.

1. **명확한 비교 필요**: 값의 정확한 비교가 필요한 경우, `===` 또는 `!==` 연산자를 사용하여 명시적으로 비교하는 것이 좋다.

   ```js
   let value = 0;
   if (value === 0) {
     console.log("값이 0입니다."); // 명시적 비교
   }
   ```

   ㅈ

2. **객체와 배열의 truthy 평가**: 객체와 배열은 비어 있더라도 항상 truthy로 평가된다.
   ```js
   let obj = {};
   if (obj) {
     console.log("객체는 truthy입니다."); // 항상 실행
   }
   ```

`Bigint`

number 가 다룰 수 있는 숫자 크기의 제한을 극복하기 위해 최대 2^55 -1 을 저장할 수 있는 number의 한계를 넘어서 더 큰 숫자를 저장할 수 있게 해준다.

`Symbol`

symbol은 ES6에서 새롭게 추가된 7번째 타입으로, 중복되지 않는 어떤 고유한 값을 나타내기 위해 만들어졌다.
심벌은 심벌 함수를 이용해서만 만들 수 있다.

```js
// Symbol 함수에 같은 인수를 넘겨주더라도 이는 동일한 값으로 인정되지 않는다.
// 심벌 함수 내부에 넘겨주는 값은 Symbol 생성에 영향을 미치지 않는다(Symbol.for 제외).
const key = Symbol(‘key’)
const key2 = Symbol('key')
key === key2 // false
// 동일한 값을 사용하기 위해서는 Symbol.for를 활용한다.
Symbol.for('hello') == Symbol.for('heUo') // true
```

`객체 타입`

객체 타입을 간단하게 정의하면 7가지 원시 타입 이외의 모든 것, 즉 자바스크립트를 이루고 있는 대부분의 타입이 바로 객체 타입이다.(배열,함수,정규식,클래스 등)

객체 타입은 다른 말로 참조 타입으로도 불린다.(참조를 전달하기 때문)
원시 타입과 객체 타입의 가장 큰 차이점이라고 한다면, 바로 값을 저장하는 방식의 차이다. 이 값을 저장하는 방식의 차이가 동등 비교를 할 때 차이를 만드는 원인이 되는데,

원시 타입은 불변 형태의 값으로 저장된다. 즉, 변수 할당 시점에 메모리 영역을 차지하고 저장되는 것.

```js
let hello = ’hello world'
let hi = hello
console.log(hello === hi) // true
```

이 처럼 true가 반환되는 이유는 hello의 hello world 라는 `값` 이 hi에 복사되어 전달됐기 때문이다. 값을 비교하기 때문에, 값을 전달하는 방식이 아닌 각각 선언하는 방식으로도 동일한 결과를 볼 수 있다.

반면 객체는 프로퍼티를 삭제,추가,수정할 수 있다는 특징이 있으므로 원시 값과는 다르게 변경 가능한 형태로 저장된다.
그리고 값을 복사할 때에도 값이 아닌 `참조(주소 값)` 을 전달하게 된다.

```js
// 다음 객체는 완벽하게 동일한 내용을 가지고 있다.
var hello = {
greet: 'hello, world’
,
}
var hi = {
greet: 'hello, world',
}
// 그러나 동등 비교를 하면 false가 나온다.
console.log(hello === hi) // false
// 원시값인 내부 속성값을 비교하면 동일하다.
console.log(heUo.greet === hi.greet) // true
```

### 1.1.4 리액트에서의 동등비교

`Object.is`는 ECMAScript 2015(ES6)에서 도입된 메서드로, 두 값이 동일한지 비교하는 데 사용됩니다. 리액트는 이 메서드를 사용하여 props와 state의 변경 여부를 판단합니다. `Object.is`는 `===`와 유사하지만, 몇 가지 중요한 차이점이 있습니다.

#### `Object.is`와 `===`의 차이점

1. **`NaN` 비교**:

   - `===`는 `NaN`을 서로 다르다고 평가합니다.
   - `Object.is`는 `NaN`을 동일하다고 평가합니다.

   ```js
   NaN === NaN; // false
   Object.is(NaN, NaN); // true
   ```

2. **`+0`과 `-0` 비교**:

   - `===`는 `+0`과 `-0`을 동일하다고 평가합니다.
   - `Object.is`는 `+0`과 `-0`을 다르다고 평가합니다.

   ```js
   +0 === -0; // true
   Object.is(+0, -0); // false
   ```

#### 리액트에서의 활용

리액트는 `Object.is`를 사용하여 이전 값과 새로운 값을 비교함으로써, 불필요한 렌더링을 방지하고 성능을 최적화합니다. 예를 들어, `React.memo`는 props가 변경되지 않은 경우 컴포넌트를 다시 렌더링하지 않도록 설계되어 있습니다. 이때 props의 비교는 `Object.is`를 기반으로 이루어집니다.

```js
import React from "react";

const MyComponent = React.memo(({ value }) => {
  console.log("렌더링");
  return <div>{value}</div>;
});

// 부모 컴포넌트
function Parent() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <MyComponent value={count} />
      <button onClick={() => setCount(count)}>값 유지</button>
      <button onClick={() => setCount(count + 1)}>값 변경</button>
    </div>
  );
}
```

위 코드에서 `setCount(count)`를 호출하면 `count` 값이 변경되지 않으므로 `MyComponent`는 다시 렌더링되지 않습니다. 이는 `Object.is`를 사용한 props 비교 덕분입니다.

#### 주의사항

`Object.is`는 객체의 참조를 비교하기 때문에, 객체나 배열과 같은 참조 타입의 데이터가 변경되지 않았더라도 새로운 참조를 가지면 다른 값으로 간주됩니다. 따라서 리액트에서 상태 관리 시 불변성을 유지하는 것이 중요합니다.

```js
const obj1 = { key: "value" };
const obj2 = { key: "value" };

Object.is(obj1, obj2); // false
```

리액트에서 `Object.is`를 이해하고 적절히 활용하면, 성능 최적화와 불필요한 렌더링 방지에 큰 도움이 됩니다.

## 함수

자바스크립트에서 함수란 작업을 수행하거나 값을 계산하는 등의 과정을 표현하고 이를 하나의 블록으로 감싸서 실행 단위로 만들어 놓은 것을 의미한다.

### 1.2.2 함수를 정의하는 4가지 방법

자바스크립트에서 함수를 정의하는 방법은 크게 4가지로 나눌 수 있다.

#### 1. 함수 선언식

함수 선언식은 `function` 키워드를 사용하여 함수를 정의하는 방식입니다. 함수 선언식으로 정의된 함수는 호이스팅에 의해 코드의 어느 위치에서든 호출할 수 있습니다.

```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
```

#### 2. 함수 표현식

함수 표현식은 변수에 익명 함수를 할당하여 정의하는 방식입니다. 함수 표현식으로 정의된 함수는 선언 이후에만 호출할 수 있습니다.

```js
const subtract = function (a, b) {
  return a - b;
};

console.log(subtract(5, 2)); // 3
```

#### 3. 화살표 함수

화살표 함수는 ES6에서 도입된 간결한 함수 정의 방식입니다. `function` 키워드 대신 `=>`를 사용하며, `this` 바인딩이 기존 함수와 다릅니다.

```js
const multiply = (a, b) => a * b;

console.log(multiply(3, 4)); // 12
```

#### 4. 생성자 함수

`Function` 생성자를 사용하여 함수를 정의하는 방식입니다. 잘 사용되지는 않지만, 동적으로 함수를 생성할 때 유용할 수 있습니다.

```js
const divide = new Function("a", "b", "return a / b");

console.log(divide(10, 2)); // 5
```

### 1.2.3 다양한 함수 살펴보기

즉시 실행함수는 말 그대로 함수를 정의하고 그 순간 즉시 실행되는 함수를 의미한다. 단 한 번만 호출되고 다시금 호출할 수 없는 함수이다.

```js
(function (a, b) {
return a + b
})(10, 24);// 34
((a, b) => {
return a + b
},
)(10, 24) // 34
```

즉시 실행 함수는 한 번 선언하고 호출된 이후부터는 더 이상 재호출이 불가능하다. 따라서 일반적으로 즉시 실행 함수에 이름을 붙이지 않는다.

`고차 함수`

자바스크립트의 일급 객체라는 특징을 활용하면 함수를 인수로 받거나 결과로 새로운 함수를 반환시킬 수 있는데, 이런 역할을 하는 함수를 고차 함수라고 한다.

### 1.4.2 변수의 유효 범위, 스코프

변수의 유효 범위를 스코프라고 하는데, 자바스크립트에는 다양한 스코프가 있다.

`전역 스코프`

전역 레벨에 선언하는 것을 전역 스코프라고한다. 전역이라는 이름에서 알 수 있듯, 이 스코프에서 변수를 선언하면 어디서는 호출할 수 있게 되고 브라우저 환경에서는 window
Node.js 환경에서는 global 이 존재한다.

```js
var global = "global scope";
function heUo() {
  console.log(global);
}
console.log(global); // global scope
heUo(); // global scope
console.log(global === window.global); // true
```

`함수 스코프`

다른 언어와 달리 자바스크립트는 기본적으로 함수 레벨 스코프를 따른다. 즉, {} 블록이 스코프 범위를 결정하지 않는다.

```js
if (true) {
  var global = "global scope";
}
console.log(global); // 'global scope'
console.log(global === window.global); // true
```

var global이 분명 {} 내부에 선언돼 있는데, {} 밖에서도 접근이 가능한 것은 자바스크립트는 기본적으로 함수 레벨 스코프를 가지고 있기 때문이다.

```js
function heUo() {
  var local = "local variable";
  console.log(local); // local variable
}
heUo();
console.log(local); // Uncaught ReferenceError: local is not defined
```

위 예제에서는 단순한 if 블록과는 다르게 함수 블록 내부에서는 일반적으로 예측하는 것과 같이 스코프가 결정되는 것을 볼 수 있다.

만약 스코프가 중첩돼 있다면 자바스크립트에서는 가장 가까운 스코프에서 변수가 존재하는지를 먼저 확인한다,

### 1.4.3 클로저의 활용

클로저의 정의인 "함수와 함수가 선언된 어휘적 환경의 조합" 이란 자바스크립트의 함수 레벨 스코프와 밀접한 관계가 있다.
즉, 선언된 함수 레벨 스코프를 활용하여 어떤 작업을 할 수 있다는 개념이 바로 클로저다.

```js
function outerFunction() {
  var x = "hello";
  function innerF니nction() {
    console.log(x);
  }
  return innerFunction;
}
const innerFunction = outerFunction();
innerFunction(); // "heUo”
```

위 예제에서 outerFunction은 innerFunction 을 반환하며 실행이 종료되지만, 여기서 반환한 함수인 innerFunction에는 분명 x라는 변수가 존재하지 않지만,
해당 함수가 선언된 어휘적 환경, 즉, outerFuction에는 x라는 변수가 존재하며 접근할 수도 있기 때문에 같은 환경에서 선언되고 반환된 innerFunction 에는 x라는 변수가 존재하던 환경을 기억하여 'hello'를 출력할 수 있는 것이다.

### 리액트에서의 클로저

리액트에서 클로저는 컴포넌트의 상태와 이벤트 핸들러를 다룰 때 자주 나타나는 개념입니다. 클로저를 활용하면 컴포넌트의 상태를 안전하게 캡처하고, 특정 값이나 함수에 접근할 수 있습니다.

#### 클로저와 상태 관리

리액트 함수형 컴포넌트에서 상태를 관리할 때, 클로저는 이전 상태 값을 참조하거나 특정 값을 유지하는 데 유용합니다. 예를 들어, 상태 업데이트 함수에서 이전 상태를 기반으로 새로운 상태를 계산할 때 클로저가 사용됩니다.

```js
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prevCount) => prevCount + 1); // 클로저를 통해 이전 상태 참조
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default Counter;
```

위 코드에서 `setCount` 함수는 클로저를 사용하여 `prevCount` 값을 참조합니다. 이를 통해 상태 업데이트가 안전하게 이루어집니다.

#### 클로저와 이벤트 핸들러

리액트에서 이벤트 핸들러를 정의할 때, 클로저를 사용하여 특정 값을 캡처할 수 있습니다. 이를 통해 이벤트 핸들러에 추가적인 데이터를 전달하거나 특정 상태를 유지할 수 있습니다.
즉, 클로저가 useState 내부에서 활용됐기 때문이다. 외부 함수(useStae)가 반환한 내부함수(setState)는 외부 함수 호출이 끝났음에도 자신이 선언된 외부 함수가 선언된 환경을 기억하기 때문에 계속해서 state 값을 사용할 수 있는 것이다.

```js
import React, { useState } from "react";

function ItemList() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClick = (item) => {
    return () => {
      setSelectedItem(item); // 클로저를 통해 item 값 캡처
    };
  };

  const items = ["Apple", "Banana", "Cherry"];

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <button onClick={handleClick(item)}>{item}</button>
          </li>
        ))}
      </ul>
      {selectedItem && <p>Selected Item: {selectedItem}</p>}
    </div>
  );
}

export default ItemList;
```

위 코드에서 `handleClick` 함수는 클로저를 사용하여 `item` 값을 캡처합니다. 이를 통해 각 버튼 클릭 시 해당 `item` 값을 안전하게 참조할 수 있습니다.

#### 클로저 사용 시 주의사항

1. **의도치 않은 값 참조**: 클로저가 외부 변수의 최신 값을 참조하기 때문에, 반복문에서 클로저를 사용할 때 주의해야 합니다.
2. **메모리 누수**: 클로저가 참조하는 값이 더 이상 필요하지 않을 경우, 이를 명시적으로 정리하지 않으면 메모리 누수가 발생할 수 있습니다.

리액트에서 클로저를 올바르게 이해하고 활용하면, 상태 관리와 이벤트 처리에서 더욱 강력하고 유연한 코드를 작성할 수 있습니다.

### 1.5 이벤트 루프와 비동기 통신의 이해

자바스크립트는 기본적으로 싱글 스레드에서 작동한다. 즉, 자바스크립트는 한 번에 하나의 작업만 동기 방식으로만 처리할 수있다.
여기서 말하는 `동기` 방식이란 직렬 방식으로 작업을 처리하는 것을 의미하며, 이 요청이 시작된 이후에는 무조건 응답을 받은 이후에야 비로소 다른 작업을 처리할 수 있다는 것을 의미한다.

반면에 비동기 방식이란 직렬 방식이 아니라 `병렬` 방식으로 작업을 처리하는 것을 의미한다. 요청을 시작한 후 이 응답이 오건 말건 상관없이 다음 작업이 이루어지며, 따라서 한 번에 여러 작업이 실행될 수 있다.

싱글 스레드를 이해하기 위해서는 우선 스레드에 대해서 알아야 한다.

과거에는 프로그램을 실행하는 단위가 오직 프로세스 뿐이었지만, 소프트웨어가 점차 복잡해지면서 하나의 프로그램에서 동시에 여러 개의 복잡한 작업을 수행할 필요성이 대두되었고, 그래서 탄생한 더 작은 실행 단위가 스레드 인것이다.

#### 1.5.2 이벤트 루프란?

호출 스택(call stack) 은 자바스크립트에서 수행해야 할 코드나 함수를 순차적으로 담아두는 스택이다.

```js
function bar() {
  console.log("bar");
}
function baz() {
  console.log("baz");
}
function foo() {
  console.log("too");
  bar();
  baz();
}
foo();
```

이 코드는 foo를 호출하고 내부에서 bar, baz를 순차적으로 호출하는 구조로 되어있다.

1. foo 0가호출 스택에 먼저 들어간다.
2. foo() 내부에 console.log가 존재하므로 호출스택에 들어간다.
3. 2°| 실행이 완료된 이후에 다음 코드로 넘어간다.(아직 foo()는 존재)
4. bar()가호출 스택에들어간다.
5. bar() 내부에 console, log가존재하므로 호출 스택에 들어간다.
6. 5의 실행이 완료된 이후에 다음 쿠드루 넘어간다. (아직 foo(), ba「()는 존재)
7. 더 이상 bar()에 남은 것이 없으므로 호출 스택에서 제거된다. (아직 foo()는 존재)
   baz()가 호출 스택에 들어간다.
8. baz() 내부에 console, log가존재하므로 호출 스택에 들어간다.
9. 9의 실행이 완료된 이후에 다음 코드로 넘어간다. (아직 foo(), baz()는 존재)
10. 더 이상 baz()에남은 것이없으므로 호출 스택에서제거된다.(아직 foo()는 존재)
11. 더 이상 foo()에 남은 것이 없으므로 호출 스택에서 제거된다.
12. 이제 호출 스택이 완전히 비워졌다.

이러한 호출 스택이 비어있는지 여부를 확인하고 관리하는 것이 바로 `이벤트 루프` 이다. 여기서 알아둘 점은 코드를 실행하는 것과 호출 스택이 비어있는지 확인하는 것 모두 단일 스레드에서 일어난다는 점이다.
즉, 두 작업은 동시에 일어날 수 없으며 한 스레드에서 순차적으로 일어난다.

```js
function bar() {
console.log('bar')
}
function baz() {
console.log('baz’)
}
function foo() {
console.log(’foo')
setTimeout(bar(), 0) // setTimeout만 추가했다.
baz()
}
foo()
```

1. foo()가 호출 스택에 먼저 들어간다.
2. foo() 내부에 console.log가존재하므로 호출 스택에 들어간다.
3. 2의 실행이 완료된 이후에 다음 코드로 넘어간다. (아직 foo()는 존재)
4. setTimeout(bar(), 0)이 호출 스택에 들어간다.
5. 4번에 대해 타이머 이벤트가 실행되며 태스크 큐로 들어가고, 그 대신 바로 스택에서 제거된다.
6. baz() 가호출 스택에 들어간다.
7. baz() 내부에 console, log가 존재하므로 호출 스택에 들어간다.
8. 7의 실행이 완료된 이후에 다음 코드로 넘어간다. (아직 foo(), baz()는 존재)
9. 더 이상 baz()에 남은 것이 없으므로 호출 스택에서 제거된다. (아직 foo()는 존재)
10. 더 이상 foo()에 남은 것이 없으므로 호출 스택에서 제거된다.
11. 이제 호출 스택이완전히 비워졌다.
12. 이벤트 루프가 호출 스택이 비워져 있다는 것을 확인했다. 그리고 태스크 큐를 확인하니 4번에 들어갔던 내용이 있어
13. bar()를 호출 스택에 들여보낸다.
14. bar() 내부에 console, log가존재하므로 호출 스택에 들어간다.
15. 13의 실행이 끝나고, 다음 코드루 넘어간다.(아직 bar() 존재)
16. 더 이상 bar()에 남은 것이 없으므로 호출 스택에서 제거된다.

이벤트, 루프에는 태스크 큐라는 새로운 개념이 등장한다. 태스크 큐란 실행해야 할 태스크의 집합을 의미하고, 이벤트 루프는 이러한 태스트 큐를 한 개 이상 가지고 있다.
여기서 주의해야 할 점은 태스크 큐는 자료구조의 큐(queue)가 아니고 set형태를 띠고 있다. 그 이유는 선택 된 큐 중에서 실행 가능한 가장 오래된 태스크를 가져와야 하기 때문이다.

자료구조인 큐는 무조건 앞에있는 것을 FIFO형식으로 꺼내야 하지만, 태스크 큐는 그렇지 않다.
태스크 큐에서 의미하는 '실행해야 할 태스크' 라는 것은 비동기 함수의 콜백 함수나 이벤트 핸들러 등을 의미한다.

즉, 이벤트 루프의 역할을 호출 스택에 실행 중인 코드가 있는지, 태스크 큐에 대기 중인 함수가 있는지 반복해서 확인하는 어떠한 메커니즘 자체를 의미하기도 한다.

1. 호출 스택이 비어있는지 확인한다.
2. 호출 스택이 비었다면 태스크 큐에 대기 중인 작업이 있는지 확인한다.
3. 작업을 실행 가능한 오래된 것부터 순차적으로 꺼내와서 실행하게 된다.

### 1.5.3 태스크 큐와 마이크로 태스크 큐

##### 마이크로 태스크 큐(Microtask Queue)

마이크로 태스크 큐는 태스크 큐보다 높은 우선순위를 가지며, `Promise`의 `then`, `catch`, `finally` 메서드와 `MutationObserver`와 같은 작업이 이 큐에 추가됩니다. 마이크로 태스크는 현재 실행 중인 작업이 완료된 직후, 즉 호출 스택이 비워지기 전에 실행됩니다.

```js
function foo() {
  console.log("foo");
}
function bar() {
  console.log("bar");
}
function baz() {
  console.log("baz");
}
setTimeout(foo, 0);
Promise.resolve().then(bar).then(baz);
```

예제 코드를 실행하면 bar, baz, foo 순으로 실행된다. 확실히 Promise가 우선권이 있음을 알 수 있다.

각 태스크에 들어가는 대표적인 작업은 다음과 같다.

- 태스크 큐 : setTimeout, setInterval, setImmediate
- 마이크로 태스크 큐 : process, nextTick,Promises,queueMicroTask, MutationObserver

마이크로태스크 큐를 실행한 뒤에 렌더링이 일어난다. 즉, 각 마이크로 태스크 큐 작업이 끝날 때 마다 한 번씩 렌더링 할 기회를 얻게 된다.

### 리액트에서 자주 사용하는 자바스크립트 문법

#### 1.6.1 구조 분해 할당

구조 분해 할당이란 배열 또는 객체의 값을 말 그대로 분해해 개별 변수에 즉시 할당하는 것을 의미한다.

```jsx
const array = [1, 2, 3, 4, 5];
const [first, second, third, ...arrayRest] = array;
// first 1
// second 2
// third 3
// arrayRest [4, 5]
```

구조 분해 할당이란 배열 또는 객체의 값을 말 그대로 분해해 개별 변수에 즉시 할당하는 것을 의미한다.

```jsx
const array = [1, 2, 3, 4, 5];
const [first, second, third, ...arrayRest] = array;
// first 1
// second 2
// third 3
// arrayRest [4, 5]
```

구조 분해 할당은 배열뿐만 아니라 객체에서도 사용할 수 있습니다. 객체의 구조 분해 할당은 객체의 속성을 변수로 추출할 때 유용합니다.

```jsx
const person = { name: "Alice", age: 25, city: "Seoul" };
const { name, age, city } = person;
// name 'Alice'
// age 25
// city 'Seoul'
```

또한, 기본값을 설정할 수도 있습니다. 만약 구조 분해 대상에 해당 속성이 없을 경우 기본값이 사용됩니다.

```jsx
const person = { name: "Bob" };
const { name, age = 30 } = person;
// name 'Bob'
// age 30 (기본값)
```

구조 분해 할당은 함수의 매개변수에서도 자주 사용됩니다. 이를 통해 함수 호출 시 전달된 객체나 배열의 특정 값만 쉽게 추출할 수 있습니다.

```jsx
function greet({ name, age }) {
  console.log(`Hello, my name is ${name} and I am ${age} years old.`);
}

const user = { name: "Charlie", age: 28 };
greet(user);
// 출력: Hello, my name is Charlie and I am 28 years old.
```

이처럼 구조 분해 할당은 코드의 가독성을 높이고, 데이터를 다룰 때 반복적인 작업을 줄여주는 강력한 도구입니다.

#### 1.6.2 전개 구문

전개 구문은 앞서 소개한 구조 분해 할당과는 다르게 배열이나 객체, 문자열과 같이 순회할 수 있는 값에 대해 말 그대로 전개해 간결하게 사용할 수 있는 구문이다.

`배열의 전개 구문`

과거에는 배열 간에 합성을 하려면 push(), concat(), splice() 등의 메서드를 사용해야 했다. 그러나 전개 구문을 활용하면 다음과 같이 매우 쉽게 배열을 합성할 수 있다.

```jsx
const arr1 = [’a', 'b']
const arr2 = [•••arr1, 'c', 'd', 'e'] // [‘a’,’b', 'c', 'd', ’e']
```

이렇게 배열 내부에서 ...배열 을 사용하면 해당 배열을 마치 전개하는 것 처럼 선언하고 내부 배열에서 활용할 수 있다.

`객체의 전개 구문`

객체에서도 배열과 비슷하게 사용이 가능하다. 객체를 새로 만들 때 이 전개 구문을 사용할 수 있으며, 마찬가지로 객체를 합성하는 데 있어 편리함을 가져다 준다.

```jsx
const obj1 = {
  a: 1,
  b: 2,
};
const obj2 = {
  c: 3 ? d : 4,
};
const newObj = { ...obj1, ...obj2 };
// { "a": 1, "b”: 2, "c": 3, "d”: 4 }
```

여기서 한 가지 중요한 것은 객체 전개 구문에 있어서 순서가 중요하다는 것이다.

```jsx
const obj = {
a: 1,
b: 1,
c： 1,
d: 1,
e： 1,
}
// {a: 1, b: 1, c: 10, d: 1, e: 1}
const aObj = {
...obj
c: 10,
}
// {c: 1, a: 1, b： 1, d: 1, e: 1}
const bObj = {
c: 10,
...obj,
}
```

#### 1.6.4 Array 프로토타입의 메서드 : map, filter, reduce, forEach

`Array.prototype.map`

인수로 전달받은 배열과 똑같은 길이의 새로운 배열을 반환하는 메서드다. 배열의 각 아이템을 순회하면서 각 아이템을 콜백으로 연산한 결과로 구성된 새로운 배열을 만들 수 있다.

```jsx
const am = [1, 2, 3, 4, 5];
const doubledArr = arr.map((item) => item * 2);
// [2, 4, 6, 8, 10]
```

`Array.prototype.filter`

콜백 함수를 인수로 받아서 truthy 조건을 만족하는 경우에만 해당 원소를 반환하는 메서드이다.

```jsx
const arr = [1, 2, 3, 4, 5];
const evenArr = arr.filter((item) => item % 2 === 0);
// [2, 4]
```

`Array.prototype.reduce`

이 메서드는 콜백 함수와 함께 초깃값을 추가로 인수로 받아서, 배열이나 객체, 또는 그 외의 다른 무언가를 반환할 수 있는 메서드이다.
즉, 콜백함수를 실행하고, 이를 초깃값에 누적해 결과를 반환한다.

```jsx
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((result, item) => {
  return result + item;
}, 0);
// 15
```

0은 reduce의 결과를 누적할 초깃값이다.

`Array.prototype.forEach`

콜백 함수를 받아 배열을 순회하면서 단순히 그 콜백 함수를 실행하기만 하는 메서드이다.

```jsx
const arr = [1, 2, 3];
arr.forEach((item) => console.log(item));
// 1, 2, 3
```

forEach는 주의해야 할 점이 몇 가지 존재하는데,
그 중 하나는 반환값이 없다는 것이다. 단순히 콜백 함수를 실행할 뿐, map 과 같이 결과를 반환하는 작업은 수행하지 않는다.
즉, 콜백 함수 내부에서 아무리 반환해도 모두 의미 없는 값이 된다. (forEach의 반환 값은 undefined)

또 한 가지 주의할 점은 forEach 는 실행되는 순간 에러를 던지거나 프로세스를 종료하지 않는 이상 이를 멈출 수 없다는 것이다.
break, return 그 무엇도 배열 순회를 멈출 수 없다.
