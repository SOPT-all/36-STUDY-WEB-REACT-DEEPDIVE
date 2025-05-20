# 03장. 리액트 훅 깊게 살펴보기

## 3.1 리액트의 모든 훅 파헤치기

훅은 state, ref 등 리액트의 핵심 기능을 함수에서도 가능하게 했고, 간결하게 작성할 수 있다.

### 3.1.1 useState

useState는 함수 컴포넌트 내부에서 상태를 정의하고, 이 상태를 관리할 수 있게 해주는 훅이다.

```ts
import { useState } from "react";

const [state, setState] = useState(initialState);
```

useState의 인수로는 사용할 state의 초깃값을 넘겨주는데 아무런 값을 넘겨주지 않으면 초깃값은 undefined다.
useState 훅의 반환값은 배열로 첫 번째 원소는 state 값 자체를 사용할 수 있고, 두 번째 원소인 setState 함수로 해당 state 값을 변경할 수 있다.
함수 컴포넌트는 매번 함수를 실행해 렌더링이 일어나고, 함수 내부의 값은 함수가 실행될 때마다 다시 초기화한다.

**게으른 초기화**
일반적으로는 useState()의 인수로 원시값을 넣는 경우가 대부분이지만 특정값을 넘기는 함수를 인수로 넣어줄 수도 있는데 이것을 게으른 초기화라고 한다.
```ts
const [count, setCount] = useState(
  Number.parseInt(window.localStorage.getItem(cacheKey)),
)

// 게으른 초기화
const [count, setCount] = useState(() => 
  Number.parseInt(window.localStorage.getItem(cacheKey)),
)
```
게으른 초기화 함수는 오로지 state가 처음 만들어질 때만 사용된다.
만약 이후에 리렌더링이 발생하면 이 함수의 실행은 무시된다.
localStorage나 sessionStorage에 대한 접근, map, filter, fined 같은 배열에 대한 접근이나 초깃값 계산을 위한 함수 호출이 필요할 때처럼 무거운 연산을 포함해 실행 비용이 많이 드는 경우에 사용하는 게 좋다.

### 3.1.2 useEffect

useEffect는 애플리케이션 내 컴포넌트의 여러 값을 활용해 동기적으로 부수 효과를 만드는 메커니즘이다.
이 부수 효과가 어떤 상태값과 함께 실행되는지가 중요!

```ts
function Component(){
  // ...
  useEffect(() => {

  }, [props, state])
  // ...
}
```
첫 번째 인수로는 실행할 부수 효과가 포함된 함수를, 두 번째 인수로는 의존성 배열을 전달한다.
의존성 배열은 생략도 가능하다.
의존성 배열이 변경될 때마다 useEffect의 첫 번째 인수인 콜백을 실행한다.

```ts
function Component() {
  const couter = 1

  useEffect(() => {
    console.log(counter) // 1, 2, 3, 4...
  })
  //...
  return (
    <>
      <h1>{counter}</h1>
      <button onClick={handleClick}>+{/button}
    </h1>
  )
}
```
위 코드에서는 리렌더링이 발생하면 console.log(counter)가 실행된다.

useEffect는 값의 변화를 관찰하는 게 아니라 렌더링할 때마다 의존성에 있는 값이 이전과 다른 게 하나라도 있으면 부수 효과를 실행하는 평범한 함수이다.
→ useEffect는 state과 props의 변화 속에서 일어나는 렌더링 과정에서 실행되는 부수 효과 함수

