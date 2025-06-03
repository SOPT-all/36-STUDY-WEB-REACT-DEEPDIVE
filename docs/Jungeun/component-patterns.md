# React Component Patterns

리액트 컴포넌트 패턴은 애플리케이션을 개발할 때 사용할 수 있는 템플릿과 같은 역할로, 틀에 맞춰 코드를 작성하게 돼요.
강제적인 룰은 아니지만 컴포넌트 패턴을 활용하면 더 좋은 구조로 컴포넌트를 구현할 수 있어요.

컴포넌트 패턴은 리액트 개발자를 위한 컴포넌트 가이드라인이라고 생각해요. best practice 코드를 구현할 수 있도록 도와주며, 다양한 경우를 고려한 컴포넌트 패턴이 많이 존재하기 때문에 자신의 상황에 맞는 패턴을 선택해서 구현해야해요. 컴포넌트 패턴은 문제를 해결하는데 도움을 주고, 다른 개발자들도 코드를 봤을 때 어떤 구조로 되어있는지 빠르게 파악할 수 있어요.

## 컴포넌트 패턴의 필요성

- 효율성 : 재사용 가능한 컴포넌트를 구현할 수 있도록 돕고, 개발 속도 또한 향상돼요.
- 유지보수성 : 다른 개발자가 어렵지 않게 코드를 이해하고 관리할 수 있도록 도와줘요.
- 확장성 : 구조화된 컴포넌트의 사용으로 복잡도를 낮추고 확장에 쉽게 대응가능하도록 구성할 수 있어요.

## 다양한 컴포넌트 패턴 알아보기

### 1. Container and Presentational

리액트에서 많이 사용되는 패턴 중 하나로 **로직 (Container)** 과 **UI (Presentational)** 를 분리해서 재사용 가능한 컴포넌트로 구성해요.

```jsx
// Presentational
const Counter = ({ count, onIncrement, onDecrement }) => {
  return (
    <>
      <div>{count}</div>
      <div className="space-x-4">
        <button onClick={onDecrement}>-</button>
        <button onClick={onIncrement}>+</button>
      </div>
    </>
  );
};

// Container
const CounterContainer = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => prev - 1);
  };

  return (
    <Counter
      count={count}
      onIncrement={handleIncrement}
      onDecrement={handleDecrement}
    />
  );
};
```

위 코드처럼 기능과 UI가 나눠서 작성하는 패턴이에요.
데이터를 내려서 사용하기 때문에 컴포넌트를 여러번 사용하거나 다양한 파일에서 사용할 때도 유용해요.

그렇기 때문에 간단한 컴포넌트에도 사용한다면 불필요한 파일이 생기기고 복잡해질 수 있어요.

### 2. Compound Components

여러 컴포넌트가 하나에 함쳐져 동작하는 패턴으로 사용하는 곳에서 원하는 형식으로 조합할 수 있기 때문에 유연하게 나타낼 수 있어요.

작은 컴포넌트를 조립해서 원하는 형식으로 큰 컴포넌트를 만들어요,

```jsx
const DropdownContext = createContext();

const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const selectItem = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <DropdownContext.Provider value={{
      isOpen,
      selectedItem,
      toggle,
      selectItem
    }}>
      <div className="dropdown">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownContainer = ({ children }) => {
  const { toggle } = useContext(DropdownContext);

  return (
    <button onClick={toggle} className="dropdown-container">
      {children}
    </button>
  );
};

const DropdownMenu = ({ children }) => {
  const { isOpen } = useContext(DropdownContext);

  if (!isOpen) return null;

  return (
    <div className="dropdown-menu">{children}</div>
  );
};

const DropdownItem = ({ children, value }) => {
  const { selectItem } = useContext(DropdownContext);

  return (
    <div className="dropdown-item"
      onClick={() => selectItem(value)}
    >
      {children}
    </div>
  );
};

Dropdown.Container = DropdownContainer;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;

const DropdownItem = ({ children }) => <div>{children}</div>;

...

<Dropdown>
    <Dropdown.Container>
    <img src="/avatar.jpg" alt="사용자" />
    <span>메뉴</span>
    </Dropdown.Container>

    <Dropdown.Menu>
        <Dropdown.Item value="profile">
            <User className="icon" />
            프로필
        </Dropdown.Item>
        <Dropdown.Item value="settings">
            <Settings className="icon" />
            설정
        </Dropdown.Item>
        <Dropdown.Item value="logout">
            <LogOut className="icon" />
            로그아웃
        </Dropdown.Item>
    </Dropdown.Menu>
</Dropdown>
```

위의 코드와 같이 사용자가 원하는 방식으로 조립해서 선택할 수 있기 때문에 자유로운 구조로 구현할 수 있어요.

### 3. Higher-Order Components (HOC)

컴포넌트를 인자로 받아서 새로운 컴포넌트를 반환하는 패턴이에요. 코드가 잘 분리되고 컴포넌트 로직을 재사용하기에 좋아요.

```jsx
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ..props }) {
    if (isLoading) {
      return <p>로딩 중...</p>;
    }

    return <WrappedComponent {...props} />;
  };
}

function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

...

const UserListWithLoading = withLoading(UserList);

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <UserListWithLoading
      users={users}
      isLoading={loading}
    />
  );
}
```

하지만 위와 같은 경우에 App 내에서 HOC를 생성하면 (`const UserListWithLoading = withLoading(UserList);`) 매번 새로운 컴포넌트가 생성되기 때문에 외부에서 생성해야 해요.

### 4. Custom Hooks

컴포넌트 로직을 재사용 가능한 함수로 추출하는 패턴이에요. Hook에는 네이밍 규칙이 있기 때문에 use로 시작하는 함수로 만들어야 해요.

상태 관리나 사이드 이펙트를 묶어서 재사용 가능한 custom hook으로 만들어 사용하면 캡슐화된 형태로 사용할 수 있어요.

```jsx
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount((prev) => prev + 1), []);
  const decrement = useCallback(() => setCount((prev) => prev - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

...

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>리셋</button>
    </div>
  );
}
```

### 언제 어떻게 선택해야 할까?

로직을 재사용 해야 하는 경우 -> **Custom Hook** / **HOC**
유연한 UI 구성 -> **Compound Components**
상태와 UI를 분리한 구조 -> **Container and Presentational**
전역 상태 관리 -> **Custom Hooks**

리액트에는 다양한 component pattern이 있지만 그 중 잘 사용되는 패턴으로만 정리해봤어요.
