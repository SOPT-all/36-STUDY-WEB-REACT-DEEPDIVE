# 4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기

기본적으로 리액트는 리액트 애플리케이션을 서버에서 렌더링할 수 있는 API도 제공합니다.
리액트에서 서버 사이드 렌더링을 실행할 때 사용되는 API를 확인해 보려면 리액트 저장소의 `react-dom/server.js`를 확인하면 됩니다. 여기에는 react-dom이 서버에서 렌더링하기 위한 다양한 메서드를 제공하고 있습니다.
기본적인 함수 4개를 먼저 살펴보겠습니다.

## 4.2.1 renderToString

- 인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환하는 함수입니다. 서버 사이드 렌더링을 구현하는 데 가장 기초적인 API로 최초의 페이지를 HTML로 먼저 렌더링합니다.

<details>
<summary>참고 코드 & 추가 설명</summary>

```ts
import ReactDOMServer from "react-dom/server";

function ChildrenComponent({ fruits }: { fruits: Array<string> }) {
  useEffect(() => {
    console.log(fruits);
  }, [fruits]);

  function handleClick() {
    console.log("hello");
  }

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit} onClick={handleClick}>
          {fruit}
        </li>
      ))}
    </ul>
  );
}

function SampleComponent() {
  return (
    <>
      <div>hello</div>
      <ChildrenComponent fruit={["apple", "banana", "peach"]} />
    </>
  );
}

const result = ReactDOMServer.renderToString(
  React.createElement("div", { id: "root" }, <SampleComponent />)
);
```

```ts
<div id="root" data-reactroot="">
  <div>hello</div>
  <ul>
    <li>apple</li>
    <li>banana</li>
    <li>peach</li>
  </ul>
</div>
```

이 코드는 renderToString을 사용해 실제 브라우저가 그려야할 HTML 결과로 만들어낸 모습입니다.

> 결과물을 보면 useEffect와 같은 훅과 handleClick과 같은 이벤트 핸들러는 결과물에 포함되지 않습니다.

renderToString은 인수로 주어진 리액트 컴포넌트를 기준으로 빠르게 브라우저가 렌더링할 수 있는 HTML을 제공하는 데 목적이 있는 함수이기 때문입니다. 즉, 클라이언트에서 실행되는 자바스크립트 코드를 포함시키거나 렌더링하는 역할까지 해주지는 않습니다.

그리고 추가로 주목할 점은 div#root에 있는 data-reactroot 속성입니다. 이 속성은 리액트 컴포넌트의 루트 엘리먼트가 무엇인지 식별하는 역할을 합니다. (이 속성은 이후 hydrate함수에서 루트를 식별하는 기준점이 됩니다.)

</details>

## 4.2.2 renderToStaticMarkup

- 이 함수 또한 앞서 설명한 renderToString과 매우 유사한 함수입니다. 두 함수 모두 리액트 컴포넌트를 기준으로 HTML 문자열을 만든다는 점에서 동일합니다. 한 가지 차이점은 루트 요소에 추가한 data-reactroot와 같은 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는다는 점입니다.

<details>
<summary>참고 코드 & 추가 설명</summary>

```ts
// ..앞 부분 동일

const result = ReactDOMServer.renderToStaticMarkup(
  React.createElement("div", { id: "root" }, <SampleComponent />)
);
```

<summary>결과</summary>

```ts
<div id="root">
  <div>hello</div>
  <ul>
    <li>apple</li>
    <li>banana</li>
    <li>peach</li>
  </ul>
</div>
```

이렇게 바꿔서 실행한 결과 리액트와 관련된 코드인 data-reactroot가 사라진 완전히 순수한 HTML 문자열이 반환된다는 것을 확인할 수 있습니다.
이 함수를 실행한 결과로 렌더링을 수행하면 클라이언트에서는 리액트에서 제공하는 useEffect와 같은 브라우저 API를 절대로 실행할 수 없습니다. 만약 renderToStaticMarkup의 결과물을 기반으로 리액트의 자바스크립트 이벤트 리스너를 등록하는 hydrate를 수행하면 hydrate를 수행하지 않는다는 가정하에 순수한 HTML만 반환하기 때문에 서버와 클라이언트의 내용이 맞지 않다는 에러가 발생합니다.
따라서 renderToStaticMarkup은 리액트의 이벤트 리스너가 필요 없는 완전히 순수한 HTML을 만들 때만 사용됩니다.

</details>

## 4.2.3 renderToNodeStream

- renderToNodeStram은 renderToString과 결과물이 완전히 동일하지만 두 가지 차이점이 있습니다.
  - 앞에서 살펴본 두 API는 브라우저에서도 실행할 수 있지만 renderToNodeStream은 브라우저에서 사용하는 것이 브라우저 환경에서는 사용할 수 없습니다. 이유는 Node.js 런타임에서만 동작하고 있기 때문입니다.
  - 두 번째 차이점은 결과물의 타입입니다. renderToString은 이름에서도 알 수 있듯이 결과물이 string인 문자열이지만, renderToNodeStream의 결과물은 Node.js의 ReadableStream입니다. ReadableStream은 utf-8로 인코딩된 바이트 스트림으로 Node.js나 Deno, Bun 같은 서버 환경에서만 사용할 수 있습니다.

