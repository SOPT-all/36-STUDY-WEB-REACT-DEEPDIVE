# Compound Component Pattern

## Modal 컴포넌트 만들기

React 컴포넌트 설계 패턴 중 하나인 Compound Component Pattern은 서로 관련된 컴포넌트들을 그룹화하고, 부모 컴포넌트가 자식 컴포넌트에 상태나 메서드를 제공하는 구조입니다. 이 글에서는 `Modal` 컴포넌트를 예시로 이 패턴을 어떻게 구현하고 관리할 수 있는지 설명하겠습니다.

## 1. 기본 구조

```ts
<Modal>
  <Modal.OpenButton>Open Modal</Modal.OpenButton>
  <Modal.Content>
    <h1>This is a Modal</h1>
    <Modal.CloseButton>Close Modal</Modal.CloseButton>
  </Modal.Content>
</Modal>
```

## 2. Modal 컴포넌트와 Context

상태 관리(`isOpen`, `openModal`, `closeModal`)는 Context를 통해 처리합니다.

```ts
// ModalContext.js
import { createContext, useContext } from "react";

const ModalContext = createContext();

const useModal = () => useContext(ModalContext);

export { ModalContext, useModal };
```

```ts
// ModalProvider.js
import { useState } from "react";
import { ModalContext } from "./ModalContext";

const Modal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default Modal;
```

## 3. 서브 컴포넌트

Modal과 함께 동작하는 버튼과 콘텐츠 컴포넌트들을 만듭니다.

```ts
// OpenButton.js
import { useModal } from "./ModalContext";

const OpenButton = ({ children }) => {
  const { openModal } = useModal();
  return <button onClick={openModal}>{children}</button>;
};

export default OpenButton;
```

```ts
// Content.js
import { useModal } from "./ModalContext";

const Content = ({ children }) => {
  const { isOpen } = useModal();
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">{children}</div>
    </div>
  );
};

export default Content;
```

```ts
// CloseButton.js
import { useModal } from "./ModalContext";

const CloseButton = ({ children }) => {
  const { closeModal } = useModal();
  return <button onClick={closeModal}>{children}</button>;
};

export default CloseButton;
```

## 4. 컴파운드 구조 연결

`Modal` 컴포넌트에 서브 컴포넌트들을 붙여줍니다!

```ts
// index.js
import Modal from "./ModalProvider";
import OpenButton from "./OpenButton";
import Content from "./Content";
import CloseButton from "./CloseButton";

Modal.OpenButton = OpenButton;
Modal.Content = Content;
Modal.CloseButton = CloseButton;

export default Modal;
```

이렇게 코드를 구성하면 외부에서

```ts
import Modal from "./ModalComponents";

const App = () => (
  <Modal>
    <Modal.OpenButton>Open Modal</Modal.OpenButton>
    <Modal.Content>
      <h1>This is a Modal</h1>
      <Modal.CloseButton>Close Modal</Modal.CloseButton>
    </Modal.Content>
  </Modal>
);

export default App;
```

이렇게 사용할 수 있습니다.

참고 자료에서는 파일을 분리하지 않았지만 한번 분리해서 작성해보았습니다.

## 5. 폴더 구조

```md
/ModalComponents
├── ModalContext.js
├── ModalProvider.js
├── OpenButton.js
├── Content.js
├── CloseButton.js
└── index.js
```

## 마무리

컴파운드 컴포넌트 패턴은 상태를 공유하는 여러 컴포넌트를 깔끔하게 관리할 수 있게 해줍니다. 규모가 커질수록 `구조화`와 `확장성`에 큰 이점을 가져다 준다고 합니다!!

[참고자료]
https://tech.pxd.co.kr/post/React-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-248
