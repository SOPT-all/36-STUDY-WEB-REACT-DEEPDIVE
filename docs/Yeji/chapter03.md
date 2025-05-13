# 📚 [ 모던 리액트 딥다이브] - 02장 : 리액트 핵심 요소 깊게 살펴보기

## 3.1 리액트의 모든 훅 파헤치기

## `useState`

### `useState` 구현 살펴보기

```jsx
import { useState } from "react";
const [state, setState] = useState(initialState);
```

- **initialState** : 초기 상태값 (생략하면 undefined)
- **state** : 현재 상태값
- **setState** : 상태를 업데이트하는 함수

useState는 배열을 반환하고, 구조 분해 할당으로 현재 값과 상태 변경 함수를 받아오는 방식임.

---

useState를 사용하지 않고 함수 내부에서 변수를 사용하여 상태값을 관리한다면 아래와 같이 작성할 수 있음.

```jsx
function Example() {
  let state = "hello";

  const handleClick = () => {
    state = "hi";
    console.log(text);
  };

  return (
    <>
      <h1>{text}</h1>
      <button onClick={handleClick}>hi</button>
    </>
  );
}
```

이 코드는 처음 렌더링될 때 state 값이 "hello"로 설정됨. handleClick 함수에서 text = "hi"로 값을 바꿔도 화면엔 반영되지 않음. 리액트는 state가 변경되었을 때만 컴포넌트를 다시 렌더링함. 단순히 변수 값을 바꾼다고 해서 컴포넌트가 다시 그려지진 않음.

```jsx
function Component() {
  const [, triggerRender] = useState();

  let state = "hello";

  function handleButtonClick() {
    state = "hi";
    triggerRender();
  }
  return (
    <>
      <hl>{state}</hl>
      <button onClick={handleButtonClick}>hi</button>
    </>
  );
}
```

useState를 사용하면, 상태 변경 시 리액트가 이 컴포넌트를 다시 실행함. 하지만 위 코드는 state는 업데이트되고 있는데 렌더링이 되지 않는다. 왜냐하면, 리액트는 컴포넌트가 렌더링되면 내부적으로 return 값을 기억하고 있음. 그리고 어떤 이벤트가 발생했을 때 그 결과가 바뀌었는지를 확인하고, 렌더링이 필요한 경우에만 화면을 다시 그림.

```jsx

```

클로저는 어떤 함수 내부에 선언된 함수가 함수의 실행이 종료된 이후에도 지역 변수인 state를 계속 참조할 수 있다는 것을 의미함.

리액트는 useState를 내부적으로 배열로 관리하고, 각 state마다 인덱스를 부여해서 이를 클로저를 통해 추적함.

useState의 동작 모의 코드는 아래와 같음.

```jsx
const MyReact = (function () {
  const global = {}; // 애플리케이션 전역 상태
  let index = 0; // useState 호출 순서를 기억함

  function useState(initialState) {
    // 최초 호출이면 상태 배열 초기화
    if (!global.states) {
      global.states = [];
    }

    // 현재 인덱스 위치에 값이 없으면 초기값으로 설정
    const currentState = global.states[index] ?? initialState;
    global.states[index] = currentState;

    // 즉시 실행 함수로 setter를 만든다.
    const setState = (function () {
      // 현재 index를 클로저로 가둬놔서 이후에도 계속해서 동일한 index에
      // 접근할 수 있도록 한다.
      const currentIndex = index;
      return function (value) {
        global.states[currentIndex] = value;
        // 여기서 실제 리렌더링이 일어남
        console.log(`state[${currentIndex}] changed to`, value);
      };
    })();

    // useState를 쓸 때마다 index를 하나씩 추가한다. 이 index는 setstate에서 사용된다.
    // 즉, 하나의 state마다 index가 할당돼 있어 그 index가 배열의 값(global.states)을
    // 가리키고 필요할 때마다 그 값을 가져오게 한다.
    index += 1;

    return [currentState, setState];
  }

  // useState를 사용하는 컴포넌트
  function Component() {
    const [value, setValue] = useState(0);
  }
})();
```

### 게으른 초기화

