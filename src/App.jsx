import React from "react";
// [라우팅 도구] 리액트에서 페이지 이동을 처리하기 위한 필수 컴포넌트들
// BrowserRouter: 라우팅 기능 활성화
// Routes: 여러 페이지(Route)들을 감싸는 스위치 역할
// Route: 실제 주소(path)와 보여줄 컴포넌트(element)를 연결
// Link: 클릭 시 페이지를 이동시키는 태그 (<a>태그와 달리 새로고침 안 함)
// useLocation: 현재 내가 어느 주소에 있는지 알려주는 훅 (활성 탭 표시에 사용)
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// [페이지 컴포넌트] 우리가 만든 페이지들 불러오기
import Home from "./pages/Home";
import Meal from "./pages/Meal";
import Shopping from "./pages/Shopping";
import "./Retro.css"; // 전체 디자인(CSS) 연결

// [네비게이션 바 컴포넌트]
// 이 컴포넌트는 모든 페이지 상단에 항상 고정되어 보임
function Nav() {
  // 현재 URL 정보를 가져옴 (예: "/" 또는 "/meal")
  // 이걸로 "어떤 메뉴가 선택되었는지" 판단해서 색깔을 바꿈
  const location = useLocation();

  return (
    // pixel-nav-container: 상단 고정을 위한 바깥 박스
    <nav className="pixel-nav-container">
      <div className="pixel-nav-bar">
        {/* [로고 영역] 클릭 시 홈으로 이동 */}
        {/* Link 컴포넌트를 사용해야 페이지가 깜빡이지 않고 부드럽게 이동함 */}
        <Link
          to="/" // 클릭 시 이동할 주소
          className="nav-logo-small"
          style={{ textDecoration: "none" }} // 링크 밑줄 제거
        >
          {/* 로고 텍스트 (CSS로 꾸며짐) */}
          <span className="logo-text">Pocket Life</span>
        </Link>

        {/* [중앙 메뉴 탭 영역] */}
        <div className="nav-tabs">
          {/* 1. 대시보드 (홈) 링크 */}
          <Link
            to="/"
            // [조건부 스타일링] 현재 주소가 '/'이면 'active' 클래스를 추가해서 하얗게 만듦
            // 템플릿 리터럴(` `)을 사용해서 클래스 이름을 동적으로 조합함
            className={`nav-tab ${location.pathname === "/" ? "active" : ""}`}
          >
            대시보드
          </Link>

          {/* 메뉴 사이 구분선 */}
          <div className="nav-divider"></div>

          {/* 2. 식단 관리 링크 */}
          <Link
            to="/meal"
            className={`nav-tab ${
              location.pathname === "/meal" ? "active" : ""
            }`}
          >
            식단 관리
          </Link>

          <div className="nav-divider"></div>

          {/* 3. 장보기 링크 */}
          <Link
            to="/shopping"
            className={`nav-tab ${
              location.pathname === "/shopping" ? "active" : ""
            }`}
          >
            장보기
          </Link>
        </div>

        {/* [우측 사용자 정보] 일단 고정된 텍스트로 표시 */}
        <div className="nav-user-info">ㅇㅇ님 반갑습니다.</div>
      </div>
    </nav>
  );
}

// [메인 앱 컴포넌트]
function App() {
  return (
    // 1. BrowserRouter: 앱 전체를 감싸야 라우팅 기능이 작동함
    <BrowserRouter>
      {/* 2. Nav: Routes 바깥에 있으므로 페이지가 바뀌어도 사라지지 않고 항상 떠있음 */}
      <Nav />

      {/* 3. Main Content: 실제 페이지 내용이 바뀌는 부분 */}
      <main className="main-content">
        {/* Routes: 주소에 따라 아래 Route 중 하나만 골라서 보여줌 */}
        <Routes>
          {/* path="/" -> Home 컴포넌트 보여줌 */}
          <Route path="/" element={<Home />} />

          {/* path="/meal" -> Meal 컴포넌트 보여줌 */}
          <Route path="/meal" element={<Meal />} />

          {/* path="/shopping" -> Shopping 컴포넌트 보여줌 */}
          <Route path="/shopping" element={<Shopping />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