**클린업 함수의 목적**
일반적으로 클린업 함수는 이벤트를 등록하고 지울 때 사용한다고 알려져 있다.
useEffect에서 이벤트 리스너를 추가하면 컴포넌트가 언마운트되거나 리렌더링될 때 이전 이벤트를 정리해 줘야 한다.
```ts
function testClick() {
  useEffect(() => {
    const handleClick = () => {
      console.log('클릭!');
    };
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
}
```
useEffect는 컴포넌트가 마운트될 때 실행되고 의존성 배열이 비어 있지 않거나 생략되면 업데이트 때도 다시 실행된다.
이때 이전 addEventListener가 제거되지 않으면 이벤트 리스너가 계속 누적돼서 click할 때마다 로그가 여러 번 찍히는 문제가 발생한다.
클린업 함수는 이런 문제를 방지하기 위해 이전 효과를 제거해 주는 역할을 한다.

**의존성 배열**
의존성 배열은 보통 빈 배열을 두거나 아예 아무런 값도 넘기지 않거나 원하는 값을 넣어줄 수 있다.
빈 배열을 두면 최초 렌더링 직후에 실행된 다음부터는 더 이상 실행되지 않는다.
아무런 값도 넘겨주지 않으면 의존성을 비교할 필요 없이 렌더링할 때마다 실행이 필요하다고 판단해 렌더링이 발생할 때마다 실행된다.
```ts
// 1번
function Component() {
  console.log('렌더링됨')
}
// 2번
function Component() {
  useEffect(() => {
    console.log('렌더링됨')
  })
}
```
useEffect는 컴포넌트 렌더링이 완료된 후 실행된다. 반면 1번처럼 함수 내부에서의 직접 실행은 컴포넌트가 렌더링되는 도중에 실행되기 때문에 서버 사이드 렌더링의 경우 서버에서도 실행된다. 이 작업은 함수 컴포넌트의 반환을 지연시키는데 무거운 작업일 경우 렌더링을 방해하기 때문에 성능에 악영향을 미칠 수 있다.
→ useEffect는 컴포넌트가 렌더링된 후 어떤 부수 효과를 일으키고 싶을 때 사용하는 훅

**useEffect 사용할 때 주의할 점**
useEffect를 잘못 사용하면 예기치 못한 버그가 발생할 수 있다.
- eslint-disable-line react-hooks/exhaustive-deps 주석 자제하기
이 ESLint 룰은 useEffect 인수 내부에서 사용하는 값 중 의존성 배열에 포함돼 있지 않은 값이 있을 때 경고를 발생시킨다.
```ts
useEffect(() => {
  console.log(props)
}, []) // eslint-disable-line react-hooks/exhaustive-deps
```
이 코드는 빈 배열 []을 의존성으로 할 때, 즉 컴포넌트를 마운트하는 시점에만 무언가를 하고 싶다는 의도로 작성되곤 하는데 이건 클래스 컴포넌트의 생명주기 메서드인 componentDidMount에 기반한 접근법으로 가급적이면 사용해선 안 된다.
의존성 배열을 넘기지 않은 채 콜백 함수 내부에서 특정 값을 사용한다는 것은 이 부수 효과가 실제로 관찰해서 실행돼야 하는 값과는 별개로 작동한다는 것을 의미한다.
즉, 컴포넌트의 어떤 값의 변경과 useEffect의 부수 효과가 별개로 작동하게 된다는 것으로 콜백 함수의 실행과 내부에서 사용한 값의 실제 변경 사이에 연결 고리가 끊어져 있다는 것이다.
→ useEffect에 빈 배열을 넘기기 전에는 정말 useEffect의 부수 효과가 컴포넌트의 상태와 별개로 작동해야만 하는지, 여기서 호출하는 게 최선인지 검토해야 한다

**useEffect의 첫 번째 인수에 함수명 부여하기**
useEffect를 사용하는 많은 코드에서 첫 번째 인수로 익명 함수를 넘겨준다.
```ts
useEffect(() => {
  logging(user.id)
}, [user.id])
```
useEffect 수가 적거나 복잡성이 낮을 때는 큰 문제가 없지만 useEffect 코드가 복잡하고 많아질수록 무슨 일을 하는 코드인지 파악하기 어려워지기 때문에 익명 함수가 아닌 기명 함수로 바꾸는 것이 좋다.
```ts
useEffect(
  function logActiveUser() {
    logging(user.id)
  }, 
  [user.id],
)
```