### renderToNodeStream을 사용해야하는 이유?

이를 이해하기 위해서는 스트림의 개념을 이해해야합니다.
스트림은 큰 데이터를 다룰 때 데이터를 청크로 분할해 조금씩 가져오는 방식을 의미합니다.

<details>
<summary>이해시키기</summary>
유튜브와 같은 웹에서 동영상을 보는 상황을 상상해보면 유튜브 영상을 보기 위해 전체 영상을 다운받지 않고 사용자가 볼 수 있는 몇 초라도 먼저 다운로드되면 그 부분을 먼저 보여주고, 이후에 계속해서 영상을 다운로드합니다.
</details>

renderToString이 생성하는 HTML 결과물 크기가 작음 -> 한 번에 생성하는 스트림으로 하든 문제가 되지 않는다. (반환되는 결과물이 작으면 나눌 필요X)

스트림을 활용하면 큰 크기의 데이터를 청크 단위로 분리해 순차적으로 처리할 수 있다는 장점이 있습니다.
따라서 대부분의 널리 알려진 리액트 서버 사이드 렌더링 프레임워크는 모두 renderToString 대신 renderToNodeStream을 채택하고 있습니다.

## 4.2.4 renderToStaticNodeStream

renderToString에 renderToStaticMarkup이 있다면
renderToNodeStream에는 renderToStaticNodeStream이 있습니다.
renderToNodeStream과 제공하는 결과물은 동일하나 renderToStaticMarkup과 마찬가지로 리액트 자바스크립트에 필요한 리액트 속성이 제공되지 않습니다.

# 4.2.5 hydrate

hydrate 함수는 앞서 살펴본 두 개의 함수 renderToString과 renderToNodeStream으로 생성된 HTML 콘텐츠에 자바스크립트 핸들러나 이벤트를 붙이는 역할을 합니다.

<details>
<summary>hydrate와 비슷한 브라우저에서만 사용되는 메서드 render</summary>

```ts
import * as ReactDOM from "react-dom";
import App from "./App";

const rootElement = document.getElementById("root");

ReactDOM.render(<App />, rootElement);
```

보통 react 프로젝트를 생성하면 index.jsx에서 이와 같은 render메서드를 찾아볼 수 있습니다.
render 함수는 컴포넌트와 HTML의 요소를 인수로 받습니다. render는 클라이언트에서만 실행되는 렌더링과 이벤트 핸들러 추가 등 리액트를 기반으로 한 온전한 웹페이지를 만드는데 필요한 모든 작업을 수행합니다.

</details>

> hydrate는 이미 렌더링된 HTML을 대상으로 이벤트 핸들러만 주입한다는 점이 다릅니다.

```ts
import * as ReactDOM from "react-dom";
import App from "./App";

// containerId를 가리키는 element는 서버에서 렌더링된 HTML의 특정 위치를 의미합니다.
const element = document.getElementById(containerId);
// 해당 element를 기준으로 리액트 이벤트 핸들러를 붙입니다.
ReactDOM.hydrate(<App />, element);
```

이때 render와 차이점은 hydrate는 기본적으로 이미 렌더링된 HTML이 있다는 가정하에 작업이 수행되고, 이 렌더링된 HTML을 기준으로 이벤트를 붙이는 작업만 실행한다는 것입니다. 따라서 만약 hydrate의 두 번째 인수로 renderToStaticMarkup 등으로 생성된 리액트 관련 정보가 없는 순수한 HTML 정보를 넘겨주면 에러가 발생합니다.

<details>
<summary>에러 예시</summary>

```html
<!DOCTYPE html>
<head>
    <title>React App</title>
</head>
<body>
    <!-- root에 아무런 HTML도 없을 때 -->
    <div id="root"></div>
</body>
</html>
```

```ts
function App() {
  return <span>안녕하세요.</span>;
}

import * as ReactDOM from "react-dom";

import App from "./App";

const rootElement = document.getElementById("root");

// Warning: Expected server HTML to contain a matching <span> in <div>.
// at Span
// at App

ReactDOM.hydrate(<App />, rootElement);
```

서버에서 제공받은 HTML에 App 컴포넌트에 있는 것과 마찬가지로 <span/>이 있기를 기대했지만 이 요소가 없다는 경고 문구가 출력됩니다. 이는 hydrate가 서버에서 제공해 준 HTML이 클라이언트의 결과물과 같을 것이라는 가정하에 실행된다는 것을 의미합니다. 이 예제를 기준으로 설명하면, rootElement 내부에는 <App />을 렌더링한 정보가 이미 포함돼 있어야만 hydrate를 실행할 수 있다는 것을 의미합니다.
따라서 hydrate로 넘겨준 두 번째 인수에는 이미 renderToString 등으로 렌더링된 정적인 HTML 정보가 반드시 담겨 있어야 합니다. 아무것도 없는 빈 HTML에 이 정보를 렌더링하는 render와의 차이점이 바로 이것입니다.

</details>
