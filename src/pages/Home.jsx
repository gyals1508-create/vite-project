import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 페이지 이동을 위한 도구
import "../Retro.css"; // 디자인 파일

/**
 * [Home 컴포넌트]
 * 앱의 메인 대시보드 화면이야.
 * 식단과 장보기 데이터를 한눈에 요약해서 보여주는 역할을 해.
 */
const Home = () => {
  // =================================================================
  // 1. [상태 관리] React가 기억하는 변수들
  // =================================================================
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜

  // 대시보드에 보여줄 요약 데이터들 (초기값 설정)
  const [dashboardData, setDashboardData] = useState({
    mealCount: 0,
    recentMenu: "기록 없음",
    shoppingCount: 0,
    shoppingMsg: "장바구니가 비었어요!",
  });

  // =================================================================
  // 2. [도구 함수] 날짜 변환 및 이동
  // =================================================================
  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 변경 버튼 (◀ ▶) 기능
  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // 화면 표시용 날짜 포맷
  const formattedDate = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // =================================================================
  // 3. [서버 통신] 두 가지 데이터를 한 번에 가져오기
  // =================================================================
  useEffect(() => {
    const dateStr = getDateStr(currentDate);

    // 1. 식단 데이터 요청
    const fetchMeals = fetch(
      `http://localhost:8080/api/meals?date=${dateStr}`
    ).then((res) => res.json());

    // 2. 장보기 데이터 요청
    const fetchShopping = fetch(
      `http://localhost:8080/api/shopping?date=${dateStr}`
    ).then((res) => res.json());

    // 3. 두 요청이 다 끝날 때까지 기다렸다가 처리 (Promise.all)
    Promise.all([fetchMeals, fetchShopping])
      .then(([meals, shoppingItems]) => {
        // 장보기 목록 중 '안 산 것(!isBought)' 개수 세기
        const toBuyCount = shoppingItems.filter(
          (item) => !item.isBought
        ).length;

        // 화면 데이터 갱신
        setDashboardData({
          mealCount: meals.length, // 식단 개수
          recentMenu:
            meals.length > 0 ? meals[meals.length - 1].text : "기록 없음", // 마지막 메뉴
          shoppingCount: toBuyCount, // 살 물건 개수
          shoppingMsg:
            toBuyCount > 0 ? "사야 할 물건이 있어요!" : "모두 구매 완료!", // 상태 메시지
        });
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  }, [currentDate]);

  // =================================================================
  // 4. [화면 렌더링] UI 그리기
  // =================================================================
  return (
    <div className="home-container">
      {/* 헤더 영역 */}
      <header className="dashboard-header">
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
              outline: "none", // ★ 테두리 제거
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
              outline: "none", // ★ 테두리 제거
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
          <p className="sub-text">마지막 메뉴: {dashboardData.recentMenu}</p>

          {/* 페이지 이동 버튼 */}
          <Link to="/meal">
            <button style={{ border: "none", outline: "none" }}>
              {" "}
              {/* ★ 테두리 제거 */}
              기록하러 가기
            </button>
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

          {/* 페이지 이동 버튼 */}
          <Link to="/shopping">
            <button style={{ border: "none", outline: "none" }}>
              {" "}
              {/* ★ 테두리 제거 */}
              장바구니 확인
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
