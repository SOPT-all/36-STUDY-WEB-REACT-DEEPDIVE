# 리액트 컴포넌트 패턴

## 리액트 컴포넌트 패턴이란?
리액트는 UI를 컴포넌트 단위로 구성하는 선언형 라이브러리
이 컴포넌트 기반 아키텍처는 재사용성과 유지보수성을 높이는 데 매우 효과적이지만, 프로젝트가 커질수록 복잡해지고 로직이 뒤섞이기 쉬운 단점도 있다.

이런 문제를 해결하기 위해 여러 **컴포넌트 설계 패턴**이 등장했다.
이 패턴들은 컴포넌트 간의 책임을 명확히 하고 코드의 일관성, 가독성을 높이며, 테스트와 확장성을 용이하게 해준다.

## 리액트 컴포넌트 패턴이 왜 중요할까?
1. **역할 분리**: UI와 비즈니스 로직을 구분해 더 명확하고 유지보수하기 쉬운 코드를 만들 수 있다.
2. **재사용성 향상**: 공통 로직이나 UI를 추상화함으로써 중복 코드를 줄이고, 다양한 곳에서 재사용할 수 있다.
3. **유지보수성 증가**: 명확한 구조와 책임 분리는 디버깅과 코드 변경을 용이하게 한다.
4. **협업 최적화**: 일관된 패턴을 적용하면 여러 개발자 간의 협업이 쉬워지고, 코드 리뷰도 간결해진다.
5. **테스트 용이성**: 패턴을 통해 단일 책임 원칙을 따르기 쉬워져, 유닛 테스트 작성이 훨씬 수월해진다.

## 1. Presentational and Container Components
이 패턴은 리액트 초창기부터 널리 사용되어 온 구조적 패턴이다.
UI와 로직의 관심사를 분리함으로써 코드의 **가독성**, **재사용성**, **테스트 용이성**을 향상시키는 데 목적이 있다.

### 주요 개념

- **Presentational Component (프레젠테이셔널 컴포넌트)**:
  - 순수하게 UI만 렌더링
  - props만 받고, 내부 상태는 가지지 않음
  - 스타일링, 마크업 중심

- **Container Component (컨테이너 컴포넌트)**:
  - 데이터 로직, 상태 관리 담당
  - 외부 API 호출, Context 접근 등 수행
  - 프레젠테이셔널 컴포넌트에 데이터 전달

### 언제 사용하면 좋을까?

- UI와 비즈니스 로직을 분리하고 싶은 경우
- 동일한 UI를 여러 상태/데이터 소스로 재사용해야 하는 경우
- 테스트 코드를 분리해서 작성하고자 할 때

### 장점

- 관심사 분리로 코드 가독성 및 유지보수성 향상
- UI 재사용성 극대화
- 테스트 대상 범위가 작아짐

### 단점

- 소규모 프로젝트에서는 오히려 구조가 복잡해질 수 있음
- 파일/컴포넌트 수가 늘어날 수 있음

```jsx
// UserProfile.jsx (Presentational)
const UserProfile = ({ name, age }) => (
  <div>
    <h1>{name}</h1>
    <p>Age: {age}</p>
  </div>
);
export default UserProfile;

// UserProfileContainer.jsx (Container)
import { useState, useEffect } from 'react';
import UserProfile from './UserProfile';

const UserProfileContainer = () => {
  const [user, setUser] = useState({ name: '', age: 0 });

  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  return <UserProfile name={user.name} age={user.age} />;
};
export default UserProfileContainer;
```


## 2. Higher-Order Components(HOC)
HOC(Higher-Order Component)는 **컴포넌트를 인자로 받아서 새로운 컴포넌트를 반환하는 함수**이다. 
자바스크립트의 고차 함수 개념을 리액트 컴포넌트에 적용한 것으로 주로 **로직 재사용**, **권한 제어**, **로딩 처리**, **데이터 주입** 등의 목적에 활용된다.

### 주요 개념

- HOC는 props나 상태를 감싸는 컴포넌트 외부에서 주입
- 컴포넌트를 동적으로 확장하면서도 원본 컴포넌트의 책임은 그대로 유지
- `withX` 네이밍 관례를 따름 (e.g. `withAuth`, `withLogging`)

