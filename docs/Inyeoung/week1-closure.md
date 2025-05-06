# 01. 리액트 개발을 위해 꼭 알아야 할 자바스크립트 - 클로저

클로저는 함수를 일급 객체로 취급하는 javascript를 포함한 프로그래밍 언어에서 사용되는 중요한 특성이다. 

MDN에서 정의하는 클로저의 개념은 다음과 같다.

**"클로저는 함수와 그 함수가 선언된 렉시컬 환경과의 조합이다."**

그렇다면 여기서 렉시컬 환경이 뭔지 잠깐 짚고 넘어가보자.

---


### 🔎 렉시컬 스코프

javascript 엔진은 함수가 어디서 호출했는지가 아닌, **함수를 어디에 정의했는지에 따라 상의 스코프를 결정한다.**

이를 렉시컬 스코프(=정적 스코프)라고 합니다. 함수의 상위 스코프는 함수를 정의한 위치에 의해 정적으로 결정되고, 변하지 않는다.

예를 들어 다음의 코드를 보면

```jsx
const x = 1;

function outerFunc() {
	const x = 10;

    function innerFunc() {
    	console.log(x);// 10
	}

    innerFunc();
}

outerFunc();
```

outerFunc 함수 내부에서 중첩 함수 innerFunc가 정의되고 호출된 것을 확인할 수 있다.

이때 중첩 함수 innerFunc이 정의된 상위 스코프는 outerFunc의 스코프입니다. 즉, 렉시컬 스코프가 outerFunc 이 된다.

따라서 중첩 함수 innerFunc 내부에서 자신을 포함하고 있는 외부함수 outerFunc 의 x 변수에 접근할 수 있다.

이를 통해 렉시컬 환경은 자신의 외부 렉시컬 환경에 대한 참조를 통해 상위 렉시컬 환경과 연결되게 됩니다. 이를 **스코프 체인**이라고 한다.

```
const a = 1;

function outer() {

  function inner() {
    console.log(a);// 1
  }

  return inner;
}

const fn = outer();
fn();// 여기서 inner() 호출
```

위의 코드에서 inner()가 a를 접근할 수 있는 이유는 무엇일까?

inner함수는 자신이 정의된 위치인 스코프 (= outer)를 기억한다. outer는 a를 포함한 전역 스코프를 기억한다.

이렇게 스코프가 계층적으로 연결된 것을 스코프 체인이라고 한다.

즉.. 상자로 비유하면, 함수 정의한다는 것은 함수를 상자에 넣고, 이 상자는 해당 함수를 둘러싼 환경을 기억한다. 함수를 호출할 시 기억해둔 위치에서 사용할 수 있는 변수를 체인처럼 따라가서 사용할 수 있게 된다.

따라서, 렉시컬 환경의 외부 렉시컬 환경에 대한 참조에 저장할 참조값, 즉 상위 스코프에 대한 참조는 함수 정의가 평가되는 시점에 함수가 정의된 환경(위치)에 의해 결정되며, 이것이 렉시컬 스코프이다.
___

### 🔎 함수 객체의 내부 슬롯 [[ Environment ]]

함수가 호출되는 위치와 정의된 위치가 다를 수 있다. 따라서 위와 같은 렉시컬 스코프 개념이 가능하려면, 함수는 **자신이 정의된 환경**인 **상위 스코프**를 기억해야 한다. 이를 위해 함수는 자신의 내부 슬롯 [[ Environment ]] 에 자신이 정의된 환경, 즉 상위 스코프의 참조를 저장한다. 이때 자신의 내부 슬롯 [[ Environment ]] 에 저장된 상위 스코프의 참조는, 현재 실행 중인 실행 컨텍스트의 렉시컬 환경을 가르킨다. javascript는 코드가 실행되는 순간 마다 어떤 스코프에서 실행 중인지를 추적하는데, 이 실행 중인 공간에 대해 제공할 환경 정보들을 모아놓은 객체를 **실행 컨텍스트**라고 한다. 이때 실행 컨텍스트의 렉시컬 환경이 해당 함수의 렉시컬 환경이 되기 때문에 이 정보를 [[ Environment ]] 에 저장하게 되는 것이다.

위의 코드를 예시로 들면, inner()가 정의될 때 이 함수의 내부 슬롯 [[ Enviroment ]]에 변수 a에 대한 정보를 담아 놓게 된다.

---

### 🔎 클로저와 렉시컬 환경

클로저의 배경이 되는 지식들을 알아보았으니, 이제 클로저의 개념에 대해 알아보자.

```
const x = 1;

// ①function outer() {
  const x = 10;
  const inner = function () { console.log(x); };// ②return inner;
}

// outer 함수를 호출하면 중첩 함수 inner를 반환한다.// 그리고 outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 pop 되어 제거된다.const innerFunc = outer();// ③
innerFunc();// ④ 10
```

outer 함수를 호출하면, outer 함수는 inner 함수를 반환하고 생명 주기를 마감한다.

