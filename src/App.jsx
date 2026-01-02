import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Meal from "./pages/Meal";
import Shopping from "./pages/Shopping";
// [핵심] 학원 PC로 동기화된 실제 컴포넌트들 연결
import Login from "../../Self_Practice/Login";
import Signup from "../../Self_Practice/Signup";
import Schedule from "../../Self_Practice/Schedule";
import "./Retro.css";

function Nav() {
  const location = useLocation();

  // 로그인, 회원가입 화면에서는 상단 메뉴바 숨김 처리
  if (["/", "/login", "/signup"].includes(location.pathname)) return null;

  return (
    <nav className="pixel-nav-container">
      <div className="pixel-nav-bar">
        <Link
          to="/dashboard"
          className="nav-logo-small"
          style={{ textDecoration: "none" }}
        >
          <span className="logo-text">Pocket Life</span>
        </Link>
        <div className="nav-tabs">
          <Link
            to="/dashboard"
            className={`nav-tab ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            대시보드
          </Link>
          <div className="nav-divider"></div>
          <Link
            to="/meal"
            className={`nav-tab ${
              location.pathname === "/meal" ? "active" : ""
            }`}
          >
            식단 관리
          </Link>
          <div className="nav-divider"></div>
          <Link
            to="/shopping"
            className={`nav-tab ${
              location.pathname === "/shopping" ? "active" : ""
            }`}
          >
            장바구니
          </Link>
          <div className="nav-divider"></div>
          {/* [복구] 실제 일정 컴포넌트 연결 */}
          <Link
            to="/schedule"
            className={`nav-tab ${
              location.pathname === "/schedule" ? "active" : ""
            }`}
          >
            일정
          </Link>
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
        <div className="nav-user-info">효민님 반갑습니다.</div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="main-content">
        <Routes>
          {/* [수정] 첫 접속 시 로그인 페이지가 나오도록 설정 */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={<Home />} />
          <Route path="/meal" element={<Meal />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/schedule" element={<Schedule />} />
          {/* 가계부만 준비중으로 유지 */}
          <Route
            path="/account"
            element={
              <div
                className="pixel-card"
                style={{
                  textAlign: "center",
                  padding: "100px",
                  marginTop: "50px",
                }}
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
