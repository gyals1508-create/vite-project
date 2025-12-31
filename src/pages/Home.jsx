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
      fetch(fetchUrl(`meals?date=${dateStr}`)).then((res) => res.json()),
      fetch(fetchUrl(`shopping?date=${dateStr}`)).then((res) => res.json()),
      fetch(fetchUrl(`todo?userId=${userId}&date=${dateStr}`)).then((res) =>
        res.json()
      ),
      fetch(fetchUrl(`tx?userId=${userId}&date=${dateStr}`)).then((res) =>
        res.json()
      ),
    ])
      .then(([meals, shopping, todos, txs]) => {
        const income = txs
          .filter((t) => t.txType === "INCOME")
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = txs
          .filter((t) => t.txType === "EXPENSE")
          .reduce((sum, t) => sum + t.amount, 0);
        const sortedShopping = [...shopping].sort(
          (a, b) => a.isBought - b.isBought
        );
        setDashboardData({
          meals,
          shoppingItems: sortedShopping,
          todos,
          income,
          expense,
        });
      })
      .catch((err) => console.error("데이터 로딩 실패:", err));
  }, [currentDate]);

  // ★ 칼로리 합산 및 상태 체크 로직 추가
  const totalCalories = dashboardData.meals.reduce(
    (sum, m) => sum + (Number(m.calories) || 0),
    0
  );

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
        padding: "0 15px",
      }}
    >
      <header
        style={{ marginBottom: "50px", textAlign: "center", width: "100%" }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
            color: "#2d3748",
            marginBottom: "15px",
          }}
        >
          👛 POCKET DASHBOARD
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <button
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setDate(currentDate.getDate() - 1))
              )
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5e72e4",
              fontSize: "1.5rem",
              outline: "none",
            }}
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
            onClick={() =>
              setCurrentDate(
                new Date(currentDate.setDate(currentDate.getDate() + 1))
              )
            }
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5e72e4",
              fontSize: "1.5rem",
              outline: "none",
            }}
          >
            ▶
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "25px",
          width: "100%",
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
        />

        {/* ★ 식단 카드에 totalCalories 전달 */}
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