```jsx
// 일반적인 useState 사용
// 바로 값을 집어넣는다.
const [count, setCount] = useState(
  Number.parseInt(window.localStorage.getItem("cacheKey"), 10)
);

// 게으른 초기화
// 위 코드와의 차이점은 함수를 실행해 값을 반환한다는 것이다.
const [count, setCount] = useState(() => {
  return Number.parseInt(window.localStorage.getItem("cacheKey"), 10);
});
```

Number.parseInt()는 컴포넌트가 렌더링될 때마다 매번 실행되기 때문에 리렌더링이 발생할 때마다 계속해서 localStorage에 접근하게 됨.

게으른 초기화는 함수는 최초 마운트 시에만 실행됨. 이후 리렌더링이 일어나더라도 해당 함수는 다시 실행되지 않음.

```jsx
import { useState } from "react";

export default function App() {
  const [state, setState] = useState(() => {
    console.log("복잡한 연산 실행 중..."); // 최초 한 번만 실행됨
    return 0;
  });

  function handleClick() {
    setState((prev) => prev + 1);
  }

  return (
    <div>
      <h1>{state}</h1>
      <button onClick={handleClick}>+</button>
    </div>
  );
}
```

컴포넌트가 처음 렌더링될 때만 출력됨. 버튼을 눌러 리렌더링이 발생해도 메시지는 다시 출력되지 않음.

게으른 최적화는 localStorage나 sessionStorage에 댛나 접근, map, filter, find 배열에 대한 접근, 초깃값 계산을 위해 등등 무거운 실행 비용이 드는 경우에 사용하는 것이 좋음.

## `useEffect`

### `useEffect`란?

useEffect의 기본 형태는 아래와 같음.

```jsx
useEffect(() => {
  // 실행할 부수효과
}, [deps]);
```

- 첫 번째 인수: 실행할 함수 (콜백 함수) : 데이터 요청, DOM 접근, 타이머 설정 등 렌더링 외의 작업을 작성함.
- 두 번째 인수: 의존성 배열(dependency array) : 이 배열에 포함된 값 중 이전 렌더링과 달라진 값이 있다면, 첫 번째 콜백이 다시 실행됨.

함수 컴포넌트는 렌더링될 때마다 전체 함수가 다시 실행됨.
즉, 내부 변수나 함수는 매 렌더링마다 다시 만들어짐. 하지만 useEffect는 내부적으로 이전 렌더링과의 의존성 배열 값을 비교해서, 필요한 경우에만 실행됨.

### 클린업 함수의 목적

useEffect에서는 이전 부수효과를 정리(clean-up) 할 수 있도록 콜백 함수 내부에서 또 다른 함수를 return 형태로 반환할 수 있는 클린업 함수임.

클린업 함수는 컴포넌트가 언마운트 되거나 / useEffect가 다시 실행되기 직전에 실행됨.

클린업 함수는 이전 렌더링 기준 값을 기준으로 동작함. 즉, 클린업 함수는 정의됐을 당시의 클로저 값을 기억하고 실행됨. 새로 바뀐 값이 아닌, 바로 이전 effect에서 참조한 값을 사용함.

```jsx
// 최초 실행
useEffect(() => {
  function addMouseEvent() {
    console.log(1);
  }

  window.addEventListener("click", addMouseEvent);

  // 클린업 함수
  // 이 클린업 함수는 다음 렌더링이 끝난 뒤에 실행됨
  return () => {
    console.log("클린업 함수 실행! 1");
    window.removeEventListener("click", addMouseEvent);
  };
}, [counter]);

// 이후 실행
useEffect(() => {
  function addMouseEvent() {
    console.log(2);
  }

  window.addEventListener("click", addMouseEvent);

  // 클린업 함수
  return () => {
    console.log("클린업 함수 실행! 2");
    window.removeEventListener("click", addMouseEvent);
  };
}, [counter]);
```

1. count === 1일 때 실행된 addMouseEvent가 등록됨
2. count === 2가 되면서 effect가 다시 실행됨
3. 이때 count === 1 기준의 클린업 함수가 먼저 실행됨
4. 그 후에 count === 2 기준의 effect가 새로 실행됨

### 의존성 배열

1. 빈 배열 []

```jsx
useEffect(() => {
  console.log("최초 한 번만 실행");
}, []);
```

