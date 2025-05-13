# Chapter 3 리액트 훅 깊게 살펴보기

## 3.2 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?
**재사용**할 수 있는 로직을 관리하는 방법

1. 사용자 정의 훅 (Custom Hook)
2. 고차 컴포넌트 (Higher Order Component)
<br>

### 3.2.1 사용자 정의 훅
- 서로 다른 **컴포넌트 내부에서 같은 로직**을 공유하고자 할 때 주로 사용
- 리액트에서만 사용할 수 있음
- **use**로 시작 → 리액트 훅이라는 것을 바로 인식할 수 있음
<br>

🔍 HTTP 요청을 처리하는 fetch 기반의 사용자 정의 훅
```typescript
import { useEffect, useState } from 'react';

interface UseFetchOptions {
  method: string;
  body?: BodyInit;
}

function useFetch<T>(url: string, { method, body }: UseFetchOptions) {
  // 실제 응답 데이터
  const [result, setResult] = useState<T | undefined>();
  // 로딩 상태 (요청 중 여부)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 응답 성공 여부 (response.ok)
  const [ok, setOk] = useState<boolean | undefined>();
  // HTTP 상태 코드 저장 (200, 404 등)
  const [status, setStatus] = useState<number | undefined>();

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url, {
          method,
          body,
          signal: abortController.signal,
        });

        setOk(response.ok);
        setStatus(response.status);

        if (response.ok) {
          const apiResult = await response.json();
          setResult(apiResult);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log('요청이 중단되었습니다.');
        } else {
          console.error('Fetch 오류:', error);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [url, method, body]);

  // 훅에서 사용할 응답 정보 반환
  return { ok, result, isLoading, status };
}

export default useFetch;
```
- 훅으로 분리하지 않았다면 fetch로 API 호출을 해야 하는 모든 컴포넌트 내에서 공통적으로 최소 4개의 state를 선언해서 구현해야 함
<br>

### 3.2.2 고차 컴포넌트 (HOC)
- **컴포넌트 자체의 로직**을 재사용하기 위한 방법
- 고차 함수(Higher Order Function)의 일종으로, 자바스크립트 함수의 특징을 이용하므로 자바스크립트 환경에서 쓰일 수 있음
    - HOF: 함수를 인자로 받거나, 함수를 반환하는 함수 
- 리액트에서 제공하는 API 중 하나인 React.memo도 고차 컴포넌트의 한 종류!
<br>

#### React.memo란?
🔍 React.memo 사용 X
```typescript
import { useEffect, useState, ChangeEvent } from 'react';

const ChildComponent = ({ value }: { value: string }) => {
  useEffect(() => {
    console.log('렌더링!');
  });

  return <>안녕하세요! {value}</>;
};

function ParentComponent() {
  const [state, setState] = useState(1);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setState(Number(e.target.value));
  }

  return (
    <>
      <input type="number" value={state} onChange={handleChange} />
      <ChildComponent value="hello" />
    </>
  );
}
```
- 부모 컴포넌트가 렌더링될 때마다 자식 컴포넌트도 렌더링됨
    - 자식 컴포넌트는 의존성 배열이 없는 useEffect를 사용하고 있어, 렌더링될 때마다 useEffect가 매번 실행됨
- input 값 수정 → setState() 실행 → ParentComponent 리렌더링 → ChildComponent 리렌더링
<br>

🔍 React.memo 사용 O
```typescript
const ChildComponent = memo(({ value }: { value: string }) => {
  useEffect(() => {
    console.log('렌더링!');
  });

  return <>안녕하세요! {value}</>;
});
```
- ChildComponent에 React.memo 사용
- props가 변경되지 않았다는 것을 memo가 확인하고, 이전에 기억한 컴포넌트를 그대로 반환!
    - 리렌더링 X
<br>

```typescript
function add(a) {
  return function (b) {
    return a + b;
  };
}

const result = add(1);   // result는 이제 function (b) { return a + b }를 가리킴
const result2 = result(2);  // result(2) → a=1, b=2 → 3
```
- add 함수는 함수를 반환하므로 고차 함수
- result는 함수를 가리키는 변수
> result1 = add(2);
> result3 = result1(5); // 2+5=7

<br>

#### 고차 함수를 활용한 리액트 고차 컴포넌트 만들어보기
```typescript
import React from 'react';

// 1. 로그인 여부를 나타내는 props 타입 정의
interface LoginProps {
  loginRequired?: boolean;
}

// 2. 고차 컴포넌트 정의
function withLoginComponent<T>(Component: React.ComponentType<T>) {
  return function (props: T & LoginProps) {
    const { loginRequired, ...restProps } = props;

    if (loginRequired) {
      return <>로그인이 필요합니다.</>;
    }

    return <Component {...(restProps as T)} />;
  };
}

// 3. 원래 컴포넌트 정의 후 고차 컴포넌트로 감싸기
const Component = withLoginComponent((props: { value: string }) => {
  return <h3>{props.value}</h3>;
});

// 4. 실제 사용 예시
export default function App() {
  const isLogin = true;

  return (
    <div>
      <Component value="text" loginRequired={isLogin} />
      {/* 또는 loginRequired prop을 아예 생략해도 됨 */}
      {/* <Component value="text" /> */}
    </div>
  );
}
```
- Component를 withLoginComponent(고차 컴포넌트)로 감싸면서, 기존 props인 value 외에도 loginRequired 같은 로그인 관련 props를 전달할 수 있게 됨
- loginRequired 값에 따라 '로그인이 필요합니다' 또는 value 값을 출력
- loginRequired를 안 넘기면 (undefined), 로그인 제한 없이 항상 value 값 출력
<br>

