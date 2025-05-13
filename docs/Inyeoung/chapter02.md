# 리액트 핵심 요소 깊게 살펴보기 - JSX, 가상 DOM과 리액트 파이버



# JSX

JSX는 XML과 유사한 내장형 구문이며, 리액트에 종속되지 않는 독자적인 문법이다. JSX가 포함된 코드를 아무 처리 없이 그대로 실행하면 에러가 발생한다. JSX는 반드시 트랜스파일러를 거쳐야 JS 런타임이 이해할 수 있는 의미 있는 JS 코드로 변환된다.

JSX의 목적은 다음과 같다.

- HTML이나 XML을 Javascript 내부에 표현
- 다양한 속성의 트리구조를 트랜스파일러를 거쳐 Javascript(ECMAScrip)t가 이해할 수 있는 코드로 변경
    
    *따라서 JSX는 HTML, XML 외에도 다른 구문으로 확장될 수 있게끔 설계되어 있음!
    

### JSX 구성 컴포넌트

- JSXElement : 하나의HTML element를 표현하는 구조
    
    ```jsx
    const element = <Button color="red">Click me</Button>;
    ```
    
- JSXAttributes : JSXElement에 부여할 수 있는 속성을 의미한다.
    
    아래에서 `color="red"`와 `size="large"`가 해당
    
    ```jsx
    const element = <Button color="red" size="large" />;
    ```
    
- JSXChildren : JSXElement의 자식값을 나타낸다. 이를 바탕으로 트리 구조를 나타낸다.
- JSXString : JSX로 표현된 문자열
    
    이는 실제 JSX가 아니기 때문에 JSX로 렌더링하려면 `dangerouslySetInnerHTML` 같은 API가 필요하다.
    
    ```jsx
    const jsxString = "<div>Hello</div>"
    ```
    

### JSX는 어떻게 Javascript에서 변환될까?

JSX는 `@babel/plugin-transform-react-jsx` 을 통해 Javascript가 이해할 수 있는 형태로 변환된다.

1. 예를 들어 입력 JSX가 다음과 같다고 하자
    
    ```jsx
    const element = (
      <div>
        <h2>Hello</h2>
        <p>World</p>
      </div>
    );
    ```
    
    Babel 플러그인은 내부적으로 JSX를 AST(Abstract Syntax Tree)로 분석한다. 예로 위의 `<h2>Hello</h2>` 는 다음과 같이 분석된다.
    
    ```jsx
    {
      "type": "JSXElement",
      "openingElement": {
        "name": "h2",
        "attributes": []
      },
      "children": [
        {
          "type": "JSXText",
          "value": "Hello"
        }
      ]
    }
    
    ```
    

1. 이 구조를 기반으로 리액트 17, 바벨 7.9.0 이후 버전에서 추가된 자동 런타임으로 트랜스파일한 결과는 다음과 같다.
    
    ```jsx
    import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
    
    const element = _jsxs("div", {
      children: [
        _jsx("h2", { children: "Hello" }),
        _jsx("p", { children: "World" })
      ]
    });
    
    ```
    

---    

# 가상 DOM과 리액트 파이버

DOM은 웹페이지에 대한 인터페이스로, 브라우저가 웹페이지의 콘텐츠와 구조를 어떻게 보여줄지에 대한 정보를 담고 있다.

### 렌더링 과정

먼저 브라우저가 웹 사이트 접근 요청을 받고 화면을 그리는 과정에서 어떤 일이 일어나는지 살펴보자.


