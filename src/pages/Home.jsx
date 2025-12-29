import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 페이지 이동용
import "../Retro.css"; // 디자인 파일

const Home = () => {
  // =================================================================
  // 1. [상태 관리] 변수 선언부
  // =================================================================
  const [currentDate, setCurrentDate] = useState(new Date());

  const [dashboardData, setDashboardData] = useState({
    mealCount: 0,
    recentMenu: "기록 없음",
    shoppingCount: 0,
    shoppingMsg: "장바구니가 비었어요!",
  });

  // =================================================================
  // 2. [기능 함수] 날짜 변환 및 이동
  // =================================================================
  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formattedDate = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // =================================================================
  // 3. [서버 통신] 데이터 가져오기
  // =================================================================
  useEffect(() => {
    const dateStr = getDateStr(currentDate);

    const fetchMeals = fetch(
      `http://localhost:8080/api/meals?date=${dateStr}`
    ).then((res) => res.json());
    const fetchShopping = fetch(
      `http://localhost:8080/api/shopping?date=${dateStr}`
    ).then((res) => res.json());

    Promise.all([fetchMeals, fetchShopping])
      .then(([meals, shoppingItems]) => {
        const toBuyCount = shoppingItems.filter(
          (item) => !item.isBought
        ).length;

        setDashboardData({
          mealCount: meals.length,
          recentMenu:
            meals.length > 0 ? meals[meals.length - 1].text : "기록 없음",
          shoppingCount: toBuyCount,
          shoppingMsg:
            toBuyCount > 0 ? "사야 할 물건이 있어요!" : "모두 구매 완료!",
        });
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  }, [currentDate]);

  // =================================================================
  // 4. [화면 렌더링] UI 구성
  // =================================================================
  return (
    <div className="home-container">
      {/* 헤더 영역: 타이틀 교체 완료 */}
      <header className="dashboard-header">
        {/* ★ 수정됨: 인사말 대신 메인 타이틀 배치 ★ */}
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <span>🏠</span> HOME DASHBOARD
        </h2>

        {/* 날짜 네비게이션 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginTop: "10px",
            color: "#718096",
            fontSize: "1.1rem",
          }}
        >
          <button
            onClick={() => changeDate(-1)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#a0aec0",
            }}
          >
            ◀
          </button>
          <span style={{ fontWeight: "bold", color: "#4a5568" }}>
            {formattedDate}
          </span>
          <button
            onClick={() => changeDate(1)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#a0aec0",
            }}
          >
            ▶
          </button>
        </div>
      </header>

      {/* 대시보드 카드 영역 */}
      <div className="dashboard-grid">
        {/* 식단 카드 */}
        <div className="card">
          <h3>
            <span>오늘의 식단</span>
            <span>🍚</span>
          </h3>
          <div className="count-box">{dashboardData.mealCount}</div>
          <p className="sub-text">최근 메뉴: {dashboardData.recentMenu}</p>
          <Link to="/meal">
            <button>기록하러 가기</button>
          </Link>
        </div>

        {/* 장보기 카드 */}
        <div className="card">
          <h3>
            <span>장보기 목록</span>
            <span>🛒</span>
          </h3>
          <div className="count-box">{dashboardData.shoppingCount}</div>
          <p className="sub-text">{dashboardData.shoppingMsg}</p>
          <Link to="/shopping">
            <button>장바구니 확인</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
