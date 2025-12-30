import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Retro.css";

registerLocale("ko", ko);

const Meal = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealType, setMealType] = useState("아침");
  const [inputValue, setInputValue] = useState("");
  const [meals, setMeals] = useState([]);

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

  // Home.jsx와 동일한 커스텀 입력창
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
    fetch(`http://localhost:8080/api/meals?date=${dateStr}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMeals(data))
      .catch((err) => console.error("데이터 로드 실패:", err));
  }, [currentDate]);

  const addMeal = () => {
    if (inputValue.trim() === "") return;
    const dateStr = getDateStr(currentDate);
    const newMealData = {
      text: inputValue,
      mealType: mealType,
      mealDate: dateStr,
    };
    fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMealData),
    })
      .then((res) => res.json())
      .then((savedMeal) => {
        setMeals([...meals, savedMeal]);
        setInputValue("");
      });
  };

  const deleteMeal = (id) => {
    fetch(`http://localhost:8080/api/meals/${id}`, { method: "DELETE" }).then(
      () => setMeals(meals.filter((meal) => meal.id !== id))
    );
  };

  return (
    <div className="main-content">
      <div className="pixel-card">
        <h3>🥗 오늘의 식단 기록</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={() => changeDate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a0aec0",
              fontSize: "1.2rem",
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
            onClick={() => changeDate(1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a0aec0",
              fontSize: "1.2rem",
            }}
          >
            ▶
          </button>
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
          {["아침", "점심", "저녁", "간식"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              style={{
                background: mealType === type ? "#5e72e4" : "#edf2f7",
                color: mealType === type ? "#fff" : "#4a5568",
                border: "none",
                padding: "8px 16px",
                borderRadius: "15px",
                cursor: "pointer",
                fontFamily: "Jua",
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="input-group">
          <input
            className="pixel-input"
            type="text"
            placeholder="먹은 음식을 적어주세요!"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addMeal()}
          />
          <button className="pixel-btn" onClick={addMeal}>
            추가
          </button>
        </div>
        <div style={{ width: "100%" }}>
          {meals.length === 0 ? (
            <p style={{ textAlign: "center", color: "#cbd5e0" }}>
              아직 기록이 없어요!
            </p>
          ) : (
            meals.map((meal) => (
              <div className="item-row" key={meal.id}>
                <span>
                  <strong style={{ color: "#5e72e4" }}>
                    [{meal.mealType}]
                  </strong>{" "}
                  {meal.text}
                </span>
                <button
                  className="pixel-btn delete"
                  onClick={() => deleteMeal(meal.id)}
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Meal;