**거대한 useEffect 만들기 않기**
useEffect는 렌더링 시 의존성이 변경될 때마다 부수 효과를 실행한다. 부수 효과는 크기가 커질수록 애플리케이션 성능에 악영향을 미친다.
가능한 한 useEffect는 간결하고 가볍게 유지하는 것이 좋다.

**불필요한 외부 함수 만들지 않기**
useEffect가 실행하는 콜백이 불필요하게 존재해서는 안 된다.
useEffect 내에서 사용할 부수 효과라면 내부에서 만들어 사용하는 게 훨씬 도움이 된다.

### 3.1.3 useMemo

useMemo는 비용이 큰 연산에 대한 결과를 저장(메모이제이션)해 두고, 이 저장된 값을 반환하는 훅이다.
```ts
import { useMemo } from 'react'

const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b])
```
첫 번째 인수로는 어떤 값을 반환하는 생성 함수, 두 번째 인수로는 해당 함수가 의존하는 값의 배열을 전달한다.
useMemo는 렌더링 발생 시 의존성 배열의 값이 변경되지 않았으면 함수를 재실행하지 않고 이전에 기억해 둔 해당 값을 반환하고, 변경됐다면 첫 번째 인수의 함수 실행 후 그 값을 반환하고 그 값을 다시 기억해 둘 것이다.
```ts
const MemoizedComponent = useMemo(
  () => <ExpensiveComponent value={value} />,
  [value],
)
```
위 코드처럼 메모이제이션은 단순히 값뿐만 아니라 컴포넌트도 가능하지만 React.memo를 쓰는 게 더 현명하다.

### 3.1.4 useCallback

useCallback은 인수로 넘겨받은 콜백 자체를 기억하는데 특정 함수를 재사용한다는 의미다.
값의 메모이제이션을 위해 useMemo를 사용했다면, 함수의 메모이제이션을 위해 사용하는 게 useCallback이다.
useCallback의 첫 번째 인수로 함수를, 두 번째 인수로 의존성 배열을 집어넣으면 의존성 배열이 변경되지 않는 한 함수를 재생성하지 않는다.
```ts
import React, { useCallback, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>+1</button>
    </div>
  );
}
```
위 코드에서 useCallback은 increment 함수를 한 번만 생성하도록 한다.
주로 자식 컴포넌트에 함수를 props로 넘길 때 불필요한 리렌더링을 막기 위해 사용한다.

useMemo와 useCallback의 유일한 차이는 메모이제이션을 하는 대상이 변수냐 함수냐일 뿐이다.

### 3.1.5 useRef

useRef는 useState와 동일하게 컴포넌트 내부에서 렌더링이 일어나도 변경 가능한 상태값을 저장한다는 공통점이 있다. 
useRef는 반환값인 객체 내부에 있는 current 로 값에 접근 또는 변경할 수 있고 그 값이 변해도 렌더링을 발생시키지 않는다.
```ts
function RefComponent() {
  const count = useRef(0)

  function handleClick() {
    count.current += 1
  }

  // 버튼을 아무리 눌러도 변경된 count 값이 렌더링되지 않는다.
  return <button onClick={handleClick}>{count.current}</button>
}
```
```ts
function RefComponent() {
  const inputRef = useRef()

  console.log(inputRef.current) // undefined

  useEffect(() => {
    console.log(inputRef.current) // <input type="text></input>
  }, [inputRef])

  return <input ref={inputRef} type="text" />
}
```
위의 코드에서 보면 useRef는 최초에 넘겨받은 기본값을 가지고 있다.
최초 기본값은 return 문에 정의한 DOM이 아니라 useRef()로 넘겨받은 인수라는 것을 명심해야 한다.
useRef가 선언된 당시 아직 컴포넌트 렌더링 전이라 return으로 컴포넌트의 DOM이 반환되기 전이므로 undefined다.

