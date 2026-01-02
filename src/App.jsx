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
            className={`nav-tab ${location.pathname === "/" ? "active" : ""}`}
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
          <Route path="/" element={<Home />} />
          <Route path="/meal" element={<Meal />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route
            path="*"
            element={
              <div style={{ padding: "50px", textAlign: "center" }}>
                <h2>페이지를 찾을 수 없습니다.</h2>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
