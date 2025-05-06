# 리액트의 렌더링과 파이버 알아보기

## 렌더링이란?

리액트 개발을 하다보면 정말 많이 보게 되는 단어가 '렌더링'이에요. '렌더링'은 간단하게 말하면 웹사이트가 화면에 그려지는 과정이에요.
**리액트에서의 렌더링**은 컴포넌트가 `props`와 `state`를 바탕으로 UI를 계산하는 과정을 말해요. 이 과정은 복잡하고 특히 사용자 인터랙션이 많을수록 더 많은 계산이 필요해요. 리액트는 문제에 대한 해결 방안으로 **가상 DOM(Virtual DOM)** 을 도입했어요.

## 가상 DOM (Virtual DOM)

리액트가 메모리에서 관리하는 DOM으로 실제 브라우저의 DOM과는 달라요.
가상 DOM을 사용하면 실제 DOM을 조작하는 것보다 가볍고 빠르게 수행할 수 있어요. 변경사항을 한 번에 처리하여 실제 DOM 업데이트 횟수를 최소화하기 때문에 비용도 감소돼요.

리액트의 가상 DOM 작동 방식을 간단히 설명하면,

1. `props`나 `state`에 변경 발생
2. 새로운 가상 DOM 트리 생성
3. 이전 가상 DOM과 새로운 가상 DOM 비교
4. 변경을 반영해야 하는 부분만 실제 DOM에 업데이트 (Reconciliation)

하지만 가상 DOM에도 문제가 있었어요

## 가상 DOM의 한계

**동기성**: 리액트의 재조정(reconciliation) 과정은 한 번 시작되면 완료될 때까지 중단할 수 없음
**Java Script의 싱글 스레드**: JavaScript는 싱글 스레드기 때문에 복잡한 UI 업데이트가 발생하면 메인 스레드가 차단되어 UI 응답성이 떨어짐 -> 사용자가 원하는 작업을 수행하지 못하게 될 수 있음
**재귀 사용으로 인한 성능 저하**: 노드를 재귀적으로 검사하여 변경사항을 확인하기 때문에 트리가 깊고 복잡할수록 성능 저하
**프레임 레이트와 브라우저 렌더링**: 보통 모니터는 약 16ms마다 화면을 갱신하는데 코드의 실행 시간이 16ms를 넘기면 화면 끊기는 현상 발생 가능

DOM의 변경사항을 효율적으로 처리하기 위해 리액트는 **파이버 아키텍처(Fiber Architecture)** 를 고안했어요.

## React Fiber

React 16에서 도입된 새로운 재조정 엔진으로 렌더링 작업을 효율적으로 관리해요.

**Incremental Rendering**: 렌더링 작업을 여러 청크로 나누어 유연하게 처리
**작업 우선순위**: 처리할 작업에 대한 우선순위 지정
**일시 중지/재개**: 먼저 처리해야 하는 작업이 있다면 렌더링 일시 중지, 이후 재개 가능
**렌더링 작업 중단/재사용**: 완료된 작업을 재사용하거나 불필요해진 작업 중단 가능
**Error Boundaries**: 컴포넌트에 오류가 발생해도 애플리케이션에 영향을 미치지 않도록 관리

Fiber는 JavaScript 객체로 컴포넌트 인스턴스에는 하나 이상의 Fiber 노드가 할당되어 있고 연결된 노드는 Fiber 트리를 만들어요. 파이버는 컴포넌트가 최초 마운트 될 때 생성되고 이후엔 가급적 재사용해요.

```javascript
// 파이버 객체
function FiberNode(tag, pendingProps, key, mode) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;
  this.refCleanup = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;

  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  this.alternate = null;
  ...
}
```

## Fiber의 동작 방식

1. **Render/Reconciliation 단계 (비동기적)**

- 중단 가능
- 실제 DOM 조작 X
- Effects를 통해 다음에 진행할 작업 리스트 준비

2. **Commit 단계 (동기적)**

- 중단 불가능
- 실제 DOM 조작
- lifecycle methods와 hooks 호출
  <br/>

## Fiber 작업 순서

1. `beginWork()`를 실행해서 파이버 작업 수행
2. `completeWord()`를 실행해서 파이버 작업 완료 처리
3. 형제가 있는 경우엔 형제로 옮겨서 위의 과정 반복
4. 다 완료됐으면 return

**우선순위 레벨**

```javascript
// 레벨 상수
export const ImmediatePriority = 1; // 즉시 실행 필요
export const UserBlockingPriority = 2; // 높음
export const NormalPriority = 3; // 기본
export const LowPriority = 4; // 지연 가능
export const IdlePriority = 5; // 유휴 시간에 처리

// 레벨 별 타임아웃 (단위 : 밀리초)
export const IMMEDIATE_PRIORITY_TIMEOUT = -1; // 타임아웃 없음
export const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
export const NORMAL_PRIORITY_TIMEOUT = 5000;
export const LOW_PRIORITY_TIMEOUT = 10000;
export const IDLE_PRIORITY_TIMEOUT = 1073741823; // 무한대 취급
```

**우선 순위 선정 예시**

- 에러 바운더리 처리: `ImmediatePriority`
- 사용자 입력: `UserBlockingPriority`
- setTimeout: `NormalPriority`
- useTransition, useDeferredValue: `LowPriority`
- 데이터 정리 및 최적화 작업: `IdlePriority`

## Fiber 트리 구조

**current 트리**: 현재 렌더링된 상태의 트리
**workInProgress 트리**: 작업 중인 변경사항 트리

렌더링 과정이 완료되면 workInProgress 트리가 current 트리가 되고, 이전 current 트리는 다음 업데이트를 위해 재사용 해요. 이러한 방식을 **더블 버퍼링**이라고 하며, 렌더링 과정을 최적화하는 데 도움이 도움을 줘요. 더블 버퍼링 과정은 커밋 단계에서 수행돼요.

1. current에 업데이트 발생
2. 업데이트가 포함된 workInProgress 트리 빌드 후 다음 렌더링에 이 트리 사용
3. workInProgress에 렌더링 반영
4. current를 workInProgress로 변경

## 파이버 사용 사례

1. **컴포넌트 분리**: 컴포넌트를 나눠 변경이 필요한 컴포넌트만 업데이트
2. **React.memo 사용**: 불필요한 리렌더링을 방지
3. **useCallback, useMemo**: 함수와 값을 메모이제이션하여 일관성을 유지

React Fiber는 복잡한 리렌더링을 관리해서 사용자 경험 개선과 비용 절감에 중요한 역할을 해요. 쉽지 않은 개념이라고 생각하고 완벽하게 이해하기 위해선 깊은 학습이 필요할 것 같아요 😂