```ts
import { useRef, useState } from 'react';

function ClickTracker() {
  const countRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  const handleClick = () => {
    countRef.current += 1; 
    console.log('클릭 수:', countRef.current);
  };

  const forceRender = () => {
    setRenderCount((prev) => prev + 1);
  };

  return (
    <div>
      <button onClick={handleClick}>클릭 수 증가 (렌더링X)</button>
      <button onClick={forceRender}>렌더링 수 증가</button>
      <p>렌더링 횟수: {renderCount}</p>
    </div>
  );
}
```
countRef.current 는 값이 변경돼도 컴포넌트는 리렌더링되지 않는다.
즉, 클릭 수를 증가시켜도 화면에 변화가 없고 콘솔에만 찍히게 된다.
반대로 useState는 값이 바뀌면 렌더링이 발생한다.

### 3.1.6 useContext

**Context란?**
리액트 애플리케이션은 기본적으로 트리 구조를 가지고 있어서 부모의 데이터를 자식에서도 사용하고 싶으면 props로 데이터를 넘겨준다.
```ts
<A props={something}>
  <B props={something}>
    <C props={something}/>
  </B>
</A>
```
위와 같은 방법을 prop 내려주기(props drilling)라고 한다.
prop 내려주기를 극복하기 위해 등장한 개념이 바로 Context!
콘텍스트를 사용하면 명시적인 props 전달 없이도 선언한 하위 컴포넌트 모두에서 원하는 값 사용이 가능하다.

**Context를 함수 컴포넌트에서 사용할 수 있게 해주는 useContext 훅**
```ts
const Context = createContext<{hello: string} | undefined>(undefined)

function ParentComponent() {
  return (
    <>
      <Context.Provider value={{ hello: 'react' }}>
        <Context.Provider value={{ hello: 'javascript' }}>
          <ChildComponent />
        </Context.Provider>
      </Context.Provider>
    </>
    
  )
}

function ChildComponent() {
  const value = useContext(Context)

  // react가 아닌 javascript 반환
  return <>{value ? value.hello : ''}</>
}
```
useContext는 상위 컴포넌트에서 만들어진 Context를 함수 컴포넌트에서 사용할 수 있게 만들어진 훅이다.
useContext를 사용하면 상위 컴포넌트 어딘가에서 선언된 <Context.Provider />에서 제공한 값을 사용할 수 있다.

**useContext 사용할 때 주의할 점**
useContext를 함수 컴포넌트 내부에서 사용할 때는 항상 컴포넌트 재활용이 어려워진다.
useContext를 사용하는 컴포넌트는 그 Context Provider 안에 있어야 작동한다.

### 3.1.7 useReducer

useReducer는 useState의 심화 버전으로 볼 수 있다.
- 반환값은 길이가 2인 배열 →  state, dispatcher
- 3개의 인수 필요 → reducer, initialState, init

useReducer의 목적은 복잡한 형태의 state를 dispatcher로만 수정할 수 있게 함으로써 state 값에 대한 접근은 컴포넌트에서만 가능, 업데이트 방법은 컴포넌트 밖에 두고 state 업데이트를 미리 정의해 둔 dispatcher로만 제한하는 것이다.
state 하나가 가져야 할 값이 복잡하고 이를 수정하는 경우의 수가 많아지면 state를 관리하는 게 어려워진다.
여러 state를 관리하는 것보다 성격이 비슷한 state를 묶어 useReducer로 관리하는 편이 더 효율적일 수도 있다.
세 번째 인수인 게으른 초기화 함수는 굳이 사용하지 않아도 된다. 이게 없으면 두 번째 인수인 넘겨받은 기본값을 사용하게 된다.

```ts
import React, { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const CounterUseReducer = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
};
```
상태가 객체로 되어 있거나 업데이트 로직이 복잡해질 경우 useReducer를 사용하면 좋다.

