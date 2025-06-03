# 🤙🏻 React 컴포넌트 패턴 정리

## 1️⃣ Compound Components Pattern
- 가장 자주 사용되는 패턴
- 하나의 컴포넌트 내부에서 여러 서브 컴포넌트가 공통된 상태나 컨텍스트를 공유하며 동작하게 만드는 패턴
- 부모 컴포넌트는 상태 및 로직을 갖고 있고, 자식 컴포넌트들은 UI 및 상호작용을 구성함
<br>

**🧱 구조 예시**
```javascript
<Tabs>
  <Tabs.Tab index={0}>WEB</Tabs.Tab>
  <Tabs.Tab index={1}>iOS</Tabs.Tab>
  <Tabs.Panel index={0}>💻 WEB 파트</Tabs.Panel>
  <Tabs.Panel index={1}>📱 iOS 파트</Tabs.Panel>
</Tabs>
```
<br>

**🖥️ 코드 예제**
```javascript
const TabsContext = createContext();

const Tabs = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      {children}
    </TabsContext.Provider>
  );
};

Tabs.Tab = ({ index, children }) => {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  return (
    <button onClick={() => setActiveIndex(index)}>
      {activeIndex === index ? <b>{children}</b> : children}
    </button>
  );
};

Tabs.Panel = ({ index, children }) => {
  const { activeIndex } = useContext(TabsContext);
  return activeIndex === index ? <div>{children}</div> : null;
};
```

**👍🏻 장점**
- 선언적 사용 방식으로 가독성 향상
- 여러 구성 요소가 하나의 상태를 공유할 수 있음
- API가 직관적임
<br>

**👎🏻 단점**
- Context 의존성으로 인해 구조 파악이 어려울 수 있음
- 컴포넌트 간 위치 순서에 의존할 수 있음
<br>

**👀 사용 예**
- Tabs, Accordion, Dropdown, Form.Field 등의 구성에서 사용
<br>

## 2️⃣ Control Props Pattern
- 컴포넌트의 상태를 외부에서 제어할 수 있도록 설계하는 패턴
- 내부적으로는 상태를 갖고 있지만, props로 외부 상태가 들어오면 그걸 우선적으로 반영함
<br>

**🖥️ 코드 예제**
```javascript
const Toggle = ({ on, onToggle }) => {
  return <button onClick={() => onToggle(!on)}>{on ? "ON" : "OFF"}</button>;
};

const App = () => {
  const [isOn, setIsOn] = useState(false);
  return <Toggle on={isOn} onToggle={setIsOn} />;
};
```

**👍🏻 장점**
- 외부에서 상태 제어 가능 → 더 많은 유연성
- controlled / uncontrolled 컴포넌트 구현 모두 가능
<br>

**👎🏻 단점**
- 내부 상태와 외부 상태 충돌 가능성 (양방향 흐름 주의)
- 사용자가 구현 시 더 많은 코드가 필요
<br>

**👀 사용 예**
- input, select, toggle, modal 상태 제어에 유용
<br>

## 3️⃣ Custom Hook Pattern
- React의 Hook 기능을 활용해 공통된 상태 로직을 분리해내고, 여러 컴포넌트에서 재사용 가능하게 만드는 패턴
<br>

**🖥️ 코드 예제**
```javascript
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

**👍🏻 장점**
- 로직 재사용성 극대화
- 테스트와 유지보수가 쉬움
- UI와 상태 로직 분리 가능
<br>

**👎🏻 단점**
- 여러 훅이 중첩되면 디버깅이 어려워질 수 있음
- 적절한 네이밍과 추상화 수준 설정이 필요
<br>

**👀 사용 예**
- useForm, useScroll, useAuth, useFetch, usePrevious
<br>

## 4️⃣ Props Getters Pattern
- 컴포넌트 사용자가 UI를 커스터마이징할 수 있도록, getter 함수 형태로 사용자에게 전달하여, 필요한 props를 쉽게 구성할 수 있게 하는 패턴
<br>

**🖥️ 코드 예제**
```javascript
function useToggle() {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((o) => !o);

  const getTogglerProps = (props = {}) => ({
    ...props,
    onClick: (...args) => {
      props.onClick?.(...args);
      toggle();
    },
    'aria-pressed': on
  });

  return { on, getTogglerProps };
}

const ToggleButton = () => {
  const { on, getTogglerProps } = useToggle();
  return <button {...getTogglerProps()}>Toggle: {on ? "ON" : "OFF"}</button>;
};
```

**👍🏻 장점**
- 컴포넌트 유연성 증가
- 기본 로직은 유지하면서 UI 커스터마이징 가능
<br>

**👎🏻 단점**
- 초보자 입장에서 직관적이지 않을 수 있음
- getter 함수 구조를 정확히 알아야 함
<br>

**👀 사용 예**
- downshift, react-table 같은 라이브러리에서 사용
<br>

## 5️⃣ State Reducer Pattern
- 컴포넌트 내부 상태 로직을 외부로 분리해, 개발자가 상태 변화를 직접 컨트롤할 수 있도록 만드는 패턴
- 마치 useReducer처럼, 사용자 정의 reducer 함수를 통해 상태 변화를 커스터마이징함
<br>

**🖥️ 코드 예제**
```javascript
function useToggle({ reducer = (state, action) => !state } = {}) {
  const [on, setOn] = useState(false);
  const toggle = () => setOn((prev) => reducer(prev, { type: 'toggle' }));
  return { on, toggle };
}

const forceOffReducer = (state, action) => false;

const App = () => {
  const { on, toggle } = useToggle({ reducer: forceOffReducer });
  return <button onClick={toggle}>{on ? "ON" : "OFF"}</button>;
};
```

**👍🏻 장점**
- 상태 전이 과정을 외부에서 완전히 제어 가능
- 다양한 사용자 정의 동작을 지원
<br>

**👎🏻 단점**
- 초반에 설계와 사용법을 이해하기 어려울 수 있음
- 외부 reducer 구현이 복잡해질 수 있음
<br>

**👀 사용 예**
- 유저의 입력/기능 제한 조건이 복잡한 form
- 외부 행동에 따라 상태 전이가 유동적인 컴포넌트
<br>

### 🚀 실제 라이브러리 적용 사례

| 패턴               | 대표 라이브러리                                       |
|--------------------|--------------------------------------------------------|
| Compound Components | Headless UI, Radix UI, React Bootstrap                |
| Control Props       | React Select, Formik, React Modal                     |
| Custom Hook         | React Query, React Hook Form, SWR                     |
| Props Getters       | Downshift, React Aria, React Table                    |
| State Reducer       | Downshift, React Table, React Select                  |

<br>

### 💡 패턴별 핵심 요약

| 패턴              | 키워드                  | 용도                                     |
|-------------------|--------------------------|-------------------------------------------|
| Compound Components | 구성요소 공유           | UI 구조 분할 & 암묵적 상태 공유          |
| Control Props       | 외부 상태 제어          | 커스터마이징 가능한 상태 전달            |
| Custom Hook         | 로직 재사용             | 상태 로직 추출 & 재사용성 확보           |
| Props Getters       | 유연한 UI 확장          | 사용자 정의 props 조합 허용              |
| State Reducer       | 상태 전이 커스터마이징  | 상태 변경 방식 오버라이드 가능           |