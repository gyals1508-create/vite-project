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
  const [calorieInput, setCalorieInput] = useState("");
  const [meals, setMeals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingCalories, setEditingCalories] = useState("");

  // 추천 식단을 저장할 새로운 상태 추가
  const [displayRecs, setDisplayRecs] = useState([]);

  const dailyGoal = 2000;
  const totalCalories = meals.reduce(
    (sum, meal) => sum + (Number(meal.calories) || 0),
    0
  );
  const isOver = totalCalories > dailyGoal;

  // 기초 추천 데이터 리스트
  const dietMenus = [
    "연어 샐러드 (320kcal)",
    "닭가슴살 곤약밥 (290kcal)",
    "두부 포케 (350kcal)",
    "구운 야채 팩 (150kcal)",
  ];
  const healthyMenus = [
    "불고기 덮밥 (580kcal)",
    "고등어 구이 정식 (520kcal)",
    "버섯 전골 (450kcal)",
    "비빔밥 (550kcal)",
  ];

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

  const validateNumber = (val) => val.replace(/[^0-9]/g, "");

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <span
      onClick={onClick}
      ref={ref}
      style={{
        fontWeight: "bold",
        color: "#4a5568",
        cursor: "pointer",
        fontSize: "1.1rem",
        outline: "none",
      }}
    >
      {value} 📅
    </span>
  ));

  // 데이터 로드 효과
  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    fetch(`http://localhost:8080/api/meals?date=${dateStr}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setMeals(data))
      .catch((err) => console.error("로드 실패:", err));
  }, [currentDate]);

  // ★ 추천 식단 랜덤 셔플 효과 추가
  useEffect(() => {
    const base = isOver ? dietMenus : healthyMenus;
    // 배열을 무작위로 섞어서 상위 3개만 표시
    const shuffled = [...base].sort(() => Math.random() - 0.5).slice(0, 3);
    setDisplayRecs(shuffled);
  }, [currentDate, isOver]); // 날짜가 바뀌거나 칼로리 초과 여부가 바뀔 때 갱신

  const addMeal = () => {
    if (inputValue.trim() === "") return;
    fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: inputValue,
        mealType,
        calories: Number(calorieInput) || 0,
        mealDate: getDateStr(currentDate),
      }),
    })
      .then((res) => res.json())
      .then((saved) => {
        setMeals([...meals, saved]);
        setInputValue("");
        setCalorieInput("");
      });
  };

  const deleteMeal = (id) => {
    fetch(`http://localhost:8080/api/meals/${id}`, { method: "DELETE" }).then(
      () => setMeals(meals.filter((m) => m.id !== id))
    );
  };

  const saveEdit = (id) => {
    const meal = meals.find((m) => m.id === id);
    fetch(`http://localhost:8080/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...meal,
        text: editingText,
        calories: Number(editingCalories) || 0,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMeals(meals.map((m) => (m.id === id ? data : m)));
        setEditingId(null);
      });
  };

  const btnBaseStyle = { outline: "none", border: "none", boxShadow: "none" };

  return (
    <div
      className="main-content"
      style={{
        display: "flex",
        gap: "25px",
        alignItems: "flex-start",
        maxWidth: "1200px",
        margin: "100px auto 0",
      }}
    >
      <div className="pixel-card" style={{ flex: 1.5, minWidth: "0" }}>
        <h3>🥗 오늘의 식단 기록</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={() => changeDate(-1)}
            style={{
              ...btnBaseStyle,
              background: "none",
              cursor: "pointer",
              color: "#5e72e4",
              fontSize: "1.5rem",
              fontWeight: "bold",
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
              ...btnBaseStyle,
              background: "none",
              cursor: "pointer",
              color: "#5e72e4",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            ▶
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          {["아침", "점심", "저녁", "간식"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              style={{
                ...btnBaseStyle,
                background: mealType === type ? "#5e72e4" : "#edf2f7",
                color: mealType === type ? "#fff" : "#4a5568",
                padding: "8px 16px",
                borderRadius: "15px",
                cursor: "pointer",
              }}
            >
              {type}
            </button>
          ))}
        </div>
        <div
          className="input-group"
          style={{ display: "flex", width: "100%", gap: "10px" }}
        >
          <input
            className="pixel-input"
            type="text"
            placeholder="음식명"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addMeal()}
            style={{ flex: 3, minWidth: "0" }}
          />
          <input
            className="pixel-input"
            type="text"
            placeholder="kcal"
            value={calorieInput}
            onChange={(e) => setCalorieInput(validateNumber(e.target.value))}
            style={{ width: "70px", flex: "none" }}
          />
          <button className="pixel-btn" onClick={addMeal} style={btnBaseStyle}>
            추가
          </button>
        </div>
        <div
          style={{
            width: "100%",
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {meals.map((meal) => (
            <div
              className="item-row"
              key={meal.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
              }}
            >
              <span
                style={{
                  flex: 1,
                  minWidth: "0",
                  textAlign: "left",
                  marginRight: "10px",
                }}
              >
                {editingId === meal.id ? (
                  <div style={{ display: "flex", gap: "5px", width: "100%" }}>
                    <input
                      className="pixel-input"
                      style={{ flex: 3, height: "35px", minWidth: "0" }}
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <input
                      className="pixel-input"
                      type="text"
                      style={{ width: "60px", flex: "none", height: "35px" }}
                      value={editingCalories}
                      onChange={(e) =>
                        setEditingCalories(validateNumber(e.target.value))
                      }
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <strong style={{ color: "#5e72e4" }}>
                      [{meal.mealType}]
                    </strong>
                    <span style={{ marginLeft: "8px", color: "#2d3748" }}>
                      {meal.text}
                    </span>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#a0aec0",
                        marginLeft: "8px",
                      }}
                    >
                      ( {meal.calories || 0} kcal )
                    </span>
                  </div>
                )}
              </span>
              <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                {editingId === meal.id ? (
                  <>
                    <button
                      className="pixel-btn edit"
                      style={btnBaseStyle}
                      onClick={() => saveEdit(meal.id)}
                    >
                      완료
                    </button>
                    <button
                      className="pixel-btn delete"
                      style={btnBaseStyle}
                      onClick={() => setEditingId(null)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="pixel-btn edit"
                      style={btnBaseStyle}
                      onClick={() => {
                        setEditingId(meal.id);
                        setEditingText(meal.text);
                        setEditingCalories(meal.calories);
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="pixel-btn delete"
                      style={btnBaseStyle}
                      onClick={() => deleteMeal(meal.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 0.7,
          minWidth: "280px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "sticky",
          top: "115px",
          justifyContent: "flex-start",
        }}
      >
        <div
          className="pixel-card"
          style={{ padding: "25px", margin: 0, width: "100%" }}
        >
          <h3 style={{ fontSize: "1.3rem", marginBottom: "15px" }}>
            📊 영양 요약
          </h3>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "0.85rem", color: "#718096" }}>
              오늘 총 섭취량
            </div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: "bold",
                color: isOver ? "#f56565" : "#48bb78",
              }}
            >
              {totalCalories}
              <span style={{ fontSize: "0.9rem", color: "#a0aec0" }}>
                {" "}
                / {dailyGoal} kcal
              </span>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "10px",
              backgroundColor: "#edf2f7",
              borderRadius: "5px",
              overflow: "hidden",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                width: `${Math.min((totalCalories / dailyGoal) * 100, 100)}%`,
                height: "100%",
                backgroundColor: isOver ? "#f56565" : "#48bb78",
                transition: "width 0.5s",
              }}
            />
          </div>
          <div
            style={{
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: isOver ? "#fff5f5" : "#f0fff4",
              border: `1px solid ${isOver ? "#feb2b2" : "#9ae6b4"}`,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontWeight: "bold",
                fontSize: "0.95rem",
                color: isOver ? "#c53030" : "#2f855a",
              }}
            >
              {isOver ? "⚠️ 칼로리 초과!" : "✅ 아주 좋아요!"}
            </span>
          </div>
        </div>

        <div
          className="pixel-card"
          style={{
            padding: "20px",
            margin: 0,
            width: "105%",
            flex: "none",
            minHeight: "auto",
            display: "block",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            💡 추천 식단
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#718096",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            {isOver ? "가벼운 한 끼 어떠세요?" : "이런 든든한 식단은 어때요?"}
          </p>
          <ul style={{ padding: 0, listStyle: "none", width: "100%" }}>
            {displayRecs.map((item, idx) => (
              <li
                key={idx}
                style={{
                  padding: "8px 0",
                  fontSize: "0.95rem",
                  color: "#4a5568",
                  textAlign: "center",
                }}
              >
                ✨ {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Meal;
