# 04장. 서버 사이드 렌더링

## 4.1 서버 사이드 렌더링이란?

### 4.1.1 싱글 페이지 애플리케이션의 세상

**싱글 페이지 애플리케이션이란?**
렌더링과 라우팅에 필요한 대부분의 기능을 서버가 아닌 브라우저의 자바스크립트에 의존하는 방식

최초에 서버에서 최소한의 데이터를 불러온 이후부터는 이미 가지고 있는 자바스크립트 리소스와 브라우저 API를 기반으로 모든 작동이 이뤄진다.

**전통적인 방식의 애플리케이션과 싱글 페이지 애플리케이션의 작동 비교**
과거 서버 사이드에서 작동하던 전통적인 방식의 애플리케이션은 페이지 전환이 발생할 때마다 새롭게 페이지를 요청하고, HTML 페이지를 다운로드해 파싱한다.
이 과정은 페이지를 처음부터 새로 그려야 해서 일부 사용자는 페이지가 전환될 때 부자연스러운 모습을 보게 된다.

이런 페이지 전환을 모두 자바스크립트로 하면 최초에 한번 모두 리소스를 다운로드하고 나면 이후 페이지를 전환할 때 추가로 리소스를 다운로드하는 시간이 필요 없어진다.

**싱글 페이지 렌더링 방식의 유행과 JAM 스택의 등장**
자바스크립트가 다양한 작업을 수행하게 되면서 자바스크립트를 모듈화하는 방안이 논의되기 시작했고 CommonJS와 AMD가 등장했다.
이런 자바스크립트 모듈화의 결신, 사용자 기기의 성능 향상 등으로 자바스크립트가 할 수 있는 일이 다양해졌다.

프레임워크의 등장으로 JAM 스택이 등장했다.
대부분의 작업을 자바스크립트에서 수행할 수 있었기 때문에 자바스크립트, 마크업을 미리 빌드해 두고 정적으로 사용자에게 제공하면 이후 작동은 사용자의 클라이언트에서 실행되므로 서버 확장성 문제에서 더 자유로워질 수 있게 됐다.

**새로운 패러다임의 웹서비스를 향한 요구**
과거 웹 애플리케이션은 단순히 정보를 보여주기 위한 수단에 불과했지만 현재의 웹 애플리케이션은 다양한 작업을 처리하고 있고, 심지어 하이브리드 애플리케이션의 형태로 앱 내부에서도 마치 웹처럼 구동되는 경우도 많다.
사용자의 기기와 인터넷 속도 등 웹 전반을 이루는 환경이 개선되었지만 실제 사용자들이 느끼는 웹 로딩 속도는 이전과 차이가 없거나 오히려 더 느리다.

### 4.1.2 서버 사이드 렌더링이란?

서버 사이드 렌더링은 최초에 사용자에게 보여줄 페이지를 서버에서 렌더링해 빠르게 사용자에게 화면을 제공하는 방식을 의미한다.
싱글 페이지 애플리케이션과 서버 사이드 렌더링의 차이는 웹페이지 렌더링의 책임을 어디에 두느냐다.

싱글 페이지 애플리케이션은 사용자에게 제공되는 자바스크립트 번들에서 렌더링을 담당하지만 서버 사이드 방식을 채택하면 렌더링에 필요한 작업을 모두 서버에서 수행한다.
서버 사이드 렌더링은 서버에서 제공하기 때문에 안정적인 렌더링이 가능하다.

**서버 사이드 렌더링의 장점**
- 최초 페이지 진입이 비교적 빠르다
화면 렌더링이 HTTP 요청에 의존적이거나 렌더링해야 할 HTML의 크기가 커진다면 상대적으로 서버 사이드 렌더링이 더 빠를 수 있다.
서버가 사용자를 감당하지 못하고, 리소스를 확보하기 어렵다면 오히려 싱글 페이지 애플리케이션보다 느려질 수도 있다.

