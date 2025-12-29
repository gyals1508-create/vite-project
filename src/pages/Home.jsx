import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Retro.css";

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 식단 & 장보기 데이터를 모두 관리
  const [dashboardData, setDashboardData] = useState({
    mealCount: 0,
    recentMenu: "기록 없음",
    shoppingCount: 0, // 장보기 개수 추가
    shoppingMsg: "장바구니가 비었어요!",
  });

  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const dateStr = getDateStr(currentDate);

    // 1. 식단 데이터 가져오기
    const fetchMeals = fetch(
      `http://localhost:8080/api/meals?date=${dateStr}`
    ).then((res) => res.json());
    // 2. 장보기 데이터 가져오기
    const fetchShopping = fetch(
      `http://localhost:8080/api/shopping?date=${dateStr}`
    ).then((res) => res.json());

    // 두 데이터를 모두 기다렸다가(Promise.all) 화면 업데이트
    Promise.all([fetchMeals, fetchShopping])
      .then(([meals, shoppingItems]) => {
        // 안 산 물건 개수 세기 (isBought가 false인 것만)
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

  return (
    <div className="home-container">
      <header className="dashboard-header">
        <h2>ㅇㅇ님, 안녕하세요! 👋</h2>
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
          {/* 안 산 물건 개수 표시 */}
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
