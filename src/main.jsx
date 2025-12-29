import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // 만약 Retro.css만 쓴다면 이 줄은 지워도 됨 (혹은 기본 초기화용으로 둠)

// [리액트 진입점]
// 여기서부터 리액트 앱이 시작됩니다.
// index.html 파일 안에 있는 <div id="root"> 태그를 찾아서 가져옵니다.
ReactDOM.createRoot(document.getElementById("root")).render(
  // [StrictMode]
  // 개발 모드에서 잠재적인 문제를 감지하기 위해 검사기를 켜는 역할입니다.
  // (배포 시에는 자동으로 무시됨)
  <React.StrictMode>
    {/* 우리가 만든 App 컴포넌트를 화면에 그립니다 */}
    <App />
  </React.StrictMode>
);