### 언제 사용하면 좋을까?

- 여러 컴포넌트에 중복되는 비즈니스 로직이 필요할 때
- 컴포넌트의 원본 구조는 유지하되 기능을 덧붙이고 싶을 때
- 권한 체크, 로딩 상태 등 공통 기능을 분리하고 싶을 때

### 장점

- 로직 추상화로 재사용성 향상
- 관심사 분리
- 원본 컴포넌트는 순수하게 유지 가능

### 단점

- 중첩된 HOC로 인한 디버깅 어려움 (wrapper hell)
- props 전달이 복잡해질 수 있음
- React DevTools에서 추적하기 어려운 경우 있음

```jsx
// HOC 정의
const withLoading = (Component) => {
  return ({ isLoading, ...props }) =>
    isLoading ? <p>Loading...</p> : <Component {...props} />;
};

// 대상 컴포넌트
const UserList = ({ users }) => (
  <ul>
    {users.map((u) => (
      <li key={u.id}>{u.name}</li>
    ))}
  </ul>
);

// 사용
const UserListWithLoading = withLoading(UserList);

// 렌더링
<UserListWithLoading isLoading={true} users={[]} />
```


## 3. Render Props
**Render Props 패턴**은 컴포넌트의 **children 또는 props로 함수를 전달**하여, 그 함수가 내부 상태를 받아서 UI를 결정하게 하는 방식이다.
HOC와 같은 로직 재사용 목적이지만 props를 통해 렌더링 전략을 전달하므로 더 유연한 제어가 가능하다.

### 주요 개념

- props로 전달된 함수(`render` 또는 `children`)가 UI를 반환
- 컴포넌트 내부 상태나 동작을 외부에서 자유롭게 소비 가능
- 특히 **상태 공유**, **UI 제어 분리**, **공통 기능 재사용**에 유용

### 언제 사용하면 좋을까?

- 컴포넌트 내부 로직은 공유하고 UI는 다르게 렌더링하고 싶을 때
- 재사용 가능한 상태 관리 로직을 만들고자 할 때
- 복잡한 HOC 계층 구조를 피하고 싶을 때

### 장점

- UI를 완전히 외부에서 제어 가능
- 복잡한 로직을 하나의 컴포넌트로 재사용
- `children`을 함수로 전달해 가독성 향상

### 단점

- 코드 가독성이 떨어질 수 있음 (특히 중첩이 깊어질 때)
- 모든 상황에 적합하지 않음 (단순한 경우엔 오히려 과함)

```jsx
const MouseTracker = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return <div onMouseMove={handleMouseMove}>{render(position)}</div>;
};

// 사용
<MouseTracker render={({ x, y }) => <h1>Mouse at {x}, {y}</h1>} />
```


## 4. Compound Components
**Compound Components 패턴**은 여러 개의 관련된 컴포넌트들이 **하나의 공통된 부모 컴포넌트를 중심으로 동작**하게 만드는 방식이다. 
마치 HTML의 `<select>`와 `<option>`처럼 내부적으로 연결된 컴포넌트들을 구성하여 개발자에게 **자연스럽고 선언적인 API**를 제공한다.

### 주요 개념

- 컴포넌트 간에 **Context** 등을 통해 내부 상태를 공유
- 부모 컴포넌트가 상태나 로직을 가지고, 자식들은 이를 기반으로 동작
- 외부에서는 하나의 컴포넌트처럼 사용되며, UI 구조는 자유롭게 조립 가능

### 언제 사용하면 좋을까?

- 상호작용하는 여러 UI 요소가 하나의 의미 단위로 묶일 때
- 사용자에게 선언적인 컴포넌트 사용 API를 제공하고 싶을 때
- `<Tabs>`, `<Accordion>`, `<Dropdown>` 등 복합 위젯 구현 시

### 장점

- API가 직관적이고 읽기 쉬움
- 내부 로직은 감춰지고, 사용자는 선언형 인터페이스만 조립
- 상태 공유가 자연스럽게 이루어짐

### 단점

- 구현 복잡도가 다소 있음 (특히 Context 사용 시)
- 잘못된 구조로 조립하면 오류 발생 가능 (가이드 필요)

