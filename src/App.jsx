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
import "./Retro.css";

function Nav() {
  const location = useLocation();

  return (
    <nav className="pixel-nav-container">
      <div className="pixel-nav-bar">
        <Link
          to="/"
          className="nav-logo-small"
          style={{ textDecoration: "none" }}
        >
          <span className="logo-text">Pocket Life</span>
        </Link>
        <div className="nav-tabs">
          <Link
            to="/"
            className={`nav-tab ${
              location.pathname === "/" || location.pathname === "/dashboard"
                ? "active"
                : ""
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
          {/* [복구] 일정 탭 */}
          <Link
            to="/schedule"
            className={`nav-tab ${
              location.pathname === "/schedule" ? "active" : ""
            }`}
          >
            일정
          </Link>
          <div className="nav-divider"></div>
          {/* [복구] 가계부 탭 */}
          <Link
            to="/account"
            className={`nav-tab ${
              location.pathname === "/account" ? "active" : ""
            }`}
          >
            가계부
          </Link>
        </div>
        <div className="nav-user-info">ㅇㅇ님 반갑습니다.</div>
      </div>
    </nav>
  );
}

function App() {
  const ReadyPage = ({ title }) => (
    <div
      className="pixel-card"
      style={{ textAlign: "center", padding: "100px", marginTop: "50px" }}
    >
      <h3>{title} 페이지 준비중... 🚧</h3>
    </div>
  );

  return (
    <BrowserRouter>
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/meal" element={<Meal />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/schedule" element={<ReadyPage title="📅 일정" />} />
          <Route path="/account" element={<ReadyPage title="💸 가계부" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