- 검색 엔진과 SNS 공유 등 메타데이터 제공이 쉽다
서버 사이드 렌더링은 검색 엔진 최적화에 유용하다.
싱글 페이지 애플리케이션은 대부분의 작동이 자바스크립트에 의존하는데 메타 정보 또한 마찬가지다. 검색 엔진이 최초에 방문했을 때, 메타 정보를 제공할 수 있도록 조치를 취하지 않으면 검색 엔진이나 SNS 공유 시에 불이익이 있을 수 있다.
서버 사이드 렌더링은 최초 렌더링 작업이 서버에서 일어난다.

- 누적 레이아웃 이동이 적다
누적 레이아웃 이동이란 사용자에게 페이지를 보여준 이후에 뒤늦게 어떤 HTML 정보가 추가되거나 삭제되어 마치 화면이 덜컥거리는 것과 같은 사용자 경험으로 사용자가 예상치 못한 시점에서 페이지가 변경되어 불편을 초래하는 것을 말한다.
서버 사이드 렌더링의 경우 API 요청이 완전히 완료된 이후 완성된 페이지를 제공하므로 누적 레이아웃 이동 문제에서 비교적 자유롭다.

- 사용자의 디바이스 성능에 비교적 자유롭다
자바스크립트 리소스 실행은 사용자의 디바이스에서만 실행되므로 절대적으로 사용자 디바이스 성능에 의존적이다. 그러나 서버 사이드 렌더링을 수행하면 이런 부담을 서버에 나눌 수 있어 사용자의 디바이스 성능으로부터 조금 더 자유로워질 수 있다.

- 보안에 좀 더 안전하다
서버 사이드 렌더링의 경우 인증이나 민감한 작업을 서버에서 수행하고 그 결과만 브라우저에 제공해 이런 보안 위협을 피할 수 있다.

**단점**
- 소스코드를 작성할 때 항상 서버를 고려해야 한다.
서버 사이드 렌더링을 적용하기로 했다면 소스코드 전반에 걸쳐 서버 환경에 대한 고려가 필요하다.
가장 큰 문제가 바로 브라우저 전역 객체인 window나 sessionStorage와 같이 브라우저에만 있는 전역 객체 등이다.
서버에서 실행될 가능성이 있는 코드라면 window 접근을 최소화해야 하고  window 사용이 불가피하다면 해당 코드가 서버 사이드에서 실행되지 않도록 처리해야 한다.

- 적절한 서버가 구축돼 있어야 한다
서버 사이드 렌더링은 말 그대로 사용자 요청을 받아 렌더링을 수행할 서버가 필요하다.

- 서비스 지연에 따른 문제
서버 사이드 렌더링에서 지연이 발생한다면, 특히 최초 렌더링에 발생한다면 큰 문제가 된다.
서버 사이드 렌더링은 사용자에게 보여줄 페이지에 대한 렌더링이 끝나기까지는 사용자에게 어떤 정보도 제공할 수 없다.

### 4.1.3 SPA와 SSR을 모두 알아야 하는 이유

**서버 사이드 렌더링 역시 만능이 아니다**
클라이언트에서 발생하는 모든 무거운 작업을 서버에 미루고, 작업이 모두 서버에서 이뤄진다고 해서 모든 성능 문제가 해결되는 것은 아니다.
잘못된 웹페이지 설계는 오히려 성능을 해칠 뿐만 아니라 눈에 띄는 성능 개선도 얻지 못하고 서버와 클라이언트 두 군데로 관리 포인트만 늘어나기만 하는 역효과를 낳을 수 있다.
웹페이지의 설계와 목적, 우선순위에 따라 싱글 페이지 애플리케이션이 더 효율적일 수도 있다.

**싱글 페이지 애플리케이션과 서버 사이드 렌더링 애플리케이션**
1. 가장 뛰어난 싱글 페이지 애플리케이션은 가장 뛰어난 멀티 페이지 애플리케이션보다 낫다.
2. 평균적인 싱글 페이지 애플리케이션은 평균적인 멀티 페이지 애플리케이션보다 느리다.