```jsx
const Tabs = ({ children }) => <div>{children}</div>;
Tabs.Tab = ({ children }) => <button>{children}</button>;
Tabs.Panel = ({ children }) => <div>{children}</div>;

// 사용
<Tabs>
  <Tabs.Tab>Tab 1</Tabs.Tab>
  <Tabs.Panel>Content 1</Tabs.Panel>
</Tabs>
```


## 5. Controlled vs Uncontrolled Components
리액트에서 폼 컴포넌트를 구현할 때 가장 핵심적인 두 가지 방식 **Controlled Component**와 **Uncontrolled Component**가 있다. 
이 두 가지는 **어디서 상태를 관리하느냐**에 따라 나뉜다.

### 주요 개념

- **Controlled Component (제어 컴포넌트)**:
  - 입력값(state)을 React 상태로 관리
  - 모든 상태 변화는 `onChange` 이벤트로 감지하여 업데이트

- **Uncontrolled Component (비제어 컴포넌트)**:
  - 입력값을 DOM 자체에서 관리
  - React가 직접적으로 상태를 추적하지 않음 (`ref` 사용)

### 언제 사용하면 좋을까?

| 상황 | 추천 방식 |
|------|------------|
| 실시간 유효성 검사 필요 | Controlled |
| 상태 추적, 동기화 필요 | Controlled |
| 초기값만 주고 추적 불필요 | Uncontrolled |
| 외부 라이브러리 연동, 성능 중요 | Uncontrolled |

### 장점과 단점

**Controlled**
- ✅ 상태 추적이 명확
- ✅ 로직 분기, 유효성 검사 용이
- ❌ 코드 양이 많아질 수 있음
- ❌ 매 렌더마다 상태 업데이트 비용 존재

**Uncontrolled**
- ✅ 간단한 구현, 성능 유리
- ✅ 빠르게 prototype 가능
- ❌ 상태 추적 어려움
- ❌ 유효성 검사나 로직 제어가 불편

```jsx
// Controlled
const ControlledInput = () => {
  const [value, setValue] = useState('');
  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
};

// Uncontrolled
const UncontrolledInput = () => {
  const inputRef = useRef();
  return <input ref={inputRef} />;
};
```


## 6. Custom Hooks Pattern
**Custom Hook(커스텀 훅)** 은 `useState`, `useEffect`, `useContext` 등 리액트 내장 훅을 조합해 자주 쓰는 로직을 **함수 형태로 재사용 가능하게 만든 것**이다. 
함수 이름은 반드시 `use`로 시작해야 하며 **로직을 추상화하고 관심사를 분리**하는 데 매우 효과적이다.

### 주요 개념

- 반복되는 로직(데이터 패칭, 폼 관리 등)을 공통 함수로 분리
- UI가 아닌 **행동 또는 상태 관리 중심 로직**을 추상화
- 컴포넌트에서 간단히 불러 사용할 수 있음

### 언제 사용하면 좋을까?

- 동일한 비동기 로직을 여러 컴포넌트에서 사용해야 할 때
- 컴포넌트가 너무 커지고 하나의 역할이 모호해질 때
- 특정 상태/효과에 대한 테스트 가능성과 재사용성을 높이고 싶을 때

### 장점

- 로직 재사용 가능
- 코드 분리로 가독성 향상
- 테스트 작성이 쉬워짐
- 여러 컴포넌트에서 일관된 방식으로 동작 공유 가능

### 단점

- 개념을 잘못 이해하고 만들면 오히려 혼란 유발
- 의존성 문제나 훅 규칙 위반 발생 가능성 존재

```jsx
const useFetch = (url) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return data;
};

// 사용
const Users = () => {
  const users = useFetch('/api/users');
  return users ? users.map(user => <div key={user.id}>{user.name}</div>) : 'Loading...';
};
```


## 7. State Reducer Pattern
**State Reducer Pattern**은 컴포넌트 내부의 상태 변경 로직을 외부에서 주입받아 상태의 흐름을 사용자 또는 상위 컴포넌트가 제어 가능하게 만드는 패턴이다. 
컴포넌트가 상태를 자체적으로 관리하지 않고 상태 전환 로직을 콜백 형태로 위임받는다.

이 패턴은 특히 **컴포넌트를 확장하거나 커스터마이징** 하고자 할 때 유용하다.

