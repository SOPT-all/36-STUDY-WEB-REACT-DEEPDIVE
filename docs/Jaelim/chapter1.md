### 웹 36기 이재림

---

# 1.1장 데이터 타입과 동등 비교

### 자바스크립트 데이터 타입

1. 원시 타입

   - undefined : 선언은 했는데 값 할당이 안돼서 자동 할당됨
   - null : 명시적으로 빈 값임
   - boolean : 걍 true, false. 근데 이것 말고도 truthy,falsy함을 나타낼 값들이 있음
   - number : 진수 값 알아서 해석됨
   - bigint
   - string : 한번 만들어진 문자열은 직접 변경 불가, 백틱 (템플릿 리터럴)
   - symbol : 심벌함수 이용해서만 생성 가능 (고유 값)

2. 객체 타입

   배열, 함수, 정규식 등

   == 참조 타입이라고도 불림 : 객체를 변수에 할당하면 변수(확보된 메모리 공간)에는 **참조 값이 저장**된다. 참조 값은 생성된 객체가 저장된 **메모리 공간의 주소**
   ![image.png](attachment:a603e47a-7535-4798-9bfb-28f31d4702b2:image.png)

### 동등비교

=== / == / [Object.is](http://Object.is) (이게 좀더 명료함) ex) `Object.is(a,b)`

리액트에서는 → `import is from ‘./objectIs’` 로 비교 사용 ex) `is(A,B)`

이때, Object.is에서는 객체 간을 비교하긴 어렵지만 리액트 is로는 가능!

이 is로도 판별 불가한게 있음 **(얕은 비교)** 그 이후 depth비교는 별도 로직에서 수행

완벽하게 비교하고자 구현됐다면,, 아마 성능 악화됐을거심

# 1.2장 함수

하나의 블록 단위

‘문’ statement, ‘표현식’ 산출 구문

## 1. 함수 선언문

```jsx
function add() {}
```

## 2. 함수 표현식

함수와 같은 일급 객체는 변수에 할당 ㄱㄴ

```jsx
const sum = function (a, b) {};
```

### ++ 함수선언문 vs 함수표현식

- **호이스팅 차이**

선언문 : 함수 호이스팅으로, 함수 실행 전에 미리 메모리에 등록됨. 그래서 어디서든 호출 ㄱㄴ

표현식 : 호이스팅이 되긴 하는데, 이 변수 호이스팅은 런타임에 할당되어 작동, 먼저 호출 시 undefined

## 3. Function 생성자

```jsx
const add = new Function("a", "b", "return a+b");
```

되게에에에 물편함. 잘 안 쓰임

### 4. 화살표 함수

```jsx
const add = (a, b) => {};
```

**앞의 함수 생성 방식과 차이**

1. constructor 사용 불가 ex) `const myAdd = new Add()`
2. arguments 없음
3. this 바인딩 : 별도 작업 없이 바로 상위 스코프의 this를 따름

### ++ 함수 사용 방식

(1) 즉시 실행 함수

한번 선언하고 호출 이후엔 재사용 불가함 (리팩토링에도 도움이 됨)

```jsx
(function (a, b) {
  return a + b;
})(10, 24);
```

(2) 고차 함수
![image.png](attachment:d6e84f8d-afc1-40fe-9ae7-0ad23d9d3485:image.png)
![image.png](attachment:2f8ce44a-0002-4cb9-97df-532ce22b59db:image.png)

### ++ 함수 생성 시 주의 사항

1. 부수 효과를 최대한 억제하라

   부수효과? : API 호출, console.log, HTML문서 수정 등의 외부에 영향

   → 즉, useEffect도 부수 효과 처리 함수이므로 얘도 최소화 하는 게 안정성 있음

2. 함수를 가능한 작게 만들기

   한 함수 당 하나의 기능만. 그래야 재사용성이 높아짐

3. 누구나 이해가능한 이름 붙이기

# 1.3장 클래스

### 클래스 구성

- constructor : 생성자, 오직 하나만(없어도 ㄱㅊ), 최초에 생성 시 어떤 인수를 받을 지 결정
  ```jsx
  class Car {
    constructor(name) {
      this.name = name;
    }
  }
  ```
- 프로퍼티

  클래스로 인스턴스를 생성할 때 내부로 넘기는 프로퍼티 값

  ```jsx
  const myCar = new Car("자동차");
  // => 내부에서 name으로 등록됨
  ```

- getter 와 setter

  getter : 클래스에서 값을 가져올 때

  setter : 클래스에 값을 할당할 때

  ```jsx
  class Car {
    constructor(name) {
      this.name = name;
    }

    get first() {
      // 내보내기
      return this.name[0];
    }
    set first(char) {
      // 할당해주기
      this.name = [char, ...this.name.slice(1)].join("");
    }
  }

  const myCar = new Car("자동차");
  myCar.first; // 자
  myCar.first = "아";
  console.log(myCar.name); // 아동차
  ```

