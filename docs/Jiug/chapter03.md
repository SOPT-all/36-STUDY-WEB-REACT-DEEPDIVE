### 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?

우선 사용자 정의 훅은 서로 다른 컴포넌트 내부에서 같은 로직을 공유하고자 사용돼요. 고차컴포넌트와 다른 점은 사용자 정의훅은 리액트에서만 사용가능하지만, 
고차 컴포넌트는 굳이 리액트가 아니더라도 사용할 수 있다는 점에서 차이점을 가지고 있어요

사용자 훅에는 다양한 규칙들이 존재해요 그 중 하나는 반드시 `use` 로 시작하는 함수를 만들어야 한다는 것이에요

### 고차 컴포넌트 

고차 컴포넌트는 컴포넌트 자체의 로직을 제사용하기 위한 방법이에요. 사용자 정의 훅은 리액트 훅을 기반으로 하기에 리액트에서만 사용할 수 있는 기술이지만 고차 컴포넌트는 

고차 함수의 일종으로, 자바스크립트의 일급 객체, 함수의 특징을 이용하므로 굳이 리액트가 아니더라도 자바스크립트 환경에서 널리 사용될 수 있어요.

#### 일급 객체란?

프로그래밍에서 "일급 객체"란 다음과 같은 특징을 가진 엔티티를 말해요:

1. 변수에 할당할 수 있다.
2. 함수의 인자로 전달할 수 있다.
3. 함수의 반환값으로 사용할 수 있다.

자바스크립트에서 함수는 이러한 조건을 모두 만족하므로 일급 객체로 간주돼요. 이 덕분에 고차 함수와 같은 개념이 가능하며, 고차 컴포넌트도 이러한 특성을 활용해 구현할 수 있는거에요

자바 스크립트에서는 함수 자체가 값으로 취급돼요. 따라서 다른 값처럼 변수에 저장하거나, 다른 함수에 전달하거나 반환할 수 있는거에요.

클로저는 앞서 설명했듯이 함수가 생성될 당시의 스코프를 기억하는 특성을 말하는데, 이 역시 함수가 일급 객체이기 때문에 가능해요.

