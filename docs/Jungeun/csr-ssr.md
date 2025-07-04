최근 Next.js를 많이 사용하면거 SSR와 CSR이 어떤 차이가 있고 어떻게 동작하는지 등 많은 관심을 받고 있어요. 두 방식의 차이점과 동작 방식 등을 알아보면서 구체화해보려고 해요.

## SPA(Single Page Application)

서버 사이드 렌더링 애플리케이션과 반대되는 개념인 SPA는 렌더링과 라우팅을 할 때 처음 페이지에서 데이터를 모두 불러와요. 이후 페이지 전환 시에 자바스크립트와 브라우저의 `history.pushState`와 `history.replaceState`를 사용해서 변경돼요. 서버가 아닌 클라이언트에서 대다수의 작업을 진행해요.

SPA 방식은 페이지를 불러온 이후에는 서버에서 추가적으로 HTML을 받을 필요 없이 한 페이지에서 모두 작업이 가능해요. 간단하게 말하면 처음 한 번에 전체 페이지를 로드한 후에는 필요한 데이터만 변경하여 화면에 나타내요.

하나의 페이지에서 작업을 처리하기 때문에 싱글 페이지 애플리케이션이라고 불러요. 페이지가 전환될 때 새로운 HTML을 요청하는 것이 아니라 자바스크립트에서 전환된 페이지에 필요한 정보를 가져오고 body 내부에 DOM을 변경해서 페이지를 전환해요. 자바스크립트 리소스와 브라우저 API를 기반으로 동작하게 되는거죠.

### CSR(Client-Side Rendering)

CSR은 말 그대로 클라이언트 측에서 렌더링을 하는 방식을 말해요. 서버에서는 빈 HTML 파일과 JavaScript 번들을 제공하고, 클라이언트에서 이를 실행해서 DOM을 조작하며 페이지를 구성해요. 기본적인 React는 CSR 방식을 사용하고 있어요.

### MPA(Multiple Page Application) 라이프 사이클

<img src="https://www.hestabit.com/blog/wp-content/uploads/2021/08/MPA-Lifecycle.jpg.webp">

1. 사용자가 URL 입력 또는 링크를 클릭해서 브라우저가 서버에 전체 HTML 요청
2. 서버가 완성된 HTML 생성하여 전송하고 브라우저가 HTML 파싱 및 렌더링, CSS, JS, 이미지 등 추가 리소스 로드
3. 새 링크 클릭시 전체 페이지 새로고침하고 모든 리소스 다시 다운로드 됨, 이전 페이지 상태 완전히 소멸
4. 페이지 간 상태 유지 어려워서 쿠키나 세션을 활용

### SPA 라이프 사이클

<img src="https://www.hestabit.com/blog/wp-content/uploads/2021/08/SPA-Lifecycle.jpg.webp">

1. 애플리케이션 전체 JS 번들을 다운로드하고 비어있는 HTML과 JavaScript 로드, JS가 DOM을 생성하고 초기 UI 렌더링
2. API 서버에서 JSON 데이터만 비동기로 요청, AJAX/Fetch를 통한 부분 데이터 교환
3. 실제 페이지 새로고침 없이 History API로 URL만 변경, DOM에서 필요한 부분만 업데이트하기 때문에 페이지 깜빡임 없이 부드러운 전환 가능
4. 애플리케이션 상태를 메모리에 유지하여 페이지 전환시에도 데이터 보존

<img src="https://www.hestabit.com/blog/wp-content/uploads/2021/08/re-create.jpg.webp">

MPA를 사용하게 되면 페이지가 전환될 때마다 다시 로드하고 렌더링해야 하기 때문에 페이지가 전환 과정에서 흰 화면이 나타나는 등 사용자 경험이 저하되는 문제가 발생해요. 또, 상태 유지가 어렵기 때문에 개발자들이 코드를 작성하는 부담이 증가해요.

SPA를 사용하면, 초기 로딩만 살짝 기다리면 이후엔 부드럽게 페이지가 전환돼요.

### 장점

1. 빠르고 부드러운 페이지 전환으로 사용자 경험 향상
2. 초기 로드 이후엔 데이터만 요청하기 때문에 서버 부하 감소
3. 로드된 리소스는 재사용이 가능하므로 캐싱에 편리

### 단점

1. 모든 리소스를 처음 접속 시에 로드하므로 초기 로딩이 길어짐
2. 검색엔진이 JavaScript로 렌더링한 콘텐츠를 인식하기 어려워서 SEO(검색 엔진 최적화)가 어려움
3. 오래 사용했을 때의 메모리 누수 문제가 일어날 수도 있음

자바스크립트 리소스가 증가하면서 초기 로딩 시간도 증가하게 되었고, 사용자 경험을 개선하기 위한 방법을 고민하게 되었어요. 이런 로딩시간을 개선하기 위한 방법으로 고안해낸 것이 **SSR(Server-Side Rendering)** 이에요.

## SSR(Server-Side Rendering)

SSR은 서버에서 사용자에게 보여줄 HTML을 생성하여 클라이언트에게 전송해요. 클라이언트에서는 받은 HTML에 Hydration 과정을 통해 JavaScript의 이벤트 핸들러를 연결해요.

CSR은 사용자 기기에 영향을 받지만 SSR은 서버에서 렌더링을 진행하기 때문에 안정적이고 일관된 렌더링을 제공할 수 있어요.

SSR은 웹페이지의 렌더링의 책임을 서버에, CSR은 클라이언트에게 두고 있어요.

### 동작 방식

<img src="https://blog.kakaocdn.net/dn/E0X5P/btsFJntl6HL/fpoex3NCXecFwzDtNKKqYk/img.png">

