import React from "react";
// [라우팅 도구] 리액트에서 페이지 이동을 처리하기 위한 필수 컴포넌트들
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
function Nav() {
  const location = useLocation(); // 현재 위치 확인 (탭 색상 변경용)

  return (
    <nav className="pixel-nav-container">
      <div className="pixel-nav-bar">
        {/* [로고 영역] */}
        <Link
          to="/"
          className="nav-logo-small"
          style={{ textDecoration: "none" }}
        >
          <span className="logo-text">Pocket Life</span>
        </Link>

        {/* [중앙 메뉴 탭 영역] */}
        <div className="nav-tabs">
          {/* 1. 대시보드 */}
          <Link
            to="/"
            className={`nav-tab ${location.pathname === "/" ? "active" : ""}`}
          >
            대시보드
          </Link>

          <div className="nav-divider"></div>

          {/* 2. 식단 관리 */}
          <Link
            to="/meal"
            className={`nav-tab ${
              location.pathname === "/meal" ? "active" : ""
            }`}
          >
            식단 관리
          </Link>

          <div className="nav-divider"></div>

          {/* 3. 장보기 */}
          <Link
            to="/shopping"
            className={`nav-tab ${
              location.pathname === "/shopping" ? "active" : ""
            }`}
          >
            장보기
          </Link>

          {/* ▼ [추가됨] 4. 일정 ▼ */}
          <div className="nav-divider"></div>
          <Link
            to="/schedule"
            className={`nav-tab ${
              location.pathname === "/schedule" ? "active" : ""
            }`}
          >
            일정
          </Link>

          {/* ▼ [추가됨] 5. 가계부 ▼ */}
          <div className="nav-divider"></div>
          <Link
            to="/account"
            className={`nav-tab ${
              location.pathname === "/account" ? "active" : ""
            }`}
          >
            가계부
          </Link>
        </div>

        {/* [우측 사용자 정보] */}
        <div className="nav-user-info">ㅇㅇ님 반갑습니다.</div>
      </div>
    </nav>
  );
}

// [메인 앱 컴포넌트]
function App() {
  return (
    <BrowserRouter>
      {/* 네비게이션 바 (항상 보임) */}
      <Nav />

      {/* 실제 페이지 내용이 바뀌는 부분 */}
      <main className="main-content">
        <Routes>
          {/* 1. 대시보드 */}
          <Route path="/" element={<Home />} />

          {/* 2. 식단 관리 */}
          <Route path="/meal" element={<Meal />} />

          {/* 3. 장보기 */}
          <Route path="/shopping" element={<Shopping />} />

          {/* 4. 일정 (아직 파일 없으니 임시 문구 표시) */}
          <Route
            path="/schedule"
            element={
              <div
                className="pixel-card"
                style={{ textAlign: "center", padding: "50px" }}
              >
                <h3>📅 일정 페이지 준비중...</h3>
              </div>
            }
          />

          {/* 5. 가계부 (아직 파일 없으니 임시 문구 표시) */}
          <Route
            path="/account"
            element={
              <div
                className="pixel-card"
                style={{ textAlign: "center", padding: "50px" }}
              >
                <h3>💸 가계부 페이지 준비중...</h3>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