### 주요 개념

- `reducer` 함수(상태와 액션을 받아 새로운 상태를 반환)를 prop으로 전달
- 컴포넌트 내부의 상태 로직을 외부에서 오버라이드 가능
- 상태를 직접적으로 set하지 않고, `dispatch(action)` 형태로 변경

### 언제 사용하면 좋을까?

- 컴포넌트의 동작을 외부에서 커스터마이징해야 할 때
- 기본 동작 외에 추가적인 상태 변경 조건이 필요한 경우
- 범용 컴포넌트를 만들고 확장성을 염두에 둘 때

### 장점

- 유연한 제어 가능
- 외부에서 컴포넌트의 행동을 제어 가능
- 로직 분리로 재사용성 및 확장성 증가

### 단점

- 복잡도 증가 (기본 상태 관리보다 구조가 큼)
- 코드 흐름 파악이 어렵거나 익숙하지 않으면 오용 가능

### 예제 (한 파일에 구현과 사용 포함)

```jsx
import { useReducer } from 'react';

// 커스텀 훅 정의
const useToggle = ({ initial = false, reducer } = {}) => {
  const defaultReducer = (state) => !state;
  const [state, dispatch] = useReducer(reducer || defaultReducer, initial);
  return [state, () => dispatch()];
};

// 기본 사용
const BasicToggle = () => {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? 'On' : 'Off'}</button>;
};

// 커스텀 reducer 사용
const onlyTurnOnReducer = (state, action) => (state ? state : true);

const CustomToggle = () => {
  const [on, toggle] = useToggle({ reducer: onlyTurnOnReducer });
  return <button onClick={toggle}>{on ? 'On (locked)' : 'Off'}</button>;
};

// 렌더링
const App = () => (
  <div>
    <h3>Basic Toggle</h3>
    <BasicToggle />
    <h3>Custom Toggle (Only turn on)</h3>
    <CustomToggle />
  </div>
);
```


## 8. Provider Pattern
**Provider Pattern**은 React의 `Context API`를 활용해 하위 컴포넌트 트리에 **전역적인 데이터(상태, 설정 등)** 를 전달하는 구조이다. 
일반적으로 테마, 인증, 다크 모드, 다국어 설정 등의 전역 데이터를 공유할 때 사용된다.

### 주요 개념

- `React.createContext()`로 Context 객체를 생성
- 상위 컴포넌트에서 `<Context.Provider>`로 값을 제공
- 하위 컴포넌트는 `useContext(Context)`를 통해 해당 값 사용

### 언제 사용하면 좋을까?

- 여러 컴포넌트에서 동일한 상태나 설정을 참조해야 할 때
- props drilling(하위 컴포넌트로 props 계속 전달)을 피하고 싶을 때
- 인증 정보, 테마, 사용자 설정 등을 앱 전역으로 제공할 때

### 장점

- props 없이 전역 공유 상태 구현 가능
- 트리 구조가 깊더라도 쉽게 접근 가능
- 글로벌 설정 또는 서비스 단위 기능 설계에 적합

### 단점

- 상태를 자주 바꾸면 성능 저하 발생 (불필요한 리렌더링)
- 구조를 잘못 설계하면 디버깅이 어려워질 수 있음

```jsx
import React, { createContext, useContext, useState } from 'react';

// Context 생성
const ThemeContext = createContext();

// Provider 정의
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 컨텍스트 사용하는 컴포넌트
const ThemedButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme}>
      현재 테마: {theme} (클릭해서 토글)
    </button>
  );
};

const App = () => (
  <ThemeProvider>
    <ThemedButton />
  </ThemeProvider>
);
```


## 9. Slot Pattern(Props.children 활용)
**Slot Pattern**은 리액트 컴포넌트에 **동적으로 콘텐츠를 삽입할 수 있도록 설계**하는 방식이다. 
`props.children` 또는 명시적인 props를 통해 **슬롯처럼 콘텐츠를 주입받아 렌더링**한다. 
HTML의 `<slot>` 개념에서 따온 것으로 컴포넌트 사용자의 자유도를 높이는 데 매우 효과적이다.

### 주요 개념