이때, outer 함수의 지역 변수 x 또한 생명 주기를 마감한다. 이에 따라 outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 제거되지만, **outer 함수의 렉시컬 환경까지 소멸하지는 않는다. outer 함수의 렉시컬 환경은 inner 함수의 [[ Environment ]] 내부 슬롯에 의해 참조되고 있고, inner 함수는 innerFunc 에 의해 참조되고 있으므로, 가비지 컬렉션의 대상이 되지 않기 때문이다.** 가비지 컬렉터는 누군가가 참조하고 있는 메모리 공간을 함부로 해제하지 않는다. 따라서 이미 생명주기를 다 해 종료되어 실행 컨텍스트에서 제거된 outer 함수의 지역변수 x 값이 10이 동작할 수 있게 된다.

> 이와 같이 외부 함수보다 중첩 함수가 더 오래 유지되는 경우, 중첩 함수는 이미 생명 주기가 종료한 외부 함수의 변수를 참조할 수 있습니다. 이러한 중첩 함수를 **클로저**라고 부른다.
> 
> 
> **함수는 자신이 정의될 때의 렉시컬 환경을 기억하여, 외부 함수의 실행이 끝난 이후에도 외부 함수 변수에 접근할 수 있도록 하는 기능이 클로저이다.**
> 

javascript의 모든 함수는 상위 스코프를 기억하므로 이론적으로 모든 함수는 클로저이지만, 일반적으로 모든 함수를 클로저라고 하지 않는다. 일반적으로 클로저는 그보다 더 좁은 범위로, **중첩 함수가 상위 스코프의 식별자를 참조하고 있고, 중첩 함수가 외부 함수가 더 오래 유지되는 경우**를 의미한다.

### 🔎 클로저의 활용

클로저는 상태를 안전하게 변경하고 유지하기 위해 사용한다. 즉, **상태가 의도치 않게 변경되지 않도록 상태를 안전하게 은닉**하고, **특정 함수에게만 상태 변경을 허용하기 위해** 사용한다.

```
// 카운트 상태 변수let num = 0;

// 카운트 상태 변경 함수const increase = function () {
// 카운트 상태를 1만큼 증가 시킨다.return ++num;
};

console.log(increase());// 1console.log(increase());// 2console.log(increase());// 3
```

위의 코드는 다음과 같은 이유로 오류를 발생시킬 가능성을 내포하고 있는 좋지 않는 코드이다.

먼저 num의 카운트 상태는 increase 함수가 호출되기 전까지 변경되지 않고 유지되어야 한다.

이를 위해 num의 카운트 상태는 increase 함수만이 변경할 수 있어야 한다.

하지만, 카운트 상태는 전역 변수를 통해 관리되고 있기 때문에 의도치 않게 상태가 변경될 수 있다.

따라서 increase 함수만이 num 변수를 참조하고 변경할 수 있도록, **전역변수 num을 increase 함수의 지역변수로 바꾸고 클로저를 사용해 주는 것이 바람직하다.**

```
const increase = function () => {
// 카운트 상태 변수let num = 0;

// 카운트 상태를 1만큼 증가시킨다.return ++num;
};

console.log(increase());// 1console.log(increase());// 1console.log(increase());// 1
```

하지만 위와 같이 num을 지역 변수로 만들면 increase 함수가 호출될 때마다 다시 선언되고 0으로 초기화 되는 문제가 발생한다. 다시 말해, 상태가 변경되기 이전 상태를 유지하지 못하게 된다. 이전 상태를 유지할 수 있도록 클로저를 사용해보자.

```
const increase = (function () {// 즉시 실행 함수// 카운트 상태 변수let num = 0;

// 클로저return function () {
// 카운트 상태를 1만큼 증가 시킨다.return ++num;
  };
}());

console.log(increase());// 1console.log(increase());// 2console.log(increase());// 3
```

위 코드가 실행되면 즉시 실행 함수가 호출되고 즉시 실행 함수가 반환한 함수가 increase 변수에 할당된다.

increase 변수에 할당된 함수는 자신이 정의된 위치에 의해 결정된 상위 스코프인 즉시 실행 함수의 렉시컬 환경을 기억하는 클로저이다.

즉시 실행 함수는 호출된 이후 즉시 소멸되지만 즉시 실행 함수가 반환한 클로저는 increase 변수에 할당되어 호출된다. 이때 즉시 실행 함수가 반환한 클로저는 상위 스코프인 즉시 실행 함수의 렉시컬 환경( let num = 0; 이 있던 환경 )을 기억하기 때문에, 클로저는 num을 언제 어디서 호출하든지 참조하고 변경할 수 있게 된다.

즉시 실행 함수는 한 번만 실행되므로 increase가 호출될 때마다 num 변수가 더 초기화될 일은 없다. 또 num 변수는 외부에서 직접 접근할 수 없는 은닉된 private 변수이므로 전역 변수를 사용했을 때와 같이 의도되지 않은 변경에 의한 부수 효과를 억제할 수 있다.

다음은 함수형 프로그래밍에서 클로저를 활용하는 간단한 예제이다.

