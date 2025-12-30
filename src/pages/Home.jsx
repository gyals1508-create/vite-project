import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Retro.css";

registerLocale("ko", ko);

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    mealCount: 0,
    recentMenu: "기록 없음",
    shoppingCount: 0,
    shoppingMsg: "장바구니가 비었어요!",
    todoCount: 0, // ★ 추가
    txTotal: 0, // ★ 추가
  });

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

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <span
      onClick={onClick}
      ref={ref}
      style={{
        fontWeight: "bold",
        color: "#4a5568",
        cursor: "pointer",
        fontSize: "1.1rem",
      }}
    >
      {value} 📅
    </span>
  ));

  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    const userId = "testUser"; // 테스트용 유저 아이디

    const fetchMeals = fetch(
      `http://localhost:8080/api/meals?date=${dateStr}`
    ).then((res) => res.json());
    const fetchShopping = fetch(
      `http://localhost:8080/api/shopping?date=${dateStr}`
    ).then((res) => res.json());
    const fetchTodos = fetch(
      `http://localhost:8080/api/todo?userId=${userId}&date=${dateStr}`
    ).then((res) => res.json());
    const fetchTx = fetch(
      `http://localhost:8080/api/tx?userId=${userId}&date=${dateStr}`
    ).then((res) => res.json());

    Promise.all([fetchMeals, fetchShopping, fetchTodos, fetchTx])
      .then(([meals, shoppingItems, todos, txs]) => {
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
          todoCount: todos.length, // ★ 일정 개수 업데이트
          txTotal: txs.reduce((sum, item) => sum + item.amount, 0), // ★ 가계부 총액 계산
        });
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  }, [currentDate]);

  const cardStyle = {
    width: "300px",
    height: "400px",
    padding: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  };

  return (
    <div
      className="home-container"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: "-100px",
      }}
    >
      <header
        className="dashboard-header"
        style={{ marginBottom: "110px", textAlign: "center", width: "100%" }}
      >
        <h2
          style={{ fontSize: "2.2rem", marginBottom: "5px", color: "#2d3748" }}
        >
          🏠 HOME DASHBOARD
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <button
            onClick={() => changeDate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a0aec0",
              fontSize: "1.3rem",
            }}
          >
            ◀
          </button>
          <DatePicker
            locale="ko"
            selected={currentDate}
            onChange={(date) => setCurrentDate(date)}
            dateFormat="yyyy년 MM월 dd일 eeee"
            dateFormatCalendar="yyyy년 LLLL"
            customInput={<CustomInput />}
          />
          <button
            onClick={() => changeDate(1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a0aec0",
              fontSize: "1.3rem",
            }}
          >
            ▶
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "150%",
          justifyContent: "center",
        }}
      >
        {/* 1. 일정 (데이터 연동) */}
        <div className="card" style={cardStyle}>
          <h3>
            <span>일정</span> 📅
          </h3>
          <div className="count-box" style={{ fontSize: "4rem" }}>
            {dashboardData.todoCount}
          </div>
          <p className="sub-text" style={{ fontSize: "1rem" }}>
            할 일 개수
          </p>
          <Link to="/schedule">
            <button
              style={{
                border: "none",
                background: "#f8fafc",
                padding: "10px 20px",
                borderRadius: "10px",
                color: "#718096",
                cursor: "pointer",
              }}
            >
              보기
            </button>
          </Link>
        </div>

        {/* 2. 오늘의 식단 */}
        <div className="card" style={cardStyle}>
          <h3>
            <span>오늘의 식단</span> 🍚
          </h3>
          <div className="count-box" style={{ fontSize: "4rem" }}>
            {dashboardData.mealCount}
          </div>
          <p className="sub-text" style={{ fontSize: "1rem" }}>
            마지막: {dashboardData.recentMenu}
          </p>
          <Link to="/meal">
            <button
              style={{ border: "none", outline: "none", cursor: "pointer" }}
            >
              기록하러 가기
            </button>
          </Link>
        </div>

        {/* 3. 장보기 목록 */}
        <div className="card" style={cardStyle}>
          <h3>
            <span>장보기 목록</span> 🛒
          </h3>
          <div className="count-box" style={{ fontSize: "4rem" }}>
            {dashboardData.shoppingCount}
          </div>
          <p className="sub-text" style={{ fontSize: "1rem" }}>
            {dashboardData.shoppingMsg}
          </p>
          <Link to="/shopping">
            <button
              style={{ border: "none", outline: "none", cursor: "pointer" }}
            >
              장바구니 확인
            </button>
          </Link>
        </div>

        {/* 4. 가계부 (데이터 연동) */}
        <div className="card" style={cardStyle}>
          <h3>
            <span>가계부</span> 💰
          </h3>
          <div className="count-box" style={{ fontSize: "2.5rem" }}>
            {dashboardData.txTotal.toLocaleString()}원
          </div>
          <p className="sub-text" style={{ fontSize: "1rem" }}>
            오늘의 합계
          </p>
          <Link to="/account">
            <button
              style={{
                border: "none",
                background: "#f8fafc",
                padding: "10px 20px",
                borderRadius: "10px",
                color: "#718096",
                cursor: "pointer",
              }}
            >
              보기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