**현대의 서버 사이드 렌더링**
최초 웹사이트 진입 시에는 서버 사이드 렌더링 방식으로 서버에서 완성된 HTML을 제공받고, 이후 라우팅에서는 서버에서 내려받은 자바스크립트를 바탕으로 마치 싱글 페이지 애플리케이션처럼 작동한다.

## 4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기

### 4.2.1 renderToString
renderToString은 인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환하는 함수다.
서버 사이드 렌더링을 구현하는 데 가장 기초적인 API로 최초의 페이지를 HTML로 먼저 렌더링한다.
renderToString을 사용하면 먼저 완성된 HTML을 서버에서 제공할 수 있으므로 초기 렌더링에서 뛰어난 성능을 보이고 검색 엔진이나 SNS 공유를 위한 메타 정보도 미리 준비해 제공할 수 있다.
* 리액트의 서버 사이드 렌더링은 단순히 '최초 HTML 페이지를 빠르게 그려주는 데'에 목적이 있다
```ts
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

const html = renderToString(<App />);
console.log(html);
```
위 코드는 App 컴포넌트를 서버에서 HTML 문자열로 변환한다.
renderToString의 결과는 HTML로 이 값을 클라이언트에 전달하면 사용자가 페이지를 빠르게 볼 수 있다.
이벤트 핸들링은 불가능하며, 클라이언트에서 hydrate를 통해 인터랙티브 기능을 활성화해야 한다.

### 4.2.2 renderToStaticMarkup
renderToString과 유사한데 두 함수 모두 리액트 컴포넌트를 기준으로 HTML 문자열을 만든다.
renderToStaticMarkup은 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않기 때문에 리액트에서 사용하는 속성을 제거하면 HTML의 크기를 약간이라도 줄일 수 있다.
```ts
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const Html = () => <div className="content">Hello</div>;

const staticHtml = renderToStaticMarkup(<Html />);
console.log(staticHtml); 
```
위 코드에서는 renderToString과 달리 React 내부 속성을 제거해 더 가볍다.

### 4.2.3 renderToNodeStream
renderToString과 renderToStaticMarkup은 브라우저에서도 실행할 수 있지만 renderToNodeStream은 브라우저에서 사용하는 게 불가능하다.
renderToNodeStream은 Node.js 환경에 의존하고 있다.
renderToString의 결과물은 string인 문자열, renderToNodeStream의 결과물은 Node.js의 ReadableStream이다.
스트림을 활용하면 브라우저에 제공해야 할 큰 HTML을 작은 단위로 쪼개 연속적으로 작성함으로써 리액트 애플리케이션을 렌더링하는 Node.js 서버의 부담을 덜 수 있다.

### 4.2.4 renderToStaticNodeStream
renderToNodeStream과 제공하는 결과물은 동일하나 리액트 속성이 제공되지 않는다.
hydrate를 할 필요가 없는 순수 HTML 결과물이 필요할 때 사용하는 메서드다.

### 4.2.5 hydrate
hydrate 함수는 renderToString과 renderToNodeStream으로 생성된 HTML 콘텐츠에 자바스크립트 핸들러나 이벤트를 붙이는 역할을 한다.
renderToString의 결과물은 단순히 서버에서 렌더링한 HTML 결과물로 사용자에게 무언가 보여줄 수는 있지만 사용자가 페이지와 인터랙션하는 것은 불가능하다.
hydrate는 정적으로 생성된 HTML에 이벤트와 핸들러를 붙여 완전한 웹페이지 결과물을 만든다.
```ts
import React from 'react';
import { hydrate } from 'react-dom';
import App from './App';

hydrate(<App />, document.getElementById('root'));
```
서버에서 전달받은 HTML을 기반으로로 클라이언트에서 동일한 리액트 트리를 생성하며 이벤트 리스너를 연결한다.
hydrate는 서버에서 미리 렌더링된 HTML과 정확히 일치해야 하기 때문에 SSR과 짝을 이루는 중요한 함수다.
