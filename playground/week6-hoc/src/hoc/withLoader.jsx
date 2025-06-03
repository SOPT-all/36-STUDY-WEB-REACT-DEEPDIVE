import React, { useEffect, useState } from "react";

// 받아온 url로 데이터 호출하는 기능
// 로딩 중일 시 로딩을 렌더링 하는 기능
export default function withLoader(Element, url) {
  return (props) => {
    const [data, setData] = useState(null);

    useEffect(() => {
      async function getData() {
        const res = await fetch(url);
        const data = await res.json();
        setData(data);
      }

      getData();
    }, []);

    if (!data) {
      return <div>Loading...</div>;
    }

    // 데이터 props를 추가적으로 전달
    return <Element {...props} data={data} />;
  };
}