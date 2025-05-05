# 02장. 리액트 핵심 요소 깊게 살펴보기

## 2.4 렌더링은 어떻게 일어나는가?

### 2.4.1 리액트의 렌더링이란?

> **리액트에서의 렌더링**  
> 리액트 애플리케이션 트리 안에 있는 모든 컴포넌트들이 현재 자신들이 가지고 있는 `props`와 `state`의 값을 기반으로  
> 어떻게 UI를 구성하고, 이를 바탕으로 어떤 DOM 결과를 브라우저에 제공할 것인지 계산하는 일련의 과정이다.

---

### 2.4.2 리액트의 렌더링이 일어나는 이유

- **최초 렌더링:** 브라우저에 UI를 처음 제공할 때 발생
- **리렌더링:** 최초 렌더링 이후에 발생하는 모든 렌더링


#### 리렌더링이 일어나는 주요 경우

1. 클래스 컴포넌트의 `setState` 실행 시

```javascript
import React, { Component } from "react";

class Counter extends Component {
  state = { count: 0 };

  increment = () => {
    this.setState({ count: this.state.count + 1 }); // setState 실행 시 리렌더링
  };

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;
```

2. 클래스 컴포넌트의 `forceUpdate` 실행 시

```javascript
import React, { Component } from "react";

class ForceUpdateExample extends Component {
  force = () => {
    this.forceUpdate(); // 강제 리렌더링
  };

  render() {
    console.log("render called");
    return <button onClick={this.force}>Force Update</button>;
  }
}

export default ForceUpdateExample;
```

3. 함수 컴포넌트의 `useState`의 setter 실행 시

```javascript
import React, { useState } from "react";

export default function UseStateExample() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

4. 함수 컴포넌트의 `useReducer`의 dispatch 실행 시

```javascript
import React, { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    default:
      return state;
  }
}

export default function UseReducerExample() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
    </div>
  );
}
```

5. `props`가 변경되는 경우

```javascript
function Child({ message }) {
  console.log("Child render");
  return <p>{message}</p>;
}

export default function Parent() {
  const [text, setText] = useState("Hello");

  return (
    <div>
      <Child message={text} />
      <button onClick={() => setText("World")}>Change Message</button>
    </div>
  );
}
```
**React.memo**로 리렌더링 방지하는 예시
```js
import React, { memo, useState } from 'react';

const Child = memo(({ message }) => {
  console.log('Child render');
  return <p>{message}</p>;
});

export default function Parent() {
  const [text, setText] = useState('Hello');

  return (
    <div>
      <Child message="고정 값" />
      <button onClick={() => setText('World')}>Change Parent State</button>
    </div>
  );
}
```
Child 컴포넌트는 React.memo로 감싸져 있어 props가 바뀌지 않는 한 리렌더링되지 않는다.
위 예제에서 Parent에서 text 상태를 변경해도 Child의 message는 "고정 값"으로 유지되므로, Child는 다시 렌더링되지 않는다.

6. 부모 컴포넌트가 렌더링될 경우

```javascript
function Child() {
  console.log("Child render");
  return <p>Child Component</p>;
}

export default function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Child />
      <button onClick={() => setCount(count + 1)}>Re-render Parent</button>
    </div>
  );
}
```

7. 컴포넌트의 `key` prop이 변경되는 경우

```javascript
const arr = [1, 2, 3];

export default function App() {
  return (
    <ul>
      {arr.map((index) => (
        <li key={index}>{index}</li>
      ))}
    </ul>
  );
}
```

> 참고: 배열 렌더링 시 key prop이 없으면 React는 콘솔에 경고를 출력하며,  
요소 식별이 불명확해져 성능 저하나 예기치 않은 버그가 발생할 수 있다.

> **참고**
React.memo란?
함수형 컴포넌트를 메모이제이션(memoization)하여 불필요한 리렌더링을 방지하는 고차 컴포넌트
```js
import React, { memo } from 'react';