- 의존성이 없다고 판단
- 컴포넌트 최초 마운트(렌더링) 직후 한 번만 실행됨.
- 이후 다시 실행되지 않음.
- 주로 초기화, API 요청, 이벤트 등록 등에 사용함.

2. 배열 생략

```jsx
useEffect(() => {
  console.log("렌더링마다 실행됨");
});
```

- 의존성 배열이 아예 없는 경우, 매 렌더링마다 실행됨.
- 렌더링이 일어날 때마다 무조건 실행됨.
- 성능에 영향을 줄 수 있으므로 꼭 필요한 경우에만 사용

3. 사용자가 값을 넣는 배열 [value]

```jsx
useEffect(() => {
  console.log("value가 바뀔 때마다 실행됨");
}, [value]);
```

- 배열 안의 값이 이전 렌더링과 달라졌을 때만 실행됨.
- 하나 이상의 상태(state)나 props를 넣을 수 있음.

> SSR 입장에서 useEffect는 클라이언트 사이드에서 실행되는 것을 보장함.
>
> useEffect는 컴포넌트 렌더링이 완료된 이후에 실행됨.

### useEffect의 구현

```jsx
const MyReact = (function () {
  const global = {
    hooks: [],
  };
  let index = 0;

  function useEffect(callback, dependencies) {
    const hooks = global.hooks;

    // 이전 의존성 배열을 가져온다.
    const previousDependencies = hooks[index];

    // 의존성 배열 변경 여부 확인
    // 이전 값이 있다면, 각 값을 얕은 비교(Object.is)하여 변경 여부를 판단
    // 이전 값이 없다면(최초 실행), 무조건 실행해야 하므로 true로 설정
    const isDependenciesChanged = previousDependencies
      ? dependencies.some(
          (value, idx) => !Object.is(value, previousDependencies[idx])
        )
      : true;

    // 변경이 일어났다면 콜백 실행
    if (isDependenciesChanged) {
      callback();
    }

    // 현재 의존성 배열을 저장하고 index 증가
    hooks[index] = dependencies;
    index++;
  }

  return { useEffect };
})();
```

### useEffect를 사용할 때 주의할 점

#### eslint-disable-line react-hooks/exhaustive-deps 주석은 최대한 자제하라

이 주석은 의존성 배열을 무시하겠다는 의미임. [] 빈 배열을 넣은 채로 이 주석을 붙이는 것은 주의해야 함. []는 컴포넌트 마운트 시점에만 한 번 실행되는 구조로, 마치 componentDidMount처럼 동작함. 이는 state나 props의 변경과 무관하게 효과가 딱 한 번만 실행되기 때문에 의존성 누락으로 인한 버그의 원인이 될 수 있음. 빈 배열을 사용할 때는 정말로 “처음 1회만 실행돼야 하는 로직인지” 다시 한 번 검토해야 함.

#### useEffect의 첫 번째 인수에 함수명을 부여하라

함수 컴포넌트 내부에서 function 키워드로 명시적인 함수명을 지정하면, 디버깅 할 때, 어떤 effect인지 추적하기 쉬워짐.

#### 거대한 useEffect를 만들지 마라

하나의 useEffect에 많은 상태값(state)이나 부수 효과를 몰아넣지 말아야 함. effect의 크기가 커질수록 디버깅이 어려워지고, 의존성 배열 관리도 힘들어짐. 최대한 작고 명확한 역할로 분리된 여러 개의 useEffect로 나누는 것이 좋음.

#### 불필요한 외부 함수를 만들지 마라

effect 내부에서만 사용하는 함수는 외부에 선언할 필요 없음. 내부로 옮기면 불필요한 의존성도 줄이고, 코드도 간결해짐.

await 이후에 state를 설정하거나 클린업을 할 경우 경쟁 상태(race condition) 가 발생할 수 있고, 클린업 함수의 실행 순서도 보장되지 않음.

useEffect 내부에서 비동기 함수를 선언하여 실행하거나 즉시 실행 비동기 함수를 만들어서 사용하는 것은 가능함.

## `useMemo`

```jsx
import { useMemo } from ’react’
const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b])
```

