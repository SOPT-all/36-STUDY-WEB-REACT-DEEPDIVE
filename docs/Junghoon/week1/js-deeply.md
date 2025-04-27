<div> 
  <h1>
    <pre>
      리액트 딥다이브 Chpater 1.
      리액트 개발을 위해 꼭 알아야 할 자바스크립트
    </pre>
  </h1>
</div>

# 1.1 자바스크립트의 동등 비교


## 1.1.1 Js에서의 타입
```
원시타입: 객체가 아닌 다른 모든 타입, 메서드를 갖지 못한다.
- boolean
- null
- undefined
- number
- string
- symbol
- bigint
```

```
객체타입 (배열, 함수, 정규식, 클래스 등)
- object
```

Javascript를 다루고있는 대부분은 객체타입이다.

```
var hello = {
  greet: 'hello, world',
}

var hi = {
  greet: 'hello, world',
}

console.log(hello === hi) // false
console.log(hello.greet === hi.greet) // true 원시값인 내부 속성값을 비교하면 동일하다.
```
객체는 프로퍼티를 삭제, 추가, 수정할 수 있으므로 원시 값과 다르게 변경 가능한 형태로 저장한다. 값을 복사할 때도 값이 아닌 참조를 전달하게 된다.
- 객체: 값 저장X, 참조 저장 O


## 1.1.2 동등비교
리액트에서 사용하는 동등 비교는 '=='나 '==='가 아닌 Object.is 이다. Object.is는 ES6에서 제공하는 기능이기 때문에 리액트에서는 이를 구현한 폴리필(Polyfill)을 함께 사용한다.
```
const objectIs: (x: any, y: any) => boolean =
  typeof Object.is === 'function' ? Object.is : is

export default objectIs
```
리액트에서는 이 objectIs를 기반으로 동등 비교를 하는 shallowEqual이라는 함수를 만들어 사용한다.

# 1.2 함수
자바스크립트와 리액트에서 반드시 알아야 할 내용이 바로 함수이다.

## 1.2.1 함수란 무엇인가?
자바스크립트에서 함수란 작업을 수행하거나 값을 계산하는 등의 과정을 표현하고, 이를 하나의 블록으로 감싸서 실행 단위로 만들어 놓은 것을 의미한다.
```
// 함수의 기본적인 형태
function sum(a,b) {
  return a + b
}

sum(10, 24) // 34
```
function으로 시작해 }로 끝나는 부분까지가 함수를 정의한 부분이다.

함수를 선언하는 방법에는 4가지가 있다.
---
1. 함수 선언문
```
function greet() {
  console.log("Hello");
}
greet(); // Hello
```
- 이름이 있는 함수
- 호이스팅됨 (선언 전에 호출해도 작동)
---
2. 함수 표현식
```
const greet = function () {
  console.log("Hi");
};
greet();  // Hi
```
- 변수에 익명 함수(또는 이름 있는 함수)를 할당
- 호이스팅 안 됨(선언 전에 호출하면 에러)
---
3. Function 생성자
```
const sum = new Function('a', 'b', 'return a + b');
console.log(sum(2,3)); // 5
```
- 문자열로 함수를 정의
- 거의 사용하지 않음 (동적 코드 실행은 보안상 위험)
---
4. 화살표 함수 (ES6에서 새롭게 추가)
```
const greet = () => {
  console.log("Hey");
};
greet();  // Hey
```
- this 바인딩 방식이 다름
- 간결한 문법, 콜백에 자주 사용
---

## 1.2.2 이외에 다양한 함수들
1. 즉시 실행 함수
즉시 실행 함수는 한 번 선언하고 호출된 이후부터는 더 이상 재호출이 불가능하다. 그래서 일반적으로는 즉시 실행 함수에 이름을 붙이지 않는다.
```
(function (a, b) {
  return a + b
})(10, 24)    // 34

((a,b) => {
  return a + b
 },
)(10, 24)    // 34
```
---
2. 고차 함수
자바스크립트의 함수가 일급 객체라는 특징을 활용하면 함수를 인수로 받거나 결과로 새로운 함수를 반환시킬 수 있다. 이러한 역할을 하는 함수를 고차함수라 한다.
```
const doubledArray = [1, 2, 3].map((item) => item*2)
doubledArray  // [2, 4, 6]

const add = function (a) {
  return function (b) {
    return a + b
  }
}

add(1)(3)  // 4
```
이를 이용해 함수 컴포넌트를 인수로 받아 새로운 함수 컴포넌트를 반환하는 고차 함수를 만들 수 있다.이런 컴포넌트를 고차 함수와 유사하게 고차 컴포넌트라고 부르는데, 고차 함수 컴포넌트를 만들면 컴포넌트 내부에서 공통으로 관리되는 로직을 분리해 관리할 수 있어 효율적으로 리팩터링할 수 있다.

## 1.2.3 함수를 만들 때 주의사항
1. 함수의 부수 효과를 최대한 억제하자
2. 가능한 한 함수를 작게 만들자
3. 누구나 이해할 수 있는 이름을 붙이자

