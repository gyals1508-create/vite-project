import React, { useState, useEffect } from "react";
import "../Retro.css"; // 디자인 파일 연결

const Meal = () => {
  // =================================================================
  // 1. 상태(State) 관리
  // =================================================================
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealType, setMealType] = useState("아침");
  const [inputValue, setInputValue] = useState("");
  const [meals, setMeals] = useState([]); // 서버에서 받아온 식단 리스트

  // =================================================================
  // 2. 백엔드 통신 & 기능 구현
  // =================================================================

  // [날짜 변환기] "2025-01-03" 형식의 문자열로 변환 (서버가 좋아하는 형식)
  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // 01월, 02월...
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // [조회 (READ)] 날짜가 바뀔 때마다 서버에서 데이터 가져오기
  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    // GET 요청: /api/meals?date=2025-01-03
    fetch(`http://localhost:8080/api/meals?date=${dateStr}`)
      .then((res) => res.json()) // 서버가 준 데이터를 자바스크립트 객체로 변환
      .then((data) => {
        setMeals(data); // 화면에 반영
      })
      .catch((err) => console.error("데이터 가져오기 실패:", err));
  }, [currentDate]);

  // [추가 (CREATE)]
  const addMeal = () => {
    if (inputValue.trim() === "") return;

    const dateStr = getDateStr(currentDate);
    const newMealData = {
      text: inputValue, // 메뉴 이름
      mealType: mealType, // 아침/점심...
      mealDate: dateStr, // 2025-01-03
    };

    // POST 요청: 데이터 저장해줘!
    fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMealData),
    })
      .then((res) => res.json())
      .then((savedMeal) => {
        // 서버에 저장된 데이터를 받아서 리스트에 추가 (새로고침 없이 바로 뜸)
        setMeals([...meals, savedMeal]);
        setInputValue("");
      })
      .catch((err) => console.error("저장 실패:", err));
  };

  // [삭제 (DELETE)]
  const deleteMeal = (id) => {
    // DELETE 요청: 이 ID 지워줘!
    fetch(`http://localhost:8080/api/meals/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // 성공하면 화면에서도 삭제
        setMeals(meals.filter((meal) => meal.id !== id));
      })
      .catch((err) => console.error("삭제 실패:", err));
  };

  // 날짜 변경 (화살표 클릭 시)
  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addMeal();
  };

  // 화면 표시용 날짜 포맷 (2025년 1월 3일 금요일)
  const formattedDate = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // =================================================================
  // 3. 화면 렌더링 (UI)
  // =================================================================
  return (
    <div className="main-content">
      <div className="pixel-card">
        <h3>🥗 오늘의 식단 기록</h3>

        {/* 날짜 네비게이션 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginTop: "-20px",
            marginBottom: "25px",
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

        {/* 카테고리 버튼 */}
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {["아침", "점심", "저녁", "간식"].map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              style={{
                padding: "8px 16px",
                borderRadius: "15px",
                border: "none",
                outline: "none",
                background: mealType === type ? "#5e72e4" : "#edf2f7",
                color: mealType === type ? "#fff" : "#4a5568",
                cursor: "pointer",
                fontFamily: "Jua",
                transition: "0.2s",
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 입력창 */}
        <div className="input-group">
          <input
            className="pixel-input"
            type="text"
            placeholder={
              mealType === "간식"
                ? "간식으로 먹은 음식을 적어 주세요!"
                : `${mealType}에 먹은 음식을 적어 주세요!`
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="pixel-btn" onClick={addMeal}>
            추가
          </button>
        </div>

        {/* 리스트 */}
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          {meals.length === 0 ? (
            <p style={{ color: "#cbd5e0", marginTop: "20px" }}>
              아직 기록된 식단이 없어!
            </p>
          ) : (
            meals.map((meal) => (
              <div className="item-row" key={meal.id}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  {/* DB에서 가져온 mealType과 text 표시 */}
                  <strong style={{ color: "#5e72e4", marginRight: "8px" }}>
                    [{meal.mealType}]
                  </strong>
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
