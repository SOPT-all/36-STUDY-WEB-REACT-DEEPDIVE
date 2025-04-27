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

# 1.5 이벤트 루프와 비동기 통신의 이해
자바스크립트는 싱글 스레드에서 작동한다.

스레드: 작업을 수행하는 실행 단위로 하나의 프로세스 안에 여러 개의 스레드가 있을 수 있다. 스레드끼리는 메모리 등 자원을 공유하기 때문에 하나의 스레드에서 문제가 생기면 다른 스레드에도 영향을 줄 수 있다.

동기: 코드가 순차적으로 실행 -> 메인 스레드에서 처리
```
console.log('A')
console.log('B')
console.log('C')
```
결과: `A B C`

비동기: 특정 작업이 나중에 실행되도록 예약됨 -> **태스크 큐**에 대기 후 처리됨

태스크 큐: 비동기 작업이 완료되면 콜백 함수가 태스크 큐에 등록된다. 메인 스레드가 한가해지면 이벤트 루프가 태스크 큐에서 콜백을 꺼내 실행한다.
```
console.log('A')

setTimeout(() => {
  console.log('B')
}, 1000)

console.log('C')
```
결과: `A C B` setTimeout은 비동기 함수로 1초 후에 B를 출력한다.

# 1.6 리액트에서 자주 사용하는 자바스크립트 문법
## 1.6.1 구조 분해 할당
- 배열 구조 분해 할당
```
const array = [1, 2, 3, 4, 5]
const [first, second, third, ...arrayRest] = array
```
useState함수에서도 이처럼 배열 구조 분해 할당된다. 첫 번째 값을 value로, 두 번째 값을 setter로 사용 가능하다.

추가로 `...arrayRest`처럼 ...을 붙인 연산을 `Rest`연산이라고 하고, 어디서부터 어디까지 할당할지 예측할 수 있는 뒤쪽에서만 사용 가능하다.
- 객체 구조 분해 할당
```
const object = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
}

const { a, b, c, ...objectRest } = object
```
이를 새로운 이름으로 다시 할당 가능하다
```
const object = {
  a: 1,
  b: 2,
}

const { a: first, b: second } = object
```

이러한 객체 구조 분해 할당 방식은 리액트 컴포넌트인 props에서 값을 바로 꺼내올 때 매우 자주 쓰는 방식이다.

단순히 값을 꺼내오는 것뿐만 아니라 변수에 있는 값으로 꺼내오는 이른바 계싼된 속성 이름 방식도 가능하다.
```
const key = 'a'
const object = {
  a: 1,
  b: 2,
}

const { [key]: a } = object
// a = 1
```
key는 a라는 값을 가지고 있는데, object에서 이 a라는 값을 꺼내오기 위해 [key] 문법을 사용했다. 이러한 계산된 속성 이름을 사용하려면 반드시 이름을 선언하는 :a와 같은 변수 네이밍이 필요하다. 그렇지 않으면 에러가 발생한다.

## 1.6.2 전개 구문
과거에 배열 간에 합성을 하려면 push(), concat(), splice() 등의 메서드를 사용해야 했다. 하지만 전개구문을 활용하면 쉽게 배열을 합성할 수 있다.
```
const arr1 = ['a', 'b']
const arr2 = [...arr1, 'c', 'd', 'e' ]
```
이처럼 ...을 붙인 연산을 `Spread`연산이라고 한다. 이러한 특징을 활용하면 기존의 배열에 영향을 미치지 않고 배열을 복사할 수 있다.

배열에서 이 `Spread`연산을 트랜스파일하면 concat() 메서드로 연결한 것을 볼 수 있다.

객체에서도 비슷하게 사용 가능하다.
```
const obj1 = {
  a: 1,
  b: 2,
}

const obj2 = {
  c: 3,
  d: 4,
}

const newObj = { ...obj1, ...obj2 }

```

## 1.6.3 객체 초기자
객체 초기자는 객체를 선언할 때 객체에 넣고자 하는 키와 값을 가지고 있는 변수가 이미 존재한다면 해당 값을 간결하게 넣어줄 수 있는 방식이다.
```
const a = 1
const b = 2

const obj = {
  a,
  b,
}

// {a: 1, b: 2}
```

## 1.6.4 map, filter, reduce, forEach
### map
인수로 전달받은 배열과 똑같은 길이의 새로운 배열을 반환하는 메서드, 리액트에서는 주로 특정 배열을 기반으로 어떠한 리액트 요소를 반환하고자 할 때 많이 사용
```
const arr = [1, 2, 3, 4, 5]
const doubledArr = arr.map((item) => item * 2)
// [2, 4, 6, 8, 10]
```
```
const arr = [1, 2, 3, 4, 5]
const Elements = arr.map((item) => {
  return <Fragment key={item}>{item}</Fragment>
})
```

### filter
콜백 함수를 인수로 받고 콜백 함수에서 truthy 조건을 만족하는 경우에만 해당 원소를 반환하는 메서드
```
const arr = [1, 2, 3, 4, 5]
const evenArr = arr.filter((item) => item % 2 === 0)
// [2, 4]
```

