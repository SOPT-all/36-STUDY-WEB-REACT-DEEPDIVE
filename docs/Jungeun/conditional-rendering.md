# 리액트에서 조건문 활용하기

이번주 주제가 '리액트 개발을 위해 꼭 알아야 할 자바스크립트'인 만큼 제가 리액트를 사용할 때 자주 사용하는 문법을 가지고 구체적으로 얘기해보려 해요. 이번 주차에 삼항 조건 연산자에 대한 내용이 나왔고, 이를 확장해서 얘기 해보려고 해요. 삼항 조건 연산자 말고 다른 조건문이 어떤 것이 있는 지 보고, 어떻게 구분해서 활용하는지 얘기해보려고 해요.

---

자바스크립트의 삼항 조건 연산자의 기본적인 구조는 아래와 같아요.

```
조건문 ? true인 경우 : false인 경우;
```

위와 같이 간단한 방식으로 `true` / `false`를 제어할 수 있어요.  
보통의 if문 보다 간단한 방식으로 사용할 수 있어서 코드를 작성하다 보면 많이 사용하게 돼요.

참고로 `false` 외의 `null`, `NaN`, `0`, 빈 문자열(`''`), `undefined`는 **falsy**한 경우이기 때문에 false인 경우로 실행돼요.

삼항 조건 연산자를 중첩해서 사용할 수도 있어요. 하지만 이 경우에 가독성이 떨어지는 코드가 되기 때문에 중첩해서 사용 하는 것은 지양하고 있어요.

```tsx
const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
```

위의 코드는 `score`이 90보다 큰 지 비교하고 참이면 `A`, 거짓이면 `score`을 80보다 큰 지 비교하여 참이면 `B`, 거짓이면 70과 비교하여 참이면 `C`, 거짓이면 `F`를 대입합니다.

읽다보면 의미를 파악할 수 있지만 알아보기 쉬운 코드는 아니라고 생각해요.

이번엔 `if문`을 사용한다면 아래처럼 작성할 수 있어요.

```tsx
const getGrade = (score: number) => {
  if (score >= 90) return "A";
  else if (score >= 80) return "B";
  else if (score >= 70) return "C";
  else return "F";
};

const grade = getGrade(score);
```

삼항 조건 연산자를 사용한 경우보다 이해가 빠르지 않나요? 분기가 잘 되어 있어서 한 눈에 잘 알아볼 수 있어요.  
조건이 다양해지는 경우에는 삼항 연산자보다 if-else 문이 더 좋은 방식이라는 걸 알 수 있어요.

이처럼 상황에 맞는 방법을 선택하는 것이 중요해요.

확장해서 다양한 조건문과 연산자를 보면서 어떤 식으로 구분해서 사용햘 수 있을 지 얘기해볼게요.

<br/>

## 삼항 조건 연산자

삼항 조건 연산자는 조건을 비교하여 true와 false의 경우로 나눠서 처리해요. 삼항 조건 연산자를 사용한다면 짧고 이해하기 좋은 코드를 작성할 수 있어요.

```tsx
src={isOpen ? '/icons/arrow_up.svg' : '/icons/arrow_bottom.svg'}
```

위 경우에는 아코디언이 열려있다면 눌렀을 때 닫혀야 하기 때문에 화살표가 위를 가리키는 이미지, 반대의 경우라면 아래를 가리키는 이미지가 나타나도록 조건 연산자를 사용했어요.

```tsx
<p>{isUsingCamera ? "카메라 중지" : "카메라 시작"}</p>
```

상태에 따라 다른 텍스트를 렌더링하고 싶을 때도 간편하게 JSX 내에서 나타낼 수 있어요.

```tsx
<div
    className={cn(
        'fixed inset-0 z-30 flex items-center justify-center',
        isBackgroundDark ? 'bg-black/60' : 'bg-transparent',
    )}
>
```

조건부 스타일링을 적용하고자 할 때도 간단하게 상태에 맞는 스타일링을 적용할 수 있어요.
<br/>