비용이 많이 드는 계산 결과를 메모이제이션(캐싱) 하기 위해 사용하는 훅임.

- 첫 번째 인수 : 어떠한 값을 반환하는 생성 함수
- 두 번째 인수 : 해당 함수가 의존하는 값의 배열을 전달함

1. 컴포넌트가 렌더링될 때 useMemo는 의존성 배열을 먼저 비교함.
2. 이전 렌더링과 비교해 배열 안의 값이 하나라도 바뀌었다면, 첫 번째 함수를 다시 실행함.
3. 반환값을 새로 저장(memoize)해 다음 렌더링에서 재사용함.

<->

반대로 의존성 값이 변경되지 않았다면, 이전에 계산해둔 결과값을 그대로 꺼내 씀.
이렇게 하면 렌더링 중 불필요한 계산을 줄일 수 있고, 성능이 향상됨.

값이 정말 자주 바뀌지 않고, 계산량이 많은 작업일 때만 사용하는 것이 좋음.

## `useCallback`

useCallback은 함수를 메모이제이션하는 훅임. 컴포넌트가 리렌더링 되더라도 동일한 함수 인스턴스를 계속 재사용할 수 있도록 도와줌.

```jsx
import { useCallback } from "react";

const memoizedFn = useCallback(() => {
  fn();
}, [a, b]);
```

- 첫 번째 인수 : 함수
- 두 번째 인수 : 의존성 배열

1. useCallback은 내부적으로 함수의 참조(reference)를 저장해 둠.
2. 의존성 배열에 있는 값이 변하지 않으면, 함수도 이전에 저장해둔 같은 함수 객체를 반환함.
3. 자식 컴포넌트에 함수를 props로 넘길 때, 불필요한 리렌더링을 방지할 수 있음.

React.memo로 감싼 컴포넌트에 콜백 함수를 props로 넘기거나, 특정 이벤트 핸들러의 참조를 유지할 필요가 있을 때만 사용하는 것이 좋음.

## `useRef`

useRef는 React에서 DOM 요소에 직접 접근하거나, 렌더링과는 무관하게 값을 저장해둘 때 사용하는 훅임. .current 속성을 가진 객체를 반환하고 해당 값을 읽거나 쓸 수 있지만, 값이 바뀌어도 컴포넌트를 리렌더링하지 않음. 값은 컴포넌트가 언마운트 될 때까지 유지됨.

```jsx
function RefComponent() {
  const inputRef = useRef();
  // 이때는 미처 렌더링이 실행되기 전(반환되기 전)이므로 니ndefined를 반환한다.
  console.log(inputRef.current); // undefined
  useEffect(() => {
    console.log(inputRef.current); // <input type="text"></input>
  }, [inputRef]);
  return <input ref={inputRef} type="text" />;
}
```

useRef를 DOM 요소에 ref로 연결하면, 컴포넌트가 마운트된 후에 해당 DOM 요소를 참조할 수 있다. 컴포넌트가 렌더링되기 전에는 아직 DOM이 생성되지 않았기 때문에 inputRef.current는 null이다. 그렇기 때문에 항상 useEffect 내부에서 DOM 접근을 수행해야 함.

렌더링을 발생시키지 않고 원하는 상태 값을 저장할 수 있기 때문에 성능 최적화에 유리하고 setTimeout/setInterval 등의 상황에서 사용할 수 있음.

## `useContext`

### Context란?

부모 → 자식 → 손자 컴포넌트로 props를 계속 넘겨야 하는 props drilling이 발생함.
Context API를 활용하여 복잡한 props drilling 상황을 해결할 수 있음.

### Context를 함수 컴포넌트에서 사용할 수 있게 해주는 useContext 훅

```jsx
const Context = (createContext < { hello: string }) | (undefined > undefined);

function ParentComponent() {
  return (
    <>
      <Context.Provider value={{ hello: "react" }}>
        <Context.Provider value={{ hello: "javascript" }}>
          <ChildComponent />
        </Context.Provider>
      </Context.Provider>
    </>
  );
}

function ChildComponent() {
  const value = useContext(Context);
  return <>{value ? value.hello : ""}</>;
}
```