# 1.3 클래스
## 1.3.1 클래스란?
자바스크립트의 클래스란 특정한 객체를 만들기 위한 일종의 템플릿과 같은 개념으로 볼 수 있다. 즉, 특정한 형태의 객체를 반복적으로 만들기 위해 사용되는 것이 바로 클래스다.

클래스가 나오기 이전(ES6)에는 클래스라는 개념이 없어 객체를 만드는 템플릿 같은 역할을 함수가 도맡아 했었다.
```
class Car {  // Car 클래스 선언
  constructor(name) {  // 생성자, 최초에 생성할 때 어떤 인수를 받을지 결정할 수 있고 객체를 초기화하는 용도로도 사용
    this.name = name
  }
  
  honk() {  // 메서드
    console.log(`${this.name}이 경정을 울립니다.`)
  }

  static hello() {  // 정적 메서드
    console.log('저는 자동차입니다')
  }

  set age(value) {  // setter
    this.carAge = value
  }

  get age() {  // getter
    return this.carAge
  }
}

const myCar = new Car('자동차')
myCar.honk()  // 메서드 호출
Car.hello()  // 정적 메서드는 클래스로 만든 객체에서는 호출할 수 없다.

myCar.age = 32
console.log(myCar.age, myCar.name)  // 32 자동차
```

#### 상속
extends는 기존 클래스를 상속받아서 자식 클래스에서 이 상속받은 클래스를 기반으로 확장하는 개념이다.
```
class Truck extends Car {
  constructor(name) {
    super(name)
  }

  load() {
    console.log('짐을 싣습니다.')
  }
}

const myCar = new Car('자동차')
myCar.honk() // 자동차 경적을 울립니다.

const truck = new Truck('트럭')
truck.honk()  // 트럭 경적을 울립니다.
truck.load()  // 짐을 싣습니다.
```

# 1.4 클로저
리액트의 클래스 컴포넌트에 대한 이해가 자바스크립트의 클래스, 프로토타입, this에 달려있다면, 함수 컴포넌트에 대한 이해는 클로저에 달려 있다.

## 1.4.1 클로저 정의
클로저는 함수와 함수가 선언된 어휘적 환경의 조합
#### 선언된 어휘적 환경 : 변수가 코드 내부에서 어디서 선언됐는지를 말하는 것.

## 1.4.2 변수의 유효 범위, 스코프
- 전역 스코프 : 함수 밖, 즉 최상단에서 선언된 변수, 어디서든 접근 가능, 브라우저 환경에선 전역 객체 window의 프로퍼티로 등록됨 (window.globalVar)
- 함수 스코프 : **var**로 선언된 변수는 함수 내부에서만 유효
- 블록 스코프 : **let, const**는 블록(중괄호 {}) 단위로 스코프를 가짐, for, if, while, {} 내부에서 선언된 변수는 그 블록 안에서만 유효, ES6 이후 도입된 더 안전한 변수 선언 방식

## 1.4.3 클로저의 활용
```
function outerFunction() {
  var x = 'hello'
  function innerFunction() {
    console.log(x)
  }

  return innerFunction
}

const innerFunction = outerFunction()
innerFunction()   // "hello"
```
반환한 함수에는 x라는 변수가 존재하지 않지만, 해당 함수가 선언된 어휘적 환경, 즉 outerFunction에는 x라는 변수가 존재하며 접근할 수 도 있다.

따라서 같은 환경에서 선언되고 반환된 innerFunction에서는 x라는 변수가 존재하던 환경을 기억하기 때문에 정상적으로 "hello"를 출력할 수 있는 것이다.

전역 스코프는 어디서든 원하는 값을 꺼내올 수 있다는 장점이 있지만, 반대로 누구든 접근할 수 있고 수정할 수 있다는 뜻도 된다.

## 1.4.4 리액트에서의 클로저
클로저의 원리를 사용하고 있는 대표적인 것 중 하나가 바로 useState다.
```
function Component() {
  const [state, setState] = useState()

  function handleClick() {
    setState((prev) => prev + 1)
  }
}
```
useState 함수의 호출은 컴포넌트 내부 첫 줄에서 종료됐지만 클로저가 useState 내부에서 활용되었기 때문에 setState가 useState 내부의 최신 값을 확인할 수 있다.

## 1.4.5 주의점
- 메모리 누수 위험
  - 클로저는 외부 스코프를 계속 참조하기 때문에 불필요한 데이터가 가비지 컬렉션 대상이 되지 않고 메모리에 오래 남을 수 있다.
- 클로저가 오래된 값을 캡처하고 있어서 최신 상태를 반영하지 못하는 문제가 발생할 수 있다.
  - 예를 들어 `setState(state + 1)` 처럼 직접 값을 사용하는 방식은 stale closure 문제를 일으킬 수 있다. 이를 방지하려면 `setState((prev) => prev + 1)` 처럼 함수형 업데이트를 사용하는 것이 안전하다.
- 디버깅이 어려움
  - 클로저 내부 상태는 외부에서 직접 접근이 안 되기 때문에 값 추적이 어려워 디버깅이 복잡해질 수 있다.