## switch문

`switch`는 조건에 대한 경우가 여러 가지 생기는 경우 사용해요. 값에 따라 나타내야 하는 항목이 여러개인 경우에 사용하곤 해요.

```tsx
const renderContent = (type) => {
  switch (type) {
    case REQUEST_OPTION.COVER_LETTER:
      return <DetailView />;
    case REQUEST_OPTION.DASH_BOARD:
      return <DashboardView />;
    case REQUEST_OPTION.DETAIL:
      return <DetailView />;
  }
};
```

<!-- 코드 생략 -->

```tsx
<div>{renderContent(type)}<div>
```

이렇게 경우에 따라 다른 요소를 렌더링하고 싶을 때 `switch`를 사용하여 컴포넌트를 반환하도록 구성할 수 있어요. 바로 `return`하면 `break`문도 작성할 필요가 없기 때문에 코드가 길어지지 않아요.

```tsx
export const toKoreanLevelType = (level: ProfileLevel) => {
  switch (level) {
    case PROFILE_LEVEL.MASTER:
      return "마스터";
    case PROFILE_LEVEL.SUB_MASTER:
      return "서브 마스터";
    case PROFILE_LEVEL.CLASSIC:
      return "클래식";
    default:
      return "-";
  }
};
```

들어온 값에 따라 값을 반환하거나 함수를 실행시켜야 할 때도 `switch`를 유용하게 사용해요.

```tsx
switch (pathname) {
  case PATH.PERSONAL_INFORMATION:
  case PATH.REQUIREMENT:
  case PATH.TERMS:
    setCurrentStep("정보 입력");
    break;
  case PATH.CHECK_VOICE:
  case PATH.CHECK_CAMERA:
    setCurrentStep("기기 체크");
    break;
  case PATH.IN_PROGRESS:
    setCurrentStep("진행중");
    break;
}
```

또, 수행해야 하는 작업이 겹친다면 위처럼 `switch` 문을 사용하면 복잡도를 줄일 수 있어요.
<br/>

## if문

`if`는 기본적으로 언어에 상관없이 많은 개발자들이 사용하고 있어요. 분기가 복잡래도 직관적으로 파악할 수 있고 조건의 우선순위를 정할 수도 있어요.

```tsx
if (type === REQUEST_OPTION.COVER_LETTER) {
  return <SortToggleSection />;
}
```

이렇게 `if`을 사용해서 특정 경우에 맞는 컴포넌트를 렌더링할 수 있어요.

하지만 전 렌더링 할 때 `if`을 잘 사용하지 않는데요 그 이유는 별도 함수로 빼내서 작성해야 하기 때문에 단순히 JSX 내부에서 작성한다면 동작하지 않아요.

저는 `if`를 조건부 렌더링보다는 기능 함수를 작성할 때 사용하는 편이에요.

```tsx
export function useAuthStatus() {
  const { updateLogged } = useLoginState();

  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken && refreshToken) {
    updateLogged(true);
  } else {
    removeTokens();
    updateLogged(false);
  }
}
```

이 코드는 `accessToken`과 `refreshToken`이 있다면 로그인 상태를 true로 설정하고,  
둘 중 하나라도 존재하지 않으면 모든 토큰을 제거하고 로그인 상태를 false로 변경해요.

특정 조건을 만족할 때만 별도의 작업을 수행하고, 그 외의 경우엔 공통 처리를 하는 흐름을 위해 `if-else`를 사용했어요.

`else if`는 잘 사용하지 않고 있어요.  
조건이 많을수록 체인이 길어지면서 가독성이 떨어지고, 조건 중복, 순서에 대한 의존성 문제도 발생할 수 있기 때문이에요.

대신, 우선 순위에 따른 분기처리가 필요하면 `else if`를 사용해요.
<br/>

## && 연산자

