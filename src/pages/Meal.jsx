import React, { useState } from "react";
import "../Retro.css"; // 디자인(CSS) 파일 연결 확인 필수!

const Meal = () => {
  // [상태 관리] meals: 식단 리스트 데이터 (초기값: 더미 데이터 3개)
  // setMeals를 통해 리스트를 추가하거나 삭제함
  const [meals, setMeals] = useState([
    { id: 1, text: "닭가슴살 샐러드" },
    { id: 2, text: "현미밥 반 공기" },
    { id: 3, text: "아이스 아메리카노" },
  ]);

  // [상태 관리] inputValue: 현재 입력창에 쓰고 있는 글자
  const [inputValue, setInputValue] = useState("");

  // [기능] 식단 추가 (Add)
  const addMeal = () => {
    // 공백만 입력했는지 확인 (빈 값 추가 방지)
    if (inputValue.trim() === "") return;

    // 새 식단 객체 생성 (id는 Date.now()로 고유값 생성)
    const newMeal = {
      id: Date.now(),
      text: inputValue,
    };

    // 기존 리스트(...meals)에 새 항목(newMeal)을 붙여서 상태 업데이트
    setMeals([...meals, newMeal]);
    setInputValue(""); // 입력창 비우기(초기화)
  };

  // [기능] 식단 삭제 (Delete)
  const deleteMeal = (id) => {
    // filter: 클릭한 항목의 id와 '다른' 것들만 남김 (= 해당 id 삭제 효과)
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  // [UX] 엔터키 입력 지원 함수
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addMeal();
    }
  };

  return (
    // pixel-card: Retro.css에 정의된 하얀색 둥근 카드 배경
    <div className="pixel-card">
      {/* 제목 영역 */}
      <h3>🥗 오늘의 식단 기록</h3>

      {/* 입력창 + 추가 버튼 그룹 */}
      <div className="input-group">
        <input
          className="pixel-input"
          type="text"
          placeholder="오늘 먹은 음식을 입력해"
          value={inputValue} // 입력창의 값과 state 연결 (양방향 바인딩)
          onChange={(e) => setInputValue(e.target.value)} // 글자 칠 때마다 state 업데이트
          onKeyPress={handleKeyPress} // 엔터키 누르면 추가됨
        />
        <button className="pixel-btn" onClick={addMeal}>
          추가
        </button>
      </div>

      {/* ★ 핵심: 리스트 정렬을 위한 컨테이너 (width 100% 필수) ★ 
          이 div가 없으면 리스트 내용물이 가운데로 뭉칠 수 있음 */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* map 함수: meals 배열을 돌면서 화면에 리스트를 그리기 */}
        {meals.map((meal) => (
          // key: 리액트가 리스트 아이템을 구분하기 위한 고유값 (필수 설정)
          // item-row: 한 줄에 글자와 삭제버튼을 양옆으로 배치하는 CSS 클래스
          <div className="item-row" key={meal.id}>
            {/* 음식 이름 (CSS에 의해 왼쪽 정렬됨) */}
            <span>{meal.text}</span>

            {/* 삭제 버튼 (CSS에 의해 오른쪽 끝 정렬됨) */}
            <button
              className="pixel-btn delete" // delete 클래스로 크기와 색상 조절
              onClick={() => deleteMeal(meal.id)} // 클릭 시 해당 id 삭제 함수 실행
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meal;