useContext는 함수 컴포넌트 안에서 Context의 값을 쉽게 꺼내 쓸 수 있도록 도와주는 훅임.
가장 가까운 <Context.Provider>가 전달해주는 값을 자동으로 찾아서 반환해줌.

### useContext를 사용할 때 주의할 점

useContext는 내부적으로 현재 컴포넌트가 Provider로 감싸져 있는지를 전제로 동작함.
만약 Provider 없이 useContext만 쓰면 undefined가 반환될 수 있으니 에러 처리를 해주는 게 좋음.

Context 내부 값이 바뀌면, 그 값을 사용하는 모든 컴포넌트가 다시 렌더링됨.
이런 특성 때문에, Context는 최대한 작게 나누어 사용하는 게 좋음.
값을 메모이제이션하거나 필요한 부분만 useMemo로 감싸주는 것도 도움이 됨.

상태 관리 라이브러리처럼 쓰고 싶다면 아래 조건을 만족해야 함.

1. 어떤 상태를 기반으로 다른 상태를 만들어 낼 수 있어야 함
2. 필요에 따라 이러한 상태 변화를 최적화 할 수 있어야 함.

## `useReducer`

상태가 복잡해지거나 상태 업데이트 로직을 컴포넌트 바깥으로 분리하고 싶을 때는 useReducer를 사용하는 게 더 깔끔하고 유지보수가 쉬움.

useReducer는 어떤 액션이 주어졌을 때, 상태가 어떻게 바뀔지를 하나의 reducer 함수로 관리함으로써 상태 변경의 흐름을 예측 가능하게 만들어줌.

```jsx
const [state, dispatch] = useReducer(reducer, initialState, init);
```

- state: 현재 useReducer가 가지고 있는 값을 의미함. 배열을 반환함.
- dispatcher: 액션을 보내는 함수 (상태를 변경할 때 사용)

1.  reducer: 상태를 어떻게 변경할지 정의하는 함수 (필수)
2.  initialState: 초기 상태 값 (필수)
3.  init: 지연 초기화 함수, 복잡한 연산이 필요할 경우 사용 (선택)

```jsx
// useReducer가 사용할 state를 정의
type State = {
  count: number,
};
// state의 변화를 발생시킬 action의 타입과 넘겨줄 값(payload)을 정의
// 꼭 type과 payload라는 네이밍을 지킬 필요도 없으며, 굳이 객체일 필요도 없다.
// 다만 이러한 네이밍이 가장 널리 쓰인다.
type Action =
  | { type: "up" }
  | { type: "down" }
  | { type: "reset", payload?: State };
// 무거운 연산이 포함된 게으른 초기화 함수
function init(count: State): State {
  // count: State를 받아서 초깃값을 어떻게 정의할지 연산하면 된다.
  return count;
}
// 초깃값
const initialState: State = { count: 0 };
// 앞서 선언한 state와 action을 기반으로 state가 어떻게 변경될지 정의

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "up":
      return { count: state.count + 1 };
    case "down":
      return { count: state.count > 0 ? state.count - 1 : 0 };
    case "reset":
      return init(action.payload ?? { count: 0 });
    default:
      throw new Error(`Unexpected action type: ${action.type}`);
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  const handleUp = () => dispatch({ type: "up" });
  const handleDown = () => dispatch({ type: "down" });
  const handleReset = () => dispatch({ type: "reset", payload: { count: 1 } });

  return (
    <div className="App">
      <h1>{state.count}</h1>
      <button onClick={handleUp}>+</button>
      <button onClick={handleDown}>-</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}
```

복잡한 상태 업데이트 로직을 외부로 분리하고 싶을 때 사용함. reducer 안에 모든 상태 변경 로직을 작성하면 컴포넌트는 깔끔해짐.

상태 변경을 예측 가능한 방식으로 처리하고 싶을 때에도 사용함. 액션에 따라 상태가 어떻게 변하는지 명확하게 추적 가능함.

동일한 로직으로 여러 상태를 초기화하고 싶을 때 사용함. init 함수를 사용하면 reducer 내부에서도 초기화 로직 재사용이 가능함.