### 3.1.8 useImperativeHandle

**forwardRef**
ref는 useRef에서 반환한 객체로 리액트 컴포넌트의 props인 ref에 넣어 HTMLElement에 접근하는 용도로 흔히 사용된다.
ref를 전달하는 데 있어 일관성을 제공하기 위해 forwardRef가 탄생했다.
```ts
const ChildComponent = forwardRef((props, ref) => {
  useEffect(() => {
    // {current: undefined}
    // {current: HTMLInputElement}
    console.log(ref)
  }, [ref])

  return <div>안녕</div>
})

function ParentComponent() {
  const inputRef = useRef()

  return (
    <>
      <input ref={inputRef} />
      <ChildComponent ref={inputRef} />
    </>
  )
}
```
ref를 받고자 하는 컴포넌트를 forwardRef로 감싸고 두 번째 인수로 ref를 받는다.
부모 컴포넌트에서는 props.ref를 통해 ref를 넘겨주면 된다.

**useImperativeHandle**
부모에게서 넘겨받은 ref를 원하는 대로 수정할 수 있는 훅이다.
useImperativeHandle을 사용하면 ref의 값에 원하는 값이나 액션을 정의할 수 있다.
```ts
import React, { useRef, useImperativeHandle, forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));

  return <input ref={inputRef} />;
});

export default MyInput;
```
useImperativeHandle은 부모가 자식의 전체 내부 구조를 보지 못하게 막고 특정 기능만 노출한다.
부모는 ref.current.focus()를 호출할 수는 있지만 inputRef.current.value 같은 건 접근 못 한다.

### 3.1.9 useLayoutEffect

useLayoutEffect 함수의 시그니처는 useEffect와 동일하나 모든 DOM의 변경 후에 동기적으로 발생한다.
함수의 시그니처가 동일하다는 것은 두 훅의 형태나 사용 예제가 동일하다는 것을 의미한다.
```ts
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('useEffect', count)
  }, [count])

  useLayoutEffect(() => {
    console.log('useLayoutEffect', count)
  }, [count])

  function handleClick() {
    setCount((prev) => prev + 1)
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleClick}>+</button>
    </>
  )
}
```
실행 순서를 보면 useLayoutEffect가 useState보다 먼저 실행된다.
이건 useLayoutEffect가 브라우저에 변경 사항이 반영되기 전에 실행되는 반면 useEffect는 브라우저에 변경 사항이 반영된 이후 실행되기 때문이다.
useLayoutEffect는 DOM은 계산됐지만 이게 화면에 반영되기 전에 하고 싶은 작업이 있을 때와 같이 반드시 필요할 때만 사용하는 게 좋다.

### 3.1.10 useDebugValue

useDebugValue는 일반적인 프로덕션 웹서비스에서 사용하는 훅은 아니다.
디버깅하고 싶은 정보를 이 훅에 사용하면 리액트 개발자 도구에서 볼 수 있다.
```ts
function useDate() {
  const date = new Date()

  useDebugValue(date, (date) => `현재 시간: ${date.toISOString()}`)
  return date
}
```
useDebugValue는 사용자 정의 훅 내부의 내용에 대한 정보를 남길 수 있는 훅이다.
두 번째 인수로 포맷팅 함수를 전달하면 이에 대한 값이 변경됐을 때만 호출되어 포매팅한 값을 노출한다.
useDebugValue는 오직 다른 훅 내부에서만 실행할 수 있다!

### 3.1.11 훅의 규칙

1. 최상위에서만 훅을 호출해야 한다. 반복문이나 조건문, 중첩된 함수 내에서 훅을 실행할 수 없다.
2. 훅을 호출할 수 있는 것은 리액트 함수 컴포넌트, 혹은 사용자 정의 훅의 두 가지 경우뿐이다. 일반 자바스크립트 함수에서는 훅을 사용할 수 없다.

