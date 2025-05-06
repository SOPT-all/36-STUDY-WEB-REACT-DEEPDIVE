// 🛠️ React 실습 문제: 불필요한 리렌더링 막기
// input에 입력할 때마다 Parent와 Child 둘 다 console에 로그가 찍힌다.


import React, { useState } from 'react';

const Parent = () => {
  const [form, setForm] = useState({ name: "", email: "" });
  console.log("Parent 리렌더링");

  return (
    <div>
      <input 
        value={form.name}
        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
      />
      <Child />
    </div>
  );
};

const Child = () => {
  console.log("Child 리렌더링");
  return <div>Static Content</div>;
};

export default function App() {
  return <Parent />;
}