```jsx
const useReducer = (reducer, initialArg, init) => {
  const [state, setstate] = useState(
    // 초기화 함수가 있으면 초깃값과 초기화 함수를 실행하고,
    // 그렇지 않으면 초깃값을 넣는다.
    init ? () => init(initialArg) : initialArg
  );
  // 값을 업데이트하는 dispatch를 넣어준다.
  const dispatch = useCaUback(
    (action) => setState((prev) => reducer(prev, action)),
    [reducer]
  );
  // 이 값을 메모이제이션한다.
  return useMemo(() => [state, dispatch], [state, dispatch]);
};
```

## `useImperativeHandle`

### forwardRef

ref를 전달하는데 있어서 일관성을 제공하기 위해 생김. 기본적으로 함수 컴포넌트는 ref를 직접 받을 수 없음. 그래서 ref를 자식에게 전달하기 위해 forwardRef를 사용함.

```jsx
import { forwardRef } from "react";

const MyInput = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});
```

```jsx
function Parent() {
  const inputRef = useRef < HTMLInputElement > null;

  return <MyInput ref={inputRef} />;
}
```

먼저 ref를 받고자 하는 컴포넌트를 forwardRef로 감싸고, 두 번째 인수로 ref를 전달받음. 부모 컴포넌트에서는 동일하게 props.ref를 통해 넘김.

### `useImperativeHandle` 이란

부모에게서 넘겨받은 ref를 원하는대로 수정할 수 있는 훅임. 컴포넌트 내부에서 ref를 원하는 형태로 외부 노출하고 싶을 때 useImperativeHandle을 사용함.

## `useLayoutEffect`

```jsx
import { useEffect, useLayoutEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("useEffect", count);
  }, [count]);

  useLayoutEffect(() => {
    console.log("useLayoutEffect", count);
  }, [count]);

  const handleClick = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleClick}>+</button>
    </>
  );
}
```

useLayoutEffect는 모든 DOM 변경 후에 실행되지만, 화면이 그려지기 전에 동기적으로 실행됨.

1. 리액트가 DOM을 업데이트
2. useLayoutEffect를 실행 (동기적)
3. 브라우저에 변경 사항을 반영
4. useEffect를 실행 (비동기)

특징상, DOM은 계산됐지만 화면에 반영하기 전에 하고 싶은 작업이 있을 때처럼 필요한 때만 사용하는 것이 좋음. (DOM의 크기, 위치를 측정해야 할 때,특정 스타일을 계산하거나 변경해야 할 때,레이아웃이 바뀌기 전에 DOM 값을 조정하고 싶을 때, 화면 깜빡임을 방지)

## `useDebugValue`

사용자 정의 훅 내부의 내용에 대한 정보를 남길 수 있는 훅임. 두 번째 파라미터로 포매팅 함수를 전달하면 해당 값이 변경되었을 때만 호출되어 포맷팅된 값을 노출함.

다른 훅 내부에서만 실행할 수 있기 때문에 공통 훅을 제공하는 라이브러리나 대규모 웹 애플리케이션에서 디버깅 정보를 제공할 때 사용할 수 있음 .

## 3.1.11 훅의 규칙

### 1. 최상위에서만 훅을 호출해야함. 반복문이나 조건문, 중첩 함수 내에서 훅을 실행할 수 없음.

useState, useEffect 같은 훅은 반복문, 조건문, 중첩 함수 내부에서 호출하면 안 됨.
항상 컴포넌트의 최상단에서 호출되어야 하며, 모든 렌더링마다 동일한 순서로 실행되는 것이 보장돼야 함.

### 2. 훅을 호출할 수 있는 것은 리액트 함수 컴포넌트, 사용자 정의 훅 2가지 경우만 있음.

React는 내부적으로 각 컴포넌트를 Fiber 객체라는 구조로 관리함.
이 Fiber 객체는 훅의 실행 결과를 **호출 순서**에 따라 저장하는 링크드 리스트 형태를 가짐. 실행된 순서대로 그 값이 저장되고 관리됨.

순서를 보장할 수 없다면 에러가 발생함. 예측 불가능한 순서로 실행되게 해서는 안되기 때문에 실행 순서를 보장받을 수 있는 컴포넌트 최상단에 선언되어 있어야함. 조건이 필요하다면 훅 내부에서 수행되어야 함.