- 인스턴스 메서드 : 클래스 내부의 함수

  프로토타입 체이닝

  ```jsx
  class Car {
    constructor(name) {
      this.name = name;
    }

    hello() {
      console.log(this.name);
    }
  }

  const myCar = new Car("자동차");
  myCar.hello(); // 자동차
  ```

- 정적 메서드
  얘는 static이 앞에 붙는 함수
  → 밖에서 myCar.hello()이렇게 호출이 안됨 (인스턴스 생성 없어도 됨)
  → Car.hello() 클래스 자기 자신에서만 사용 가능
  → this로도 접근 불가
- 상속
  extends사용해서 기존 클래스를 상속 받아서 자식 클래스에서 이 상속 받은 클래스 기반으로 확장
  ```jsx
  class Car {
  	.
  	.
  	honk(){
  		console.log(this.name)
  	}
  }

  class Truck extends Car{
  	constructor(name){
  		super(name) // car의 contructor 호출
  	}
  }
  const truck = new Truck('트럭')
  truck.honk() // honk함수 실행 가능
  ```

### 클래스 작동은 생성자 함수와 유사하게 재현 가능

```jsx
var Car = (function(){
	function Car(name){ this.name = name}}

	Car.prototype.honk = function(){
		console.log()}

	return Car
}
```

# 1.4장 클로저

클로저 : 함수와 함수가 선언된 어휘적 환경의 조합

### 스코프 : 변수의 유효범위

### 1. 전역 스코프

![image.png](attachment:658b0ed3-33f8-4305-8892-8f765c099cc7:image.png)

### 2. 함수 스코프

js는 기본적으로 함수 레벨 스코프를 가짐(그래서 if에서의 변수선언 또한 global임)

하지만, 함수 내부에서는 가장 가까운 스코프 기준으로 값 가져옴

### 클로저의 활용

![image.png](attachment:0437d81c-06a0-400c-9604-65b8018b4b31:image.png)

1. 변수 counter에 직접 노출을 없애서 직접 수정 막음
2. 변수의 업데이트를 increase, decrease로 제한해서 무분별한 변경 막음 (원하는 방향의 수정만 ㄱㄴ)

### 리액트에서의 클로저 ⇒ useState

![image.png](attachment:6c0f3f35-f694-4808-a64a-0324e4ea61fd:image.png)

### 개 큰 문제들

(1) 잘못 사용하면 다른 결과 나옴, 제대로! 실행해야함

ex) var사용해서 반복문 setTimeout 돌리면, i자체가 for문 상관없이 전역 스코프에 등록. 그래서 setTiemout 실행할때 이 전역레벨 i는 이미 업데이트 돼있슴

→ let으로 블록레벨 스코프로 변경, setTimeout실행 때에도 유효하도록

→ setTimeout안에 클로저를 넣으면, for문 실행마다 함수가 생성,실행되고 고유한 스코프가 생김

(2) 메모리 용량에 영향 미침

불필요한 메모리 잡아먹음, 적절한 스코프로 안 가두면 악영향
![image.png](attachment:47385d0d-706f-4542-88ab-7869eb330c1a:image.png)

# 1.5장 이벤트 루프와 비동기 통신

js는 기본적으로 한번에 하나의 작업만 처리하는 동기 방식임 (싱글 스레드)

근데 애플리케이션 개발하다 보면, 비동기 작업도 요구됨 (API 요청이나 검색 중 다른 걸 하는 등)

### 우선 왜 싱글스레드?

동시에 작업하면 **동시성 문제 발생!**

여러 스레드가 DOM을 조작하게 된다면 → 개 큰 이슈, 타이밍 이슈 발생할 것임

### 근데 어떻게 비동기를 지원?

### ⇒ 이벤트 루프를 이해하자!

![image.png](attachment:7ed4265d-2c3c-4c64-8d3b-97f143cfea0c:image.png)

- 호출 스택 : js에서 수행할 코드나 함수를 순차적으로 담아두는 스택
  각 함수들이 스택 내에 들어가게 되면서, 함수 실행하며 스택 밖으로 빠져나옴
- 이벤트 루프 : 호출 스택이 비어 있는 지 확인 하는 것! 비어있으면, 태스크 큐의 작업을 넣어줌
- 태스크 큐 : set형태로, 비동기 함수의 콜백이나 이벤트 등을 넣어둠

### 태스크 큐 vs 마이크로 태스크 큐

태스크 큐 : 비동기 함수 ex) setInterval, setTimeout

마이크로 태스크 큐 : 태스크 큐보다 우선권 가짐 ex) Promise

즉, 마이크로 태스크 큐가 빌 때까지 기존 태스크 큐 실행 밀려남

### 렌더링 시기

태스크 큐만 순차적으로 렌더링

++ 브라우저에서 렌더링하는 작업은 마이크로큐와 태스크 큐 사이
ex) window.requestAnimationFrame()
![image.png](attachment:4314af70-dff2-4016-8661-900e9a9aa22d:image.png)
