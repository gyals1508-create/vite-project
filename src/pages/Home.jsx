import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import DashboardCard from "../components/DashboardCard";
import "react-datepicker/dist/react-datepicker.css";
import "../Retro.css";

registerLocale("ko", ko);

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    meals: [],
    shoppingItems: [],
    todos: [],
    income: 0,
    expense: 0,
  });

  const dummyTodos = [
    {
      todoid: "d1",
      content: "🏃 조깅하기",
      isDone: false,
      dodate: "2026-01-01",
    },
    {
      todoid: "d2",
      content: "📚 리액트 공부",
      isDone: true,
      dodate: "2026-01-01",
    },
  ];

  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <span
      onClick={onClick}
      ref={ref}
      style={{
        fontWeight: "bold",
        color: "#2d3748",
        cursor: "pointer",
        fontSize: "1.1rem",
        outline: "none",
      }}
    >
      {value} 📅
    </span>
  ));

  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    const userId = "testUser";
    const fetchUrl = (path) => `http://localhost:8080/api/${path}`;

    Promise.all([
      fetch(fetchUrl(`meals?date=${dateStr}`)).then((res) =>
        res.json().catch(() => [])
      ),
      fetch(fetchUrl(`shopping?date=${dateStr}`)).then((res) =>
        res.json().catch(() => [])
      ),
      fetch(fetchUrl(`todo?userId=${userId}&date=${dateStr}`)).then((res) =>
        res.json().catch(() => [])
      ),
      fetch(fetchUrl(`tx?userId=${userId}&date=${dateStr}`)).then((res) =>
        res.json().catch(() => [])
      ),
    ])
      .then(([meals, shopping, todos, txs]) => {
        const income = (txs || [])
          .filter((t) => t.txType === "INCOME")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        const expense = (txs || [])
          .filter((t) => t.txType === "EXPENSE")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        const todayShoppingItems = (shopping || []).filter(
          (item) => item.shoppingDate === dateStr
        );
        const uniqueShoppingItems = todayShoppingItems.filter(
          (item, index, self) =>
            index === self.findLastIndex((t) => t.text === item.text)
        );
        const combinedTodos = [...dummyTodos, ...(todos || [])].filter(
          (t) => t.dodate === dateStr
        );

        setDashboardData({
          meals: meals || [],
          shoppingItems: uniqueShoppingItems,
          todos: combinedTodos,
          income,
          expense,
        });
      })
      .catch((err) => console.error("로딩 실패", err));
  }, [currentDate]);

  const totalCalories = dashboardData.meals.reduce(
    (sum, m) => sum + (Number(m.calories) || 0),
    0
  );
  const hasUnconfirmedItems = dashboardData.shoppingItems.some(
    (item) => !item.isBought
  );

  // [수정] 요청하신 버튼 스타일만 정확히 변경 (테두리 제거 및 색상 적용)
  const btnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#AAB7EC",
    fontSize: "1.5rem",
    outline: "none",
    boxShadow: "none",
    padding: "0 10px",
  };

  return (
    <div
      className="home-container"
      style={{
        width: "100%",
        maxWidth: "1400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "-40px",
      }}
    >
      <header style={{ marginBottom: "50px", textAlign: "center" }}>
        <h2
          style={{ fontSize: "2.5rem", color: "#2d3748", marginBottom: "15px" }}
        >
          👛 POCKET DASHBOARD
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() - 1);
              setCurrentDate(d);
            }}
            style={btnStyle}
          >
            ◀
          </button>
          <DatePicker
            locale="ko"
            selected={currentDate}
            onChange={(date) => setCurrentDate(date)}
            dateFormat="yyyy년 MM월 dd일 eeee"
            customInput={<CustomInput />}
          />
          <button
            onClick={() => {
              const d = new Date(currentDate);
              d.setDate(d.getDate() + 1);
              setCurrentDate(d);
            }}
            style={btnStyle}
          >
            ▶
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "25px",
          justifyContent: "center",
          paddingBottom: "40px",
        }}
      >
        <DashboardCard
          title="일정 📅"
          list={dashboardData.todos}
          emptyMsg="할 일이 없어요!"
          linkTo="/schedule"
          btnText="자세히 보기"
          isTodo={true}
        />
        <DashboardCard
          title="오늘의 식단 🍚"
          list={dashboardData.meals}
          emptyMsg="기록이 없어요!"
          linkTo="/meal"
          btnText="기록하러 가기"
          isMeal={true}
          totalCalories={totalCalories}
        />
        <DashboardCard
          title="장바구니 🛍️"
          list={dashboardData.shoppingItems}
          emptyMsg="구매 목록이 비어있어요!"
          linkTo="/shopping"
          btnText="목록 확인"
          isShopping={true}
          hasUnconfirmedItems={hasUnconfirmedItems}
        />
        <DashboardCard
          title="가계부 💰"
          isAccount={true}
          income={dashboardData.income}
          expense={dashboardData.expense}
          linkTo="/account"
          btnText="가계부 보기"
        />
      </div>
    </div>
  );
};

export default Home;