> 고차 컴포넌트는 **컴포넌트 전체를 감쌀 수 있다**는 점에서 사용자 정의 훅보다 컴포넌트에 더욱 큰 영향력을 미침

<br>

⚠️ 주의할 점
- **with**로 시작하는 이름 사용
    - use의 경우와 같이 ESLint 규칙 등으로 강제되는 사항 X / 일종의 관습!
- 부수 효과 최소화
    - 반드시 컴포넌트를 인수로 받게 되는데, 컴포넌트의 props를 임의로 수정, 추가, 삭제 X
- 여러 개의 고차 컴포넌트로 컴포넌트를 감쌀 경우 복잡성 ⬆️
    - 고차 컴포넌트는 최소한으로 사용
<br>

### 3.2.3 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?
#### 사용자 정의 훅이 필요한 경우
- useEffect, useState와 같이 리액트에서 제공하는 훅으로만 공통 로직을 격리할 수 있을 경우
- 사용자 정의 훅은 그 자체로는 **렌더링에 영향을 미치지 못함**
- 컴포넌트 내부에 미치는 영향을 최소화해, 개발자가 훅을 원하는 방향으로만 사용할 수 있다는 장점

```typescript
// 사용자 정의 훅 방식
function HookComponent() {
  const { loggedIn } = useLogin();

  useEffect(() => {
    if (!loggedIn) {
      // do something..
    }
  }, [loggedIn]);
}

// 고차 컴포넌트 방식
const HOCComponent = withLoginComponent(() => {
  // do something...
});
```

- useLogin은 단순히 loggedIn에 대한 값만 제공할 뿐, 처리는 컴포넌트를 사용하는 쪽에서 원하는 대로 사용 가능
    - 부수 효과가 비교적 제한적!
- withLoginComponent는 고차 컴포넌트가 어떤 일을 하는지, 어떤 결과물을 반환할지는 고차 컴포넌트를 직접 보거나 실행하기 전까지 알 수 없음
    - 대부분의 고차 컴포넌트는 렌더링에 영향을 미치는 로직이 존재하므로, 비교적 예측하기가 어려움

✅ 컴포넌트 전반에 걸쳐 동일한 로직으로 값을 제공하거나 특정한 훅의 작동을 취하게 하고 싶다면 사용자 정의 훅 사용
<br>

#### 고차 컴포넌트를 사용해야 하는 경우
```typescript
// 사용자 정의 훅 방식
function HookComponent() {
  const { loggedIn } = useLogin();

  if (!loggedIn) {
    return <LoginComponent />;
  }

  return <>안녕하세요</>;
}

// 고차 컴포넌트 방식
const HOCComponent = withLoginComponent(() => {
  // 로그인 상태는 신경 쓰지 않음
  return <>안녕하세요</>;
});
```
- HookComponent는 개발자가 로그인 상태를 직접 판단해서 제어함
- HOCComponent는 로그인 여부에 따른 제어는 고차 컴포넌트가 맡고, 개발자는 내용에만 집중할 수 있음
    → 더 간단하고 깔끔한 컴포넌트 작성이 가능해짐

✅ **렌더링의 결과물에도 영향**을 미치는 공통 로직이라면 고차 컴포넌트 사용
<br>

### 💡 정리

| 구분             | 사용자 정의 훅 (Custom Hook)                            | 고차 컴포넌트 (Higher Order Component)                          |
|------------------|----------------------------------------------------------|------------------------------------------------------------------|
| 목적           | 로직(데이터, 상태, 부수 효과)을 추상화                   | UI 렌더링 흐름을 제어하거나 조건부로 감싸기                     |
| 사용하는 쪽     | 내부에서 직접 로직 제어 가능                              | 로직을 위임하고 결과만 사용                                     |
| 예측 가능성     | 높음 (훅 내부가 명확하게 보임)                            | 낮음 (렌더링 여부, 처리 방식이 감춰짐)                          |
| 재사용 방식     | 로직 복사 없이 함수처럼 호출                              | 컴포넌트를 감싸 새로운 컴포넌트로 생성                          |
| 주요 용도       | 상태 관리, API 요청, 이벤트 추적, 로딩 등                | 인증 처리, 접근 제어, 레이아웃 래핑 등                          |
| 대표 예시       | `useFetch`, `useLogin`, `useDarkMode`                   | `withLoginComponent`, `withAuth`, `withLayout`                  |
| 적합한 경우     | 여러 컴포넌트에서 **공통된 로직만 공유**하고 싶을 때     | 여러 컴포넌트에 **공통된 구조/제어 흐름을 부여**하고 싶을 때   |
| 사용 위치       | 함수 내부 (컴포넌트에서 직접 호출)                       | 함수 외부 (컴포넌트를 감쌈)                                      |
