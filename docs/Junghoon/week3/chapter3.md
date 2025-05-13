# 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?

## 사용자 정의 훅과 고처 컴포넌트의 정의

---

### 사용자 정의 훅 (Custom Hook)

> React의 Hook 기능을 기반으로 사용자가 직접 만든 함수로 컴포넌트 간에 상태 로직을 재사용하기 위해 사용됩니다. 반드시 use로 시작하는 이름을 가져야 하며 다른 훅들 (ex: useState, useEffect)을 내부에서 사용할 수 있습니다.

#### 사용 예시

```ts
// useFetch.tsx
import { useState, useEffect } from "react";

function useFetch(url: string) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, isLoading, error };
}

export default useFetch;
```

```ts
// App.tsx
import useFetch from "./useFetch";

export default function App() {
  const { data, isLoading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/todos"
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data?.slice(0, 5).map((todo: any) => (
        <div key={todo.id}>
          <p>
            <strong>{todo.title}</strong> - {todo.completed ? "완료" : "미완료"}
          </p>
        </div>
      ))}
    </div>
  );
}
```

useFetch(url)은 단순히 데이터를 가져오고, data, isLoading, error을 반환합니다.
만약 훅으로 분리하지 않았다면 fetch로 API 호출을 해야 하는 컴포넌트 내에서 공통적으로 관리되지 않은 여러 state를 각각 컴포넌트에서 직접 선언하고 관리해야 했을 것입니다. 이러한 로직을 사용자 정의 훅으로 만들어 손쉽게 중복되는 로직을 관리할 수 있습니다.

이때, 사용자 훅의 이름을 use로 시작하도록 작성하지 않으면 에러가 발생하는데 그 이유는 React는 훅을 정적 규칙으로 인식하기 때문입니다. 따라서 사용자 정의 훅도 반드시 use로 시작해야합니다. 그렇지 않으면 React가 해당 함수가 훅이라는 걸 인식하지 못하고 훅 규칙 위반으로 간주하게 됩니다.

---

### 고차 컴포넌트 (HOC)

> 컴포넌트를 인자로 받아 새로운 컴포넌트를 반환하는 함수로 컴포넌트의 기능을 확장하거나 공통된 로직을 주입하는 데 사용됩니다. React의 컴포넌트 구조를 함수처럼 조작하여 재사용성을 높입니다.
> 사용자 정의 훅이 use로 시작하듯이 고차 컴포넌트도 일반적으로 with를 접두사로 사용합니다. 이는 필수는 아니지만 개발자들이 컴포넌트의 역할을 빠르게 파악할 수 있도록 합니다.

#### 사용 예시

원래 컴포넌트가

```ts
const Hello = ({ name }: { name: string }) => {
  return <p>{name}님 반갑습니다!</p>;
};

export default Hello;
```

이렇게 있다고 했을 때 고차 컴포넌트를

```ts
//withGreeting.tsx
function withGreeting<P>(WrappedComponent: React.ComponentType<P>) {
  return function EnhancedComponent(props: P) {
    return (
      <div>
        <p>안녕하세요!</p>
        <WrappedComponent {...props} />
      </div>
    );
  };
}

export default withGreeting;
```

이렇게 작성하고 App.tsx에 적용하면

```ts
import Hello from "./Hello";
import withGreeting from "./withGreeting";

const HelloWithGreeting = withGreeting(Hello);

export default function App() {
  return <HelloWithGreeting name="정훈" />;
}
```

> 안녕하세요!
> 정훈님 반갑습니다!

처럼 사용할 수 있습니다. 이렇게 고차 컴포넌트는 "컴포넌트를 감싸서 기능을 더하는 함수"라고 생각하면 쉽습니다.
고차 컴포넌트를 사용할 때 주의할 점 중 하나는 부수 효과를 최소화해야 한다는 것입니다. 고차 컴포넌트는 반드시 컴포넌트를 인수로 받게 되는데 반드시 컴포넌트의 props를 임의로 수정, 추가, 삭제하는 일은 없어야 합니다.

## 그래서 어떨 때 어떤걸 써야 할까?

### 사용자 정의 훅

> 단순히 useEffect, useState와 같이 리액트에서 제공하는 훅으로만 공통 로직을 격리할 수 있다면 사용자 정의 훅을 사용하는 것이 좋습니다. 컴포넌트 내부에 미치는 영향을 최소화해 개발자가 훅을 원하는 방향으로만 사용할 수 있어 좋습니다.

### 고차 컴포넌트

> 컴포넌트 자체를 감싸 기능을 확장하거나 렌더링을 조작해야 할 때 사용하기 좋습니다.
> 예를 들어, 로그인되지 않은 사용자가 특정 컴포넌트에 접근하려 할 때, 해당 컴포넌트를 고차 컴포넌트로 감싸 로그인 화면을 먼저 보여줄 수 있습니다. 이렇게 컴포넌트를 조건부로 교체하는 상황에 고차 컴포넌트가 적합합니다.