```
// 함수를 반환하는 고차 함수// 이 함수는 카운트 상태를 유지하기 위한 자유 변수 counter를 기억하는 클로저를 반환한다.const counter = (function () {
// 카운트 상태를 유지하기 위한 자유 변수let counter = 0;

// 함수를 인수로 전달받는 클로저를 반환return function (aux) {
// 인수로 전달 받은 보조 함수에 상태 변경을 위임한다.
    counter = aux(counter);
    return counter;
  };
}());

// 보조 함수function increase(n) {
  return ++n;
}

// 보조 함수function decrease(n) {
  return --n;
}

// 보조 함수를 전달하여 호출console.log(counter(increase));// 1console.log(counter(increase));// 2// 자유 변수를 공유한다.console.log(counter(decrease));// 1console.log(counter(decrease));// 0
```

---

### 🔎 리액트에서의 클로저

클로저의 원리를 사용하고 있는 대표적인 것 중 하나가 `useState`이다.

```jsx
function Component() {
	const [state, setState] = useState() 
	
	function handleClick() {
	// usestate 호출은 위에서 끝났지만,
	// setstate는 계속 내부의 최신값(prev)을 알고있다.
	// 이는 클로저를 활용했기 때문에 가능하다. 
		setState((prev) >= prev + 1)
}
// ....
}
```

useState 함수 호출은 Component 내부 첫 줄에서 종료됐는데, setState는 useState 내부의 최신값(prev)을 어떻게 계속해서 최신 값을 알고 있는 것일까? 

이는 클로저가 활용되었기 때문이다.

setState는 외부함수(useState)로부터 반환된 내부함수이다. 여기서 내부함수 setState는 자신이 선언된 외부함수(useState)가 선언된 환경, state가 저장되어있는 곳을 기억하기 때문에 state 값을 다룰 수 있는 것이다.


---
### 🔎 주의할 점

- 의도치않은 클로저의 사용
    
    ```jsx
    for (var i = 0; i < 5; i++) {
      setTimeout(() => console.log(i), i * 1000);
    }
    ```
    
    위의 코드는 0부터 시작해 1초 간격으로 console.log를 0, 1, 2, 3, 4를 차례대로 출력하는 것을 의도로 한다. 하지만 실제로 0, 1, 2, 3, 4초 뒤에 5만 출력된다. 왜냐하면 var는 함수 레벨 스코프를 가지기 때문에, for문을 돌 때마다 새로 스코프가 생기지 않고 최종적으로 i=5가 된 값만 남는다.  
      
    <br>
    <br>
- 클로저의 비용 문제
    
    일반 함수는 클릭과 동시에 선언, 작업 모두 스코프 내에서 끝난다. 
    
    ```jsx
    const aButton = document.getElementById('a');
    
    // 일반적인 함수
    function heavyJob() {
      const longArr = Array.from({ length: 10_000_000 }, (_, i) => i + 1);
      console.log(longArr.length); // 10000000 출력
    }
    
    // 클릭할 때마다 heavyJob 실행
    aButton.addEventListener('click', heavyJob);
    ```
    
    예로 위의 일반 함수 `heavyJob()`을 클릭할 때마다 `longArr`를 새로 생성한다. `longArr`는 함수 내부 지역 변수이므로, 함수 실행이 끝나면 GC에 의해 메모리에서 해제된다.
    <br>

    즉, **생성 → 사용 → 바로 소멸하는 구조**를 가지고 있다.
    <br>

    반면, 클로저가 선언된 순간 내부 함수는 외부 함수의 선언적 환경을 기억하고 있어야 하므로, 이를 어디에서 사용하는지 여부에 관계없이 메모리에 저장해둔다.
    
    ```jsx
    const bButton = document.getElementById('b');
    
    // 클로저를 이용한 함수
    function heavyJobWithClosure() {
      const longArr = Array.from({ length: 10_000_000 }, (_, i) => i + 1);
      
      // 내부 함수를 반환하면서 longArr를 기억
      return function () {
        console.log(longArr.length); // 10000000 출력
      };
    }
    
    // 클릭 이벤트 등록
    const innerFunc = heavyJobWithClosure();
    bButton.addEventListener('click', function () {
      innerFunc();
    });
    
    ```
    
    `heavyJobWithClosure()`는 호출되자마자  10,000,000개짜리 배열의 `longArr`를 메모리에 올린다. 그리고 `innerFunc` 이라는 내부 함수가 `longArr`를 참조하고 있기 때문에, 참조되고 있는 한 longArr는 이벤트 클릭 여부와 상관없이 메모리에 남아있게 된다. 
    <br>
      
    즉, **이벤트 발생 여부와 관계없이 메모리에 계속 남아있게 된다.**
     <br>
    
    이와 같이 클로저는 꼭 필요한 작업에만 남겨두지 않는다면 메모리를 불필요하게 잡아먹는 결과를 야기할수있고, 마찬 가지로 클로저 사용을 적절한 스코프로 가둬두지 않는다면 성능에 악영향을 미칠 수 있다. 
    <br>
    따라서 클로저를 사용할 때는 주의가 필요하다.