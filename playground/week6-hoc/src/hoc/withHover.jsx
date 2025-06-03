import React, { useState } from "react";

// 호버 효과를 주는 기능
export default function withHover(Element) {
  return props => {
    const [hovering, setHover] = useState(false);

    // hovering에 대한 props를 추가하여 전달!
    return (
      <Element
        {...props}
        hovering={hovering}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
    );
  };
}