### reduce
콜백 함수와 함께 초깃값을 추가로 인수를 받음, 초깃값에 따라 배열이나 객체, 또는 그 외의 다른 무언가를 반환할 수 있는 메서드
```
const arr = [1, 2, 3, 4, 5]
const sum = arr.reduce((result, item) => {
  return result + item
}, 0)
// 15
```
여기서 0은 reduce의 결과를 누적할 `초깃값`이다. result는 선언한 초깃값의 `현재값`을 의미. item은 현재 배열의 `아이템`을 의미 즉, 콜백의 반환값을 계속해서 초깃값에 누적하면서 새로운 값을 만든다.

filetr + map 조합 `vs` reduce
```
const arr = [1, 2, 3, 4, 5]
const result = arr.filter((item) => item % 2 === 0).map((item) => item * 100)
const reuslt2 = arr.reduce((result, item) => {
  if (item % 2 === 0) {
    result.push(item * 100)
  }
  return result
}, []
```
위 코드는 짝수만 100을 곱해 반환한다. filter와 map의 조합이 훨씬 가독성이 좋지만 같은 배열에 대해 두 번 순회하는 문제가 있으므로 상황에 맞게 선택하면 좋다.

### forEach
콜백 함수를 받아 배열을 순회하면서 단순히 그 콜백 함수를 실행하기만 하는 메서드, forEach는 아무런 반환값이 없다. 콜백 함수만 실행할 뿐, map과 같이 결과를 반환하는 작업은 수행하지 않는다. 즉, 콜백 함수 내부에서 아무리 반환해도 모두 의미 없는 값이 된다.

forEach의 반환값은 `undefined`로 의미가 없다.

추가로 forEach는 실행되는 순간 에러를 던지거나 프로세스를 종료하지 않는 이상 이를 멈출 수 없다. (break, return 도 안됨)

## 1.6.5 삼항 조건 연산자
```
const value = 10
const result = value % 2 === 0 ? '짝수' : '홀수'
```
`?` 뒤에는 참일 경우 반환할 값, `:` 뒤에는 거짓일 때 반환할 값을 저장한다.

삼항 조건 연산자는 React JSX 내부에서 조건부로 렌더링하기 위해서 가장 널리 쓰이는 방법이다.
```
const Component = ({condition}) => {
  return <>{condition ? '참' : '거짓'}</>
```
삼항 연산자는 가급적이면 중첩해서 쓰지 않는 편이 좋다.

# 1.7 타입스크립트
동적 언어인 자바스크립트에서 런타임에만 타입을 체크할 수 있는 한계를 극복해 코드를 더욱 안전하게 작성하면서도 잠재적인 버그도 크게 줄일 수 있는 기회를 얻을 수 있다. 
## 1.7.1 타입스크립트란?
- 자바스크립트 문법에 타입을 가미한 것.
- 자바스크립트는 동적 타입의 언어이기 때문에 대부분의 에러를 코드를 실행했을 때만 확인할 수 있다는 문제점이 있다.
```
function test(a, b) {
  return a / b;
}

test(5, 2)    // 2.5
test('안녕하세요', '하이')    // NaN
```
함수를 사용하는 개발자가 원하지 않는 결과(또는 함수를 제공하는 측에서 원치 않는 결과)를 만들어낼 수 있다. 자바스크립트에서 타입을 체크해서 이러한 문제를 방지할 수 있지만 typeof를 적용해서 일일이 체크하는 것은 너무 번거롭고 코드의 크기도 과도하게 키우게 된다.

타입스크립트는 이러한 자바스크립트의 한계를 벗어나 타입 체크를 정적으로 런타입이 아닌 빌드(트랜스파일) 타임에 수행할 수 있게 해준다.
```
function test(a: number, b: number) {
  return a / b
}
```
타입스크립트로 작성된 파일은 결국 자바스크립트로 변환돼서 Node.js나 브라우저 같은 자바스크립트 런타임 환경에서 실행되는 것이 목표이다.

## 1.7.2 타입스크립트 활용법
### any대신 unknown을 사용
any는 정말로 불가피할 때만 사용해야 하는 타입이다. 따라서 typeof를 사용해서 unknown에 직접 접근하는 대신 해당 unknown 값이 우리가 원하는 탕비일 때만 의도대로 작동하도록 해야한다. unknown을 사용하는 것은 예상치 못한 타입을 받아들일 수 있음은 물론, 사용하는 쪽에서도 더욱 안전하게 쓸 수 있다.

### 타입 가드
- instanceof: 지정한 인스턴스가 특정 클래스의 인스턴스인지 확인할 수 있는 연산자
- typeof: 특정 요소에 대해 자료형을 확인
- in: property in object로 사용, 주로 어떤 객체에 키가 존재하는지 확인하는 용도로 사용

### 제네릭
제네릭(generic)은 함수나 클래스 내부에서 단일 타입이 아닌 다양한 타입에 대응할 수 있도록 도와주는 도구이다. 제네릭을 사용하면 타입만 다른 비슷한 작업을 하는 컴포넌트를 단일 제네릭 컴포넌트로 선언해 간결하게 작성할 수 있다.

### 인덱스 시그니처
인덱스 시그니처란 객체의 키를 정의하는 방식