const MyComponent = memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});
```
→ React.memo는 props가 바뀌지 않는 한 리렌더링을 건너뛸 수 있게 하여, 성능 최적화에 유용하다.

### 2.4.3 리액트의 렌더링 프로세스

React는 **컴포넌트의 루트에서부터 아래로 내려가며**, 업데이트가 필요한 컴포넌트를 찾는다.
업데이트가 필요하다고 판단되면,

- 클래스 컴포넌트는 `render()` 함수를 실행
- 함수 컴포넌트는 해당 함수를 호출

---

컴포넌트의 결과물은 JSX 형태이며, 자바스크립트로 컴파일되면서 `React.createElement()` 호출로 변환된다.

컴포넌트의 렌더링 결과물은 일반적으로 **JSX 문법**으로 작성됩니다.  
JSX는 자바스크립트로 컴파일될 때 아래와 같이 변환된다.

```js
React.createElement();
```

일반적으로 React의 렌더링 결과물은 **JSX 문법**으로 작성된다.  
이 JSX는 자바스크립트로 컴파일될 때 `React.createElement()`를 호출하는 구문으로 변환된다.

`React.createElement()`는 브라우저의 UI 구조를 설명할 수 있는  
**일반적인 자바스크립트 객체**를 반환한다.

```javascript
function Hello() {
  return (
    <TestComponent a={35} b="yceffort">
      안녕
    </TestComponent>
  );
}
```

```javascript
function Hello(){
  return React.createElement(
    TestComponent,
    { a: 35, b: 'yceffort' },
    '안녕하세요'
  )
}
```

결과물은

```javascript
{type: TestComponent, props: {a: 35, b: "yceffort", children: "안녕하세요"}}
```

렌더링 프로세스가 실행되면, 각 컴포넌트의 렌더링 결과물을 수집한 뒤  
React의 새로운 트리인 가상 DOM과 비교하여 실제 DOM에 반영할 변경 사항을 결정한다.


### 렌더와 커밋

| 단계      | 설명                                                                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 렌더 단계 | 컴포넌트를 렌더링하고 변경 사항을 계산. <br>컴포넌트를 실행해 결과와 이전 가상 DOM을 비교, 변경이 필요한 컴포넌트(type, props, key 중 하나라도 변경 시) 체크 |
| 커밋 단계 | 렌더 단계에서 감지된 변경 사항을 실제 DOM에 적용. <br>이 단계가 끝나야 브라우저에 UI 반영                                                                    |

- **렌더 단계**: 변경 사항을 계산하는 작업.
- **커밋 단계**: 실제 DOM에 변경 사항을 적용하는 작업.

> **⭐​중요**  
> 렌더링이 일어난다고 해서 무조건 DOM 업데이트가 발생하는 것은 아니다.  
> 변경 사항이 감지되지 않으면 커밋 단계는 생략되어, 실제 DOM에는 아무런 변화가 일어나지 않을 수 있습니다.

---

React의 렌더링은 과거에는 **항상 동기식**으로 작동했다.  
따라서 렌더링 과정이 길어질수록 애플리케이션의 성능이 저하되고,  
결과적으로 브라우저의 다른 작업(예: 입력 이벤트, 애니메이션)을 지연시킬 가능성이 있다.

---

React 18부터 도입된 **동시성 렌더링**은 이러한 문제를 완화한다.  
`startTransition`을 사용하는 예시

```javascript
import React, { useState, startTransition } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    startTransition(() => {
      // 대량 데이터 필터링이나 렌더링
      const filtered = Array(10000)
        .fill(0)
        .map((_, i) => `${value} - Item ${i}`);
      setList(filtered);
    });
  };

  return (
    <div>
      <input value={input} onChange={handleChange} />
      <ul>
        {list.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2.4.5 일반적인 렌더링 시나리오 살펴보기

```javascript
import { useState } from 'react'

export default function A() {
  return (
    <div className="App">
      <h1>Hello React!</h1>
      <B />
    </div>
  )
}

function B() {
  const [counter, setCounter] = useState(0)

  function handleButtonClick(){
    setCounter((previous) => previous + 1)
  }

  return (
    <>
      <label>
        <C number={counter} />
      </label>
      <button onClick={handleButtonClick}>+</button>
    </>
  )

}

function C({ number }) {
  return (
    <div>
      {number} <D />
    </div>
  )
}

function D() {
  return <>리액트 재밌다</>
}
```

위 코드에서 사용자가 B 컴포넌트의 버튼을 눌러 counter 변수를 업데이트하면 다음과 같이 동작한다.

- B 컴포넌트에서 setCounter가 실행되며 B 컴포넌트가 리렌더링된다.
- C 컴포넌트는 number prop 값이 바뀌므로 리렌더링된다.
- D 컴포넌트는 prop이나 state가 없지만, C의 자식 컴포넌트로서 함께 렌더링된다.
- A 컴포넌트는 영향을 받지 않아 리렌더링되지 않는다.