![image.png](https://velog.velcdn.com/images/zaman17/post/7281bb76-19be-4307-b6b9-4e849b3123a9/image.png)


1. 브라우저가 사용자가 요청한 주소를 방문해 HTML 파일 다운로드 

2. 브라우저의 렌더링 엔진은 HTML을 파싱해 DOM 노드로 구성된 트리(DOM)를 만든다. 

    이 과정에서 CSS 파일을 만나면 해당 CSS 파일도 다운로드 
    
3. 브라우저 렌더링 엔진은 이 CSS를 파싱해 노드로 구성된 트리(CSSOM)을 만든다.

4. 브라우저가 2번에서 만든 DOM을 순회한다. 이때 `display: none` 과 같은 노드는 방문하지 않는다.
5. 4번에서 제외된, 눈에 보이는 노드를 대상으로 CSSOM 정보를 찾고 스타일 정보를 노드에 적용한다. 이 과정은 크게 둘로 나뉜다
    - **레이아웃(layout, reflow)**
        
        → 각 요소의 위치와 크기를 계산하는 단계 (width, height, position…)
        
    - **페인팅(painting)**
        
        → 계산된 위치에 색상, 그림자, 이미지 등 픽셀을 채워 넣는 단계 (color, background, border, 텍스 내용 …)
        

### 가상 DOM의 탄생배경

위의 과정처럼, 브라우저가 웹페이지를 렌더링하는 과정은 복잡하고 비용이 많이 든다. 이때 특정 요소의 변경이 일어나는 경우를 SPA를 사용하는 경우와 사용하지 않는 경우로 나누어 생각해보자.

- SPA를 사용하지 않는 일반적인 웹 페이지의 경우
    
    새 문서를 받아서 DOM을 전체를 재생성한다.
    
- SPA를 사용하는 경우
    
    HTML은 최초 1회만 로딩되고, 페이지 간 이동하며 전체 페이지를 새로 불러오지 않고 필요한 부분의 DOM만 동적으로 수정된다. 
    
    이때 수정이 필요한 부분을 계산해야한다.
    
    - 예를 들어 텍스트/색상이 변경되는 경우 paint가 발생한다.
    - 요소의 크기나 위치가 변경되는 경우 Layout + paint가 모두 발생한다.
    - 부모  DOM 변화로 인해 자식 노드 전체가 영향을 받는다면 전체 subtree 재계산이 필요하다.

⇒ 즉, SPA를 사용할 때 사용자 인터랙션에 따라 어떤 DOM을 어떻게 바꿔야하는지 추적하고 제어하는 작업을 효율적으로 하기 위해 가상 DOM 개념이 탄생했다

<br>

### 가상 DOM을 위한 아키텍처, 리액트 파이버

리액트 파이버(React Fiber)는 리액트의 렌더링 엔진(reconciliation engine)이다.




##### 🔎 재조정(Reconciliation)

<aside>

    리액트에서 어떤 부분을 새롭게 렌더링해야 하는지 가상 DOM과 실제 DOM을 비교하는 알고리즘

</aside>

<br>

간단히, 리액트의 가상 DOM 비교, 업데이트, 렌더링 과정을 더 효율적으로 수행하기 위한 내부 아키텍처이다. 

파이버 재조정자(fiber recconciler)가 파이버를 관리하는데, 이는 가상 DOM과 실제 DOM을 비교해 차이가 있을 경우, 파이버를 기준으로 화면에 렌더링을 요청하는 역할을 한다.


파이버는 다음과 같은 일을 한다.

- 작업을 작은 단위로 분할하고 쪼갠 다음 우선 순위를 매긴다.
- 작업을 일시 중지하고 나중에 다시 시작할 수 있다.
- 이전에 했던 작업을 재사용하거나 필요하지 않는 경우 폐기할 수 있다.

특히, 파이버는 **비동기**로 진행할 수 있다. 이를 통해 사용자 인터랙션에 따른 동시적인 이벤트와 애니메이션을 효율적으로 다룰 수 있게 된다.

파이버의 과정은 크게 두가지로 나뉜다.

1. **Render Phase** : 작업 단위를 하나씩 처리한다. 이때 비동기 작업이 가능하며, 우선순위를 지정하거나 중지시키거나 버리는 작업 등을 통해 가상 DOM을 비교하고 변경사항을 계산하여 최적화한다.
2. **Commit Phase** : 1번에서 계산된 변경 사항을 실제 DOM에 반영된다. 이는 동기적으로 실행되며 중단될 수 없다.

파이버가 코드로 어떻게 구현이 되어있을까?

아래는 Fiber Node 객체이다. 이는 가상 DOM 트리를 구성하는 작업 단위 객체로, 컴포넌트나 DOM 요소에 대한 모든 정보를 담고 있다.

```jsx
function FiberNode(tag, pendingProps, key) {
  // 구조 구분: FunctionComponent, HostComponent 등
  this.tag = tag;

  // <MyComponent /> 또는 'div' 같은 타입
  this.key = key;
  this.elementType = null;  // JSX에서의 타입
  this.type = null;         // 실제 렌더링에 사용되는 타입
  this.stateNode = null;    // 실제 DOM 노드 or 컴포넌트 인스턴스

  // 트리 연결
  this.return = null;       // 부모 Fiber
  this.child = null;        // 첫 자식 Fiber
  this.sibling = null;      // 다음 형제 Fiber
  this.index = 0;

  // ref
  this.ref = null;

  // props/state 관련
  this.pendingProps = pendingProps;  // 새 props
  this.memoizedProps = null;         // 이전 props
  this.updateQueue = null;           // useState 등 업데이트 큐
  this.memoizedState = null;         // 이전 state
  this.dependencies = null;          // context or Suspense

  // 렌더링 결과 추적
  this.mode = 0;                     // ConcurrentMode 등
  this.flags = 0;                    // 변경 필요 여부
  this.subtreeFlags = 0;
  this.deletions = null;            // 삭제될 하위 노드들

  // 더블 버퍼링 (current <-> work-in-progress)
  this.alternate = null;

  // React 18 관련: 스케줄링
  this.lanes = 0;                   // 현재 작업 우선순위
  this.childLanes = 0;

  // React 18 concurrent features
  this.transitions = null;         // startTransition 사용 시
}

```

리액트 요소와 유사하지만, 리액트 요소와 달리 파이버는 컴포넌트가 최초로 마운트되는 시점에 생성되어 가급적으로 재사용된다.

Fiber 관련 함수는 예시로 다음이 같다.

- `createFiber()`: 새 Fiber Node를 생성하는 기본적인 함수
- `createFiberFromElement()` : JSX 요소 하나를 기반으로 하나의 `FiberNode`를 생성하는 함수

<br>
    

##### 🔎 Fiber - element 간의 관계

<aside>
    
    하나의 element에 하나의 Fiber가 생성되는 1:1 관계를 가지고 있다. 
    여기서 1:1로 매칭되는 것은 리액트 컴포넌트 / HTML DOM 노드 .. 등등이 될 수 있다.
    
</aside>
    
<br>

이렇게 생성된 파이버는 state가 변경되거나 생명주기 메서드가 실행되거나, DOM의 변경이 필요한 시점 등에 실행된다. 리액트가 파이버를 처리할 때, 작업들을 바로 처리하기도 하고, 나눠서 처리하기도 하고, 우선순위에 따라 작업을 빠르게 혹은 연기시키는 등 유연하게 처리한다. 

### 리액트 파이버 트리

파이버 트리는 리액트 내부에서 두 개가 존재한다.

- **current 트리**
    
    현재 실제 DOM과 동기화된 Fiber 트리
<br>
    
- **workInProgress 트리**
    
    다음 상태로 렌더링 할 임시 트리
    

리액트는 파이버의 `workInProgress 트리` 의 작업이 끝나면, 포인터만 변경하여 `workInProgress 트리` 를 `current 트리`로 바꾼다. 이를 **더블 버퍼링**이라고 한다. 이 더블 버퍼링은 Commit Phase에서 실행된다.

![image.png](https://miro.medium.com/v2/resize:fit:1400/1*vtQ99HV8g7ftxHE7oJIr2g.png)

아까의 두 단계로 표현한 파이버 과정을 자세히 알아보자

- **Render Phase**
    1. 상태 변경 발생 (`setState`, `props 변경`)
    2. `createWorkInProgress()` → 현재 트리 복사본 생성
    3. `beginWork()` → 자식 Fiber 생성/업데이트
        - `FunctionComponent` → `updateFunctionComponent`
        - `HostComponent` → `updateHostComponent`
    4. 자식 → 형제 → 부모 방향으로 깊이 우선 탐색
    5. `completeWork()` → DOM 요소 준비 및 flags 설정 

<br>

- **Commit Phase**
    1. 루트 Fiber에서부터 트리 탐색
    2. `flags`에 따라 DOM 수정:
        - `Placement`: 노드 삽입
        - `Update`: 속성 수정
        - `Deletion`: 노드 제거
    3. `ref` 설정
    4. `useEffect`, `useLayoutEffect` 실행

이러한 가상 DOM의 핵심은 **UI를 값으로 관리**함으로써 흐름을 효율적으로 관리할 수 있게 한다.