1. 사용자가 웹사이트에 요청을 보냄
2. 서버가 렌더링한 HTML파일을 브라우저에 보냄
3. 브라우저는 HTML 파일을 확인하고 화면에 띄움 (JavaScript 내용은 읽지 못해서 페이지 조작은 불가능)
4. 브라우저가 JavaScript를 다운 받은 후 사용자가 조작 가능
5. 브라우저가 JS 프레임워크를 실행
6. 페이지 동작

SSR은 클라이언트가 서버에 데이터를 요청하고 서버는 이를 받아서 처리하여 반환해요. 페이지를 그리는 것이 브라우저가 아니라 서버인거죠.

### 장점

1. 서버에서 HTTP 요청을 수행하고 HTML을 그리기 때문에 클라이언트 측에서 렌더링하는 것보다 초기 로딩 속도 개선 (서버가 클라이언트를 감당할 수 있게 구축된 경우에 해당)
2. 검색 엔진에 제공할 정보가 서버에서 가공해서 HTML에 포함되기 때문에 SEO 최적화 가능
   - SEO : 웹사이트가 검색 엔진에서 더 높은 순위에 노출되도록 최적화하는 과정
3. 렌더링 후 화면이 노출될 때 추가적인 HTML 정보가 추가되지 않기 때문에 레이아웃 변동 및 깜박임 감소 (누적 레이아웃 이동 감소)
4. 서버에서 렌더링을 하기 때문에 사용자 디바이스에 따른 성능 영향을 받지 않음 (인터넷 속도 및 서버 부하 환경 제외)
5. 민감한 작업을 서버에서 수행하기 때문에 보안에 유리

### 단점

1. 서버에서 렌더링을 하기 때문에 서버에서 실행될 수 있는 코드를 작성해야 함 -> 브라우저 객체 사용 불가
2. 클라이언트 요청에 따라 렌더링 할 수 있는 서버 구축이 필요하기 때문에 서버 크기와 유지 비용 고려
3. SSR 환경에서 렌더링 지연 발생 시 사용자에게 정보 제공이 불가능하기 때문에 고민해야 함
4. 페이지 전환 시 새로고침 발생

## CSR VS SSR

프로젝트의 특성에 따라 적합한 방식을 선택하는 것이 중요해요.

**CSR**

- 에플리케이션에 사용자 액션이 많거나 실시간 업데이트가 필요한 경우
- 로그인 후에만 접근 가능한 내부 시스템이나 SEO가 중요하지 않은 비공개 페이지의 경우

**SSR**

- 콘텐츠 중심의 사이트로 SEO가 중요한 경우
- 대용량 JavaScript가 필요하거나 모바일 네트워크 환경에서 많이 접속해서 초기 로딩 성능이 중요한 경우
- 사용자 기기 성능이 제한적인 서비스

-> CSR와 SSR의 장점을 모두 가져가기 위한 **하이브리드 접근법**이 사용됨

#### 하이브리드 접근법

CSR와 SSR을 결합한 방식으로 특정 페이지에는 SSR, 다른 페이지에는 CSR을 적용하는 방식으로 각 페이지에 따라 최적화할 수 있어요.

예를 들면, 초기 페이지에서는 SSR을 통해서 SEO를 최적화하고 빠른 초기로딩을 진행해요. 이후, 사용자가 패이지를 탐색할 때 CSR을 통해 부드러운 페이지 전환을 하도록 구성해요.

Next.js에서 이러한 하이브리드 접근법을 잘 활용할 수 있어요.

## Next.js

Vercel에서 만든 리액트 기반 풀스택 프레임워크로 SSR, CSR을 모두 지원해요.

\* React -> 라이브러리 / Next.js -> 프레임워크

SSR을 통해 빠른 페이지 로딩과 SEO 최적화를 사용하고, 이후 CSR을 적용해서 사용자 경험을 개선할 수 있어요.

Next.js에서 지원하는 다양한 기능을 통해서 개발 효율을 높일 수 있어요.

- 폴더 및 파일 기반 라우팅
- 파일 하나로 일관적인 레이아웃 적용 가능
- 편리해진 캐싱과 데이터 패칭
- 이미지 및 폰트 최적화
- 로딩 및 에러, 요청 핸들링
- 클라이언트 컴포넌트와 서버 컴포넌트 모두 지원
- 백엔드 API 만들 수 있도록 API 라우트 제공

등 Next.js에서 제공하는 기능을 사용하면 부가적인 코드 작성 없이 간단하게 구현에만 집중할 수 있어요.

Next.js를 사용할 때 크게 App Router와 Pages Router 방식을 선택해서 프로젝트를 구성할 수 있어요.

**Pages Router**
파일 기반 라우팅을 제공하고 단순하고 직관적인 구조로 구성되어 작은 프로젝트에 쉽게 사용할 수 있어요.

**App Router**
폴더 기반 라우팅을 사용하고 React 18의 최신 기능을 지원해요
다양한 특수 파일을 통해 여러 기능을 사용할 수 있게 해줘요.
Pages Router보다는 복잡한 구조를 가지고 있어요.

**App Router**는 **v13.4**에서부터 정식으로 지원하기 시작했어요. Pages Router보다 다양한 기능을 가지고 있지만 Pages Router보다 좀 더 복잡한 구조를 갖고 있어요. 더 다양한 **특수파일**을 제공하기 때문에 유연하게 개발할 수 있고 **React의 최신 기능**을 지원하고 있어요.

특히, App Router는 기본적으로는 서버 컴포넌트를 사용해서 렌더링하고, `'use client'`라는 지시어가 있다면 클라이언트 컴포넌트로 렌더링해요.

**간단한 프로젝트**를 진행해보고 싶다면 **Pages Router**, 유연하고 다양한 기능을 활용하고 싶다면 **App Router**를 권장해요.
