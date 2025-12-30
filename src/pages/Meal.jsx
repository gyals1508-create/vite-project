import React, { useState, useEffect } from "react";
import "../Retro.css"; // 디자인 파일 (여기서 기본적인 버튼 모양을 가져옴)

/**
 * [Meal 컴포넌트]
 * 식단 관리를 담당하는 페이지야.
 * 날짜별로 먹은 음식을 기록(Create), 조회(Read), 삭제(Delete)할 수 있어.
 */
const Meal = () => {
  // =================================================================
  // 1. [상태 관리] React가 화면을 그릴 때 사용하는 '기억 저장소' (State)
  // =================================================================

  // 현재 선택된 날짜 (기본값: 오늘) -> 이 값이 바뀌면 화면의 날짜도 바뀜
  const [currentDate, setCurrentDate] = useState(new Date());

  // 현재 선택된 식사 종류 (기본값: 아침) -> 버튼 누르면 점심, 저녁으로 바뀜
  const [mealType, setMealType] = useState("아침");

  // 입력창에 적힌 글자 -> 사용자가 타이핑할 때마다 여기에 저장됨
  const [inputValue, setInputValue] = useState("");

  // 서버에서 받아온 식단 리스트 -> 이게 채워져야 화면에 목록이 뜸
  const [meals, setMeals] = useState([]);

  // =================================================================
  // 2. [도구 함수] 날짜를 서버가 좋아하는 모양으로 바꾸는 녀석들
  // =================================================================

  // Date 객체를 "2025-12-30" 문자열로 변환 (DB 검색용)
  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // 1월 -> 01월
    const day = String(dateObj.getDate()).padStart(2, "0"); // 1일 -> 01일
    return `${year}-${month}-${day}`;
  };

  // 화살표 버튼(◀ ▶)을 누르면 날짜를 하루 더하거나 빼는 함수
  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate); // 날짜 변경! -> useEffect가 이걸 감지하고 데이터를 다시 가져옴
  };

  // 화면에 보여줄 예쁜 한글 날짜 ("2025년 12월 30일 화요일")
  const formattedDate = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // =================================================================
  // 3. [서버 통신] 백엔드(Spring Boot)랑 대화하는 곳
  // =================================================================

  // [조회 - READ]
  // useEffect: 'currentDate(날짜)'가 바뀔 때마다 자동으로 실행돼!
  useEffect(() => {
    const dateStr = getDateStr(currentDate);

    // 1. 서버한테 "이 날짜 식단 줘!"라고 요청
    fetch(`http://localhost:8080/api/meals?date=${dateStr}`)
      .then((res) => res.json()) // 2. 응답을 자바스크립트가 알아먹게 변환
      .then((data) => {
        setMeals(data); // 3. 받아온 데이터를 변수에 저장 -> 화면이 자동으로 갱신됨!
      })
      .catch((err) => console.error("데이터 가져오기 실패:", err));
  }, [currentDate]); // [의존성 배열]: 이 안에 있는 게 변할 때만 실행됨

  // [추가 - CREATE]
  const addMeal = () => {
    if (inputValue.trim() === "") return; // 빈 칸이면 저장 안 함

    const dateStr = getDateStr(currentDate);

    // 서버로 보낼 데이터 포장하기
    const newMealData = {
      text: inputValue,
      mealType: mealType,
      mealDate: dateStr,
    };

    // 서버한테 "이거 저장해줘!"라고 POST 요청
    fetch("http://localhost:8080/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMealData),
    })
      .then((res) => res.json())
      .then((savedMeal) => {
        // 저장 성공하면 기존 목록(...meals)에 새거(savedMeal) 추가
        setMeals([...meals, savedMeal]);
        setInputValue(""); // 입력창 비우기
      })
      .catch((err) => console.error("저장 실패:", err));
  };

  // [삭제 - DELETE]
  const deleteMeal = (id) => {
    // 서버한테 "이 ID 가진 거 삭제해줘!"라고 요청
    fetch(`http://localhost:8080/api/meals/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // 화면에서도 안 보이게 목록에서 걔만 쏙 빼고 다시 저장 (filter 사용)
        setMeals(meals.filter((meal) => meal.id !== id));
      })
      .catch((err) => console.error("삭제 실패:", err));
  };

  // 엔터키 쳤을 때도 저장되게 하기
  const handleKeyPress = (e) => {
    if (e.key === "Enter") addMeal();
  };

  // =================================================================
  // 4. [화면 렌더링] 실제 눈에 보이는 HTML을 만드는 곳
  // =================================================================
  return (
    <div className="main-content">
      <div className="pixel-card">
        <h3>🥗 오늘의 식단 기록</h3>

        {/* 날짜 네비게이션 (◀ 날짜 ▶) */}
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
          {/* 이전 날짜 버튼 */}
          <button
            onClick={() => changeDate(-1)}
            style={{
              background: "none",
              border: "none",
              outline: "none", // 테두리 제거
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

          {/* 다음 날짜 버튼 */}
          <button
            onClick={() => changeDate(1)}
            style={{
              background: "none",
              border: "none",
              outline: "none", // 테두리 제거
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#a0aec0",
            }}
          >
            ▶
          </button>
        </div>

        {/* 카테고리 버튼 (아침/점심/저녁/간식) */}
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "center",
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
                outline: "none", // ★ 중요: 클릭 시 검은 테두리 제거
                // 선택된 건 파란색(#5e72e4), 안 된 건 회색(#edf2f7)
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

        {/* 입력창 & 추가 버튼 */}
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
          {/* 추가 버튼 */}
          <button
            className="pixel-btn"
            onClick={addMeal}
            style={{ border: "none", outline: "none" }} // ★ 중요: 버튼 테두리 제거
          >
            추가
          </button>
        </div>

        {/* 식단 리스트 출력 */}
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          {meals.length === 0 ? (
            // 데이터가 없을 때
            <p
              style={{
                color: "#cbd5e0",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              아직 기록된 식단이 없어요!
            </p>
          ) : (
            // 데이터가 있을 때 (map으로 반복해서 보여줌)
            meals.map((meal) => (
              <div className="item-row" key={meal.id}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <strong style={{ color: "#5e72e4", marginRight: "8px" }}>
                    [{meal.mealType}]
                  </strong>
                  {meal.text}
                </span>

                {/* 삭제 버튼 */}
                <button
                  className="pixel-btn delete"
                  onClick={() => deleteMeal(meal.id)}
                  style={{ border: "none", outline: "none" }} // ★ 중요: 버튼 테두리 제거
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