```js
function outer() {
  const secret = "비밀";
  return function inner() {
    console.log(secret); // '비밀'에 접근 가능
  };
}
const closureFn = outer();
closureFn();
```
---
```jsx
const withLogger = (Component) => {
  return function WrappedComponent(props) {
    console.log("컴포넌트 렌더링됨");
    return <Component {...props} />;
  };
};

위 코드처럼 컴포넌트도 함수로 보고 조작할 수 있는 이유가 결국 컴포넌트가 함수이기 때문이에요

다시 고차 컴포넌트 얘기로 돌아가면, 고차 컴포넌트는 고차 함수의 일종이에요 그래서 리액트 환경이 아니더라도 자바스크립트 환경에서 널리 사용될 수 있어요

리액트에서는 이러한 고차 컴포넌트 기법으로 다양한 최적화나 중복 로직을 관리할 수 있는데, 가장 유명한 api 는 React.memo 에요

React.memo 는 리액트컴포넌트의 렌더링과 밀접한 관련이 있는데, 그 중에서도 부모 컴포넌트와 관련이 있어요.
리액트 컴포넌트는 기본적으로 부모 컴포넌트가 새롭게 렌더링되면, 새롭게 렌더링 되는데,

```jsx
    const Childcomponent = ({ value }: { value: string }) => {
    useEffect(() => {
    console. log(' 렌더링!,)
    })
    return ◊안녕하세요! {value}</>
    }
    function ParentComponent() {
    const [state, setstate] = useState(l)
    function handleChange(e: 아angeEvent사ITMLInputElement>) {
    setState(Number(e.target.value))
    }
    return (
    <>
    <input type="number" value={state} onChange={handleChange} />
    <ChildComponent value="heUo" />
    </>
    )
    }
```

예제 코드에서 자식 컴포넌트는 props 인 value = 'hello' 가 변경되지 않았음에도 handleChange로 인해 setState를 실행해 state를 변경하므로 리렌더링이 발생해요

이렇게 prop 의 변화가 없음에도 컴포넌트의 렌더링을 방지하기 위해 만들어진 리액트의 고차 컴포넌트가 바로 React.memo 인거에요

React.memo는 props를 비교해서 이전과 props가 같다면 렌더링 자체를 생략하고, 이전에 기억해 둔 컴포넌트를 반환해요

```jsx
    const ChildComponent = memo(({ value }: { value: string }) => {
    useEffect(() => {
    console.log(' 렌더링 ! ‘)
    })
    return <>안녕하세요! {value}</>
    })
    function ParentComponentO {
    const [state, setstate] = useState(l)
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setState(Number(e.target.value))
    }
    return (
    <>
    <input type="number" value={state} onChange={handleChange} />
    <ChildComponent value=’’hello" />
    </>
    )
    }
```

이제 부모 컴포넌트에서 아무리 state 가 변경되어도 자식 컴포넌트는 리렌더링이 발생하지 않아요 그 이유는 결국 props가 변경되지 않았고, 변경되지 않았다는 것을 memo가 확인하고 이전에 기억한 컴포넌트를 그대로 반환하였기 때문이에요

React.memo는 컴포넌트도 값이라는 관점에서 본 것이므로 useMemo를 사용해서도 동일하게 메모이제이션을 할 수 가 있어요

```jsx
    interface LoginProps {
    loginRequired?: boolean
    }
    function withLoginComponent<T>(Component: ComponentType<T>) {
    return function (props: T & LoginProps) {
    const { loginRequired, ...restProps } = props
    if (loginRequired) {
    return <>로그인이 필요합니다.</>
    }
    return 〈Component {...(restProps as T)} />
    }
    }
    // 원래 구현하고자 하는 컴포넌트를 만들고, withLoginComponent로 감싸기만 하면 끝이다•
    // 로그인 여부, 로그인이 안 되면 다른 컴포넌트를 렌더링하는 책임은 모두
    // 고차 컴포넌트인 withLoginComponent에 맡길 수 있어 매우 편리하다.
    const Component = withLoginComponent((props: { value: string }) => {
    return <h3>{props.value}</h3>
    })
    export default function App() {
    // 로그인 관련 정보를 가져온다.
    const isLogin = true
    return <Component value="text" loginRequired={isLogin} />
    // return <Component value="text" />;
    }
```

위 코드를 보면 Component는 우리가 아는 일반적인 함수 컴포넌트와 같은 평범한 컴포넌트지만, 이 함수 자체를 withLoginComponent 라 불리는 고차 컴포넌트로 감싸두었기 때문에 함수 컴포넌트를 인수로 받아서 컴포넌트를 반환할 수 있어요

고차 컴포넌트를 구현할 때 주의해야 할 점도 있는데, 고차 컴포넌트의 이름도 with 로 시작해야 한다는 것이에요. use의 경우 ESLint 규칙 등으로 강제되는 사항은 아니지만, 리액트 라우터의 withRouter와 같이 리액트 커뮤니티에 퍼진 일종의 관습이에요

즉, with가 접두사로 붙어있는 경우 고차 컴포넌트임을 손쉽게 알아채어 개발자 스스로가 컴포넌트 사용에 주의를 기울일 수 있도록 강제하는 거에요

또, 고차 컴포넌트를 사용할 때 주의할 점은 sideEffect 를 최소화해야 한다는 것인데, 고차 컴포넌트는 반드시 컴포넌트를 인수로 받게 되는데, 컴포넌트의 props를 임의로 수정, 추가, 삭제하는 일이 없도록 설계하는 것이 가장 큰 규칙이에요

### 커스텀 훅과 고차 컴포넌트 중 무엇을 써야할까?

사용자 정의 훅과 고차 컴포넌트 모두 특정 반복 로직을 공통화해 별도로 관리할 수 있다는 특징이 있지만 각각의 특징에 맞는 상황에서 사용해야 해요

커스텀 훅은 이런 상황에서 유용하게 사용될 수 있어요

단순히 useEffect, useState와 같이 리액트에서 제공하는 훅으로만 공통 로직을 격리할 수 있다면 커스텀 훅을 사용하는 것이 좋아요.

커스텀 훅은 렌더링에 영향을 미치지 못하기 때문에 사용이 제한적이므로 컴포넌트 내부에 미치는 영향을 최소화하여 개발자가 훅을 원하는 방향으로만 사용하도록 설계할 수 있어요.

```jsx
// 사용자 정의 훅을 사용하는 경우
    function HookComponent() {
    const { loggedln } = useLogin()
    useEffect(() => {
    if (!loggedln) {
    // do something..
    }
    }, [loggedln])
    }
    // 고차 컴포넌트를 사용하는 경우
    const HOCComponent = withLoginComponent(() => {
    // do something...
    })
```

이 예제 코드를 보면 useLogin은 단순히 loggedIn 에 대한 값만 제공할 뿐 이에 대한 처리는 컴포넌트를 사용하는 쪽에서 원하는 대로 사용 가능하기에, 부수효과를 제한할 수 있어요

반면에 고차 컴포넌트의 경우 어떤 결과물을 반환할지는 고차 컴포넌트를 직접 보거나 실행하기 전까지는 알 수없고, 대부분의 고차 컴포넌트는 렌더링에 영향을 미치는 로직이 존재 하므로 커스텀 훅에 비해 예측하기가 어렵다는 어려움이 있어요. 

즉, 컴포넌트 전반에 걸쳐 동일한 로직으로 값을 제공하거나 특정한 훅의 작동을 취하게 하고 싶다면 커스텀 훅을 사용하는 것이 좋아요

### 고차 컴포넌트를 사용해야 하는 경우

앞선 예제와 같이 만약 로그인되지 않은 어떤 사용자가 컴포넌트에 접근하려 할 때 어플리케이션 관점에서 컴포넌트를 감추고 로그인을 요구하는 컴포넌트를 렌더링해야한다면, 

```jsx
    function HookComponent() {
    const { loggedln } = useLogin()
    if (!loggedln) {
    return <LoginComponent />
    }
    return ◊안녕하세요•</>
    }
    const HOCComponent = withLoginComponent(() => {
    // loggedln state의 값을 신경 쓰지 않고 그냥 컴포넌트에 필요한 로직만
    // 추가해서 간단해졌다, loggedln state에 따른 제어는 고차 컴포넌트에서 해줄 것이다.
    return ◊안녕하세요•</>
    })
```

이러한 작업을 커스텀 훅으로 표현해야 한다면 가정한다면 쉽지 않아요 커스텀 훅은 해당 컴포넌트가 반환하는 렌더링 결과물에 영향을 미치기는 쉽지 않기 때문이에요.

그리고 이렇게 애플리케이션 전반에 나타나는 중복처리는 고차 컴포넌트를 사용해서 처리하는 것이 좋아요