- `props.children`을 활용해 콘텐츠를 주입
- 혹은 명시적인 slot prop (e.g. `header`, `footer`)을 받아 영역 구분
- 하위 콘텐츠를 부모가 아닌 **사용자가 직접 정의**할 수 있음

### 언제 사용하면 좋을까?

- 컴포넌트 내부 구조는 고정하되, 콘텐츠는 유연하게 바꾸고 싶을 때
- UI 컴포넌트를 마치 “틀”처럼 만들어, 다양한 콘텐츠를 담을 수 있게 하고 싶을 때
- 다이어로그, 모달, 카드 UI 등에서 유용

### 장점

- 매우 유연하고 확장 가능한 구조 제공
- 재사용 가능한 UI 프레임워크 설계에 적합
- 마크업 구조와 내용이 명확히 분리됨

### 단점

- 자식 구조가 너무 복잡해질 경우 가독성 저하 가능
- 내부 구현이 유연성에 맞춰져야 하기 때문에 설계가 중요


```jsx
const Card = ({ header, footer, children }) => (
  <div className="card" style={{ border: '1px solid #ccc', padding: '1rem' }}>
    {header && <div className="card-header">{header}</div>}
    <div className="card-body">{children}</div>
    {footer && <div className="card-footer">{footer}</div>}
  </div>
);

// 사용
<Card
  header={<h2>카드 제목</h2>}
  footer={<button>확인</button>}
>
  <p>여기는 카드 본문</p>
</Card>
```
또는 children을 명시적인 슬롯으로 활용할 수도 있다.

```jsx
const Dialog = ({ children }) => {
  const [Header, Body, Footer] = children;
  return (
    <div className="dialog">
      <div className="dialog-header">{Header}</div>
      <div className="dialog-body">{Body}</div>
      <div className="dialog-footer">{Footer}</div>
    </div>
  );
};

// 사용
<Dialog>
  <h1>제목</h1>
  <p>본문 내용</p>
  <button>닫기</button>
</Dialog>
```

<br/>
<br/>


## 패턴 비교

| 패턴 이름                         | 재사용성 | 확장성 | 난이도 | 적합한 상황                                      |
|----------------------------------|----------|--------|--------|-------------------------------------------------|
| Presentational & Container       | ★★★★☆   | ★★★☆☆ | ★★☆☆☆ | UI/로직 분리, 테스트 작성, 역할 명확화           |
| Higher-Order Component (HOC)     | ★★★★★   | ★★★★☆ | ★★★☆☆ | 공통 로직 추상화, 권한/로딩 처리 등              |
| Render Props                     | ★★★★☆   | ★★★★☆ | ★★★★☆ | 로직 공유 + UI 커스터마이징 필요 시              |
| Compound Components              | ★★★★☆   | ★★★★★ | ★★★★☆ | 선언형 API 설계, 복합 UI 구성                    |
| Controlled vs Uncontrolled       | ★★★☆☆   | ★★☆☆☆ | ★★☆☆☆ | 폼 입력 처리, 외부 제어 유무에 따른 전략 선택     |
| Custom Hooks                     | ★★★★★   | ★★★★★ | ★★☆☆☆ | 반복 로직 추출, 관심사 분리, 로직 재사용          |
| State Reducer Pattern            | ★★★★☆   | ★★★★★ | ★★★★☆ | 상태 전환 커스터마이징, 고급 컴포넌트 설계        |
| Provider Pattern (Context API)   | ★★★★★   | ★★★★★ | ★★★☆☆ | 전역 설정/상태 관리, 트리 깊은 컴포넌트 구조      |
| Slot Pattern (props.children 등) | ★★★★☆   | ★★★★☆ | ★★★☆☆ | 유연한 콘텐츠 삽입, 카드/다이얼로그 등 프레임 설계 |

---

<br/>
<br/>


### 👉🏻 정리

리액트 컴포넌트 패턴은 각각 목적과 상황에 따라 적절하게 선택해야 한다.  
모든 패턴을 무조건 적용하기보다는 현재의 요구사항과 팀의 협업 방식, 유지보수 가능성을 고려하여 **유연하게 조합**하는 것이 중요하다!

패턴을 잘 이해하고 활용하면 코드의 품질뿐 아니라 **개발 경험 전체가 훨씬 명확하고 예측 가능해진다.**