`if문` 대신 `&& 연산자`를 사용하면 JSX 내부에서 바로 렌더링할 수 있어요.  
`if문`과 동일하게 참인 경우에만 렌더링하지만 더 가독성이 좋은 방법으로 나타낼 수 있어요.

```tsx
<Content>
    {type === REQUEST_OPTION.COVER_LETTER && <SortToggleSection />}
<Content>
```

위의 코드는 `type`이 `REQUEST_OPTION.COVER_LETTER`인 경우에는 `<SortToggleSection />`가 렌더링 되고,  
아니라면 렌더링 되지 않아요.

```tsx
{
  isHelpModalOpen && <HelpModal />;
}
```

변수가 boolean 타입이고 네이밍이 명확하다면 변수만으로도 쉽게 파악할 수 있어요. 특히, 접두사로 is가 붙으면 boolean 값을 나타내곤 하므로 조건부 렌더링을 더 간단하게 처리할 수 있어요.
<br/>

## 객체 매핑

객체로 매핑하여 코드를 작성하면 코드가 길어지지 않고 명확하게 확인할 수 있어요.

```tsx
const renderWriteSection = {
  write: <ResumeForm />,
  file: <FileInput />,
};

<div>{renderWriteSection[resumeType]}</div>;
```

위처럼 작성된 코드는 `switch`를 사용할 때보다 depth를 줄일 수 있어요.  
또, 객체 타입이기 때문에 런타입 중에도 렌더링 하고 싶은 컴포넌트가 생긴다면 동적으로 추가할 수 있어요.

**switch문**과 **객체 매핑**은 비슷한 방식이지만 구분해서 사용할 수 있는데요,  
복잡한 조건이 필요한 경우에는 **switch문**을 사용하는 것이 좋아요.  
단순한 조건을 가지고 있고, 분기가 길어진다면 **객체 매핑**을 통해 코드량을 줄일 수 있어요.

추가적으로, React는 선언형 프로그래밍을 지향하기 때문에 **객체 매핑 방식**은 React의 핵심과도 잘 맞아요.

---

조건 처리가 필요한 경우 상황에 맞는 적절한 방법을 택해서 코드를 작성한다면 더 좋은 코드를 작성할 수 있어요.  
조건을 여러번 체크해야 하는 경우에도 각 조건에 맞는 방법을 선택해요.

```tsx
const renderContent = () => {
  const isDashBoard = selected === REPORT_OPTION.DASH_BOARD;

  const contentMap = {
    [REQUEST_OPTION.COVER_LETTER]: <DetailView />,
    [REQUEST_OPTION.INTERVIEW]: isDashBoard ? (
      <DashboardView />
    ) : (
      <DetailView />
    ),
  };

  return contentMap[type] || null;
};
```

위 코드에서는 조건에 따라 렌더링할 컴포넌트를 선택하는 `renderContent` 함수를 정의했어요.  
우선 `type`의 값 만으로 분기를 나눌 수 있기 때문에 **객체 매핑 방식**을 사용했어요.  
`type`이 `REQUEST_OPTION.INTERVIEW`라면 `<DashboardView />`를 렌더링해요.

`REPORT_OPTION`은 두 개만 존재하기 때문에 **삼항 연산자**를 사용했어요.  
만약에 `REPORT_OPTION`이 여러 개였다면 별도로 **객체 매핑**해서 사용하는 것이 좋은 선택이 될 것 같아요.

---

최근에 조건부 렌더링에 대한 아래 글을 재미있게 읽었는데 한 번 읽어보시면 도움이 될 것 같아요 :) 조건부 렌더링에 대한 많은 개발자들의 의견을 볼 수 있어요.

https://github.com/toss/frontend-fundamentals/discussions/4

조건 처리가 필요한 경우 적절한 방법을 선택해 코드를 작성하면, 기능 구현은 물론 조건부 렌더링에서도 깔끔하고 완성도 있는 코드를 구현할 수 있어요 🍀

좋은 코드를 작성하는 개발자가 되는 그날까지 ... 💪
