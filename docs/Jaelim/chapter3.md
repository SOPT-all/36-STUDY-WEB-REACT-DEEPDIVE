<aside>
💫

**주요 개념**

**(1) 렌더 :**

DOM 트리 구성을 위해서 스타일 속성을 계산하는거

**브라우저가 HTML, CSS, JavaScript를 해석**하여 **화면에 표시될 요소를 준비**하는 과정

**(2) 페인트 :**

**렌더링 작업을 마친 후, 실제로 화면에 그리기** 시작

실제 스크린에 layout 표시하고 업데이트

</aside>

# React 렌더링 과정을 알아보자!

![image](https://github.com/user-attachments/assets/3ff1dcfb-08f4-4c2b-a57c-a662d79fa079)

<aside>
💫

### **리액트의 전체 과정**

1. **컴포넌트 마운트**
2. **렌더링**: JSX 코드로 가상 DOM을 생성하고 실제 DOM에 반영될 준비
3. **상태 업데이트**: 상태가 변경되면, 리액트는 렌더링을 다시 실행하고 새로운 가상 DOM을 만듦
4. **DOM 비교 및 업데이트**: 이전 가상 DOM과 새로운 가상 DOM을 비교해 변경된 부분만 실제 DOM에 반영
5. **페인팅**: 화면에 요소가 최종적으로 그려짐
6. **컴포넌트 언마운트**: 더 이상 사용되지 않는 컴포넌트는 메모리에서 제거
</aside>

### react는 컴포넌트 마운팅 후 → 렌더링!

(1) 마운팅 단계 : useState, useReducer

(2) 렌더링 후 (페인팅 전) : **useLayoutEffect** 실행

(3) 페인팅 과정 후 : **useEffect** 실행

# **React 공식문서 왈~ 🐶**

> useLayoutEffect는 useEffect와 동일하지만, useLayoutEffect는 DOM 변경 후에 동기적으로 발생한다. 이를 통해 DOM에서 레이아웃을 읽고 동기적으로 리 랜더링 한다. useLayoutEffect 내에서 스케줄된 업데이트는 브라우저가 Paint하기 전에 동기적으로 실행된다.

> 하지만 시각적 업데이트를 차단하지 않으려면 가능하면 표준 useEffect를 사용해라.

|               | useEffect                                                        | useLayoutEffect                                              |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| 동기 & 비동기 | 비동기                                                           | 동기                                                         |
| 실행순서      | 컴포넌트 렌더링 - 화면 업데이트 - useEffect실행                  | 컴포넌트 렌더링 - useLayoutEffect 실행 - 화면 업데이트       |
| 사용예시      | Side Effect(데이터 가져오기, 구독 설정하기, 수동으로 Dom을 수정) | 렌더링 직후 DOM요소의 값을 읽을 때 유용함(scroll position등) |

# 💠 useEffect

### 렌더와 페인트된 후에 실행!! 비동기적!

비동기적으로 실행되므로, UI 렌더링이 먼저 완료됨

페인트 이후에 실행해서, useEffect 함수 내부에 DOM 영향 주는게 있으면 깜박이기도함

![img](https://github.com/user-attachments/assets/e61b509c-d1e9-459e-af88-b924654a963e)

⇒ 화면자체가 다 그려진 상태에서, useEffect 내에서 DOM을 조작하게 됐을 때

### 권장 경우

1. fetch
2. event 핸들러
3. state reset

# 💠 useLayoutEffect

### 렌더 이후에 실행되고, 그 이후에! 페인트 이루어짐! 동기적!

![image](https://github.com/user-attachments/assets/bb543513-83da-45ea-b45f-108a4a6304d9)

페인트되기전에, useLayoutEffect 상 로직 작동하니까, 화면 상 깜박임을 겪지는 않음

동기적으로 실행되어 UI 변경을 완료하기 전에 작업을 처리

useLayoutEffect가 완료될때까지 기다린 후에! 화면에 그려지기 때문에, 일시 중단되는 것 같은 느낌

```jsx
const Test = (): JSX.Element => {
  const [value, setValue] = useState(0);

  useLayoutEffect(() => {
    if (value === 0) {
      setValue(10 + Math.random() * 200);
    }
  }, [value]);

  console.log("render", value);

  return <button onClick={() => setValue(0)}>value: {value}</button>;
};
```

해당 state이 조건에 따라 첫 painting 시 다르게 렌더링 되어야 할 때

useEffect 사용하면, 처음에 0이 보여지고 이후에 리렌더링 되면서 화면이 깜빡거려지기 때문에 useLayoutEffect 를 사용추천!

### useEffect
![1](https://github.com/user-attachments/assets/1ed7d27b-566c-47ab-b8a4-c2d09bda83e0)


### useLayoutEffect
![2](https://github.com/user-attachments/assets/dc4a082c-4e94-4ee0-9b44-87d298c11ae3)


# 언제 씀?

- **`useEffect`의 필요성**:
  - 비동기 작업이나 사이드 이펙트가 필요한 경우
    (ex. API 요청, 외부 라이브러리와의 상호작용 등)
  - **성능 최적화**: 렌더링 이후 실행되니까 렌더링을 차단하지도 않고, UI 차단 없이 비동기적으로 작업 처리.
- **`useLayoutEffect`의 필요성**:
  - DOM 상태를 즉시 업데이트하거나, **레이아웃 측정 및 조정**이 필요한 경우
    → DOM에 반영되기 전에 작업이 이루어지니까 UI가 그려지기 전에 정확한 상태를 계산 ㄱㄴ
  - **애니메이션이나 레이아웃 변경**을 “**화면 렌더링” 전에** 처리해야 할 경우

### 웬만하면 useEffect

⇒ useLayoutEffect는 동기적으로 실행되니까 성능 영향 줌

⇒ useLayoutEffect 안에 내용이 오래 걸리는 메서드라면 화면에 paint가 바로 일어나지 않게 되어서 UI를 빠르게 볼 수 없을 수 있음

# 결론

useLayoutEffect : DOM을 변경하거나 중간 수정된 state 값을 화면에 표출해야 하는 경우

useEffect : 데이터 fetch,이벤트 핸들러 등을 다루는 작업 등의 경우

# 퀴즈 #1

```jsx
import React, { useState, useEffect, useRef } from "react";

const ResizeExample = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const boxRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div
        ref={boxRef}
        style={{
          width: width / 2 + "px",
          height: "100px",
          backgroundColor: "skyblue",
        }}
      ></div>
    </div>
  );
};

export default ResizeExample;
```

### [정답]

화면 크기 변화 제어! -> useLayoutEffect 적합
UI가 깜박이지 않게 화면 리렌더링을 최적화하려면 useLayoutEffect가 적합하다.

# 퀴즈 #2

```jsx
import React, { useState, useEffect, useRef } from "react";

const AnimationExample = () => {
  const [move, setMove] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (move) {
      boxRef.current.style.transition = "transform 1s";
      boxRef.current.style.transform = "translateX(300px)";
    }
  }, [move]);

  return (
    <div>
      <div
        ref={boxRef}
        style={{ width: "100px", height: "100px", backgroundColor: "orange" }}
      ></div>
      <button onClick={() => setMove(!move)}>애니메이션 시작</button>
    </div>
  );
};

export default AnimationExample;
```

### [정답]

애니메이션 효과 -> useEffect 적합

애니메이션은 UI가 이미 렌더링된 후 애니메이션 효과를 적용하는 것이 자연스럽
useEffect는 렌더링 후 비동기적으로 실행되니까 애니메이션이 UI 렌더링 이후에 적용되기 때문에 애니메이션이 부드럽게 시작됨

오히려 **useLayoutEffect**는 렌더링 중에 DOM을 수정하니까 애니메이션이 렌더링되기 전에 실행되면서 깜박일 수 있다.

# 퀴즈 #3

```jsx
import React, { useState, useRef, useEffect } from "react";

const LayoutMeasurementExample = () => {
  const [height, setHeight] = useState(0);
  const boxRef = useRef(null);

  useEffect(() => {
    const boxHeight = boxRef.current.getBoundingClientRect().height;
    setHeight(boxHeight);
  }, []);

  return (
    <div>
      <div
        ref={boxRef}
        style={{ height: "200px", backgroundColor: "green" }}
      ></div>
      <p>박스의 높이: {height}px</p>
    </div>
  );
};

export default LayoutMeasurementExample;
```

### [정답]

레이아웃 측정 후 스타일 변경 -> useLayoutEffect 적합

# 퀴즈 #4

```jsx
import React, { useState, useRef, useEffect } from "react";

const DomManipulationExample = () => {
  const [bgColor, setBgColor] = useState("red");
  const boxRef = useRef(null);

  useEffect(() => {
    boxRef.current.style.backgroundColor = bgColor;
  }, [bgColor]);

  return (
    <div>
      <div ref={boxRef} style={{ width: "200px", height: "200px" }}></div>
      <button onClick={() => setBgColor("blue")}>배경색 변경</button>
    </div>
  );
};

export default DomManipulationExample;
```

### [정답]

DOM 조작 동기화 작업 -> useLayoutEffect 적합!

# 퀴즈 #5

```jsx
import React, { useState, useEffect } from "react";

const ExternalLibraryExample = () => {
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  useEffect(() => {
    const loadLibrary = () => {
      setIsLibraryLoaded(true);
      console.log("외부 라이브러리 초기화 !");
    };
    loadLibrary();
  }, []);

  return (
    <div>
      {isLibraryLoaded ? <p>라이브러리 초기화 완료!</p> : <p>로딩 중...</p>}
    </div>
  );
};

export default ExternalLibraryExample;
```

### [정답]

외부 라이브러리 초기화 작업 (ex. Google Maps, Chart.js) 같은거 초기화 -> useEffect 적합
라이브러리 초기화는 비동기적으로 하는게 일반적!
