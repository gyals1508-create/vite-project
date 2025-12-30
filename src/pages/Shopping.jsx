import React, { useState, useEffect } from "react";
import "../Retro.css";

/**
 * [Shopping 컴포넌트]
 * 장보기 리스트를 관리하는 페이지야.
 * 필요한 물건을 추가(Create), 조회(Read), 수정(Update - 구매체크), 삭제(Delete)할 수 있어.
 */
const Shopping = () => {
  // =================================================================
  // 1. [상태 관리] React가 기억하는 변수들 (State)
  // =================================================================
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜
  const [items, setItems] = useState([]); // 장보기 목록 데이터
  const [inputValue, setInputValue] = useState(""); // 입력창 내용

  // =================================================================
  // 2. [도구 함수] 날짜 변환기
  // =================================================================
  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // =================================================================
  // 3. [서버 통신] 백엔드와 데이터 주고받기
  // =================================================================

  // [조회] 날짜가 바뀌면 목록 새로 가져오기
  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    fetch(`http://localhost:8080/api/shopping?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("로드 실패:", err));
  }, [currentDate]);

  // [추가] "추가" 버튼 누르면 실행
  const addItem = () => {
    if (inputValue.trim() === "") return; // 빈 칸 방지

    const newItem = {
      text: inputValue,
      isBought: false,
      shoppingDate: getDateStr(currentDate),
    };

    fetch("http://localhost:8080/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((savedItem) => {
        setItems([...items, savedItem]); // 목록에 추가
        setInputValue(""); // 입력창 초기화
      });
  };

  // [수정] "구매완료" 버튼 누르면 실행 (상태 변경)
  const markAsBought = (item) => {
    const updatedItem = { ...item, isBought: true };

    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    }).then(() => {
      // id가 같은 것만 찾아서 교체 (map 사용)
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
    });
  };

  // [삭제] "삭제" 버튼 누르면 실행
  const deleteItem = (id) => {
    fetch(`http://localhost:8080/api/shopping/${id}`, {
      method: "DELETE",
    }).then(() => setItems(items.filter((item) => item.id !== id)));
  };

  // =================================================================
  // 4. [이벤트 핸들러] 날짜 이동 및 키보드 입력
  // =================================================================
  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addItem();
  };

  // ★ 이미 한글로 잘 나오도록 설정되어 있어! ("2025년 12월 30일 화요일")
  const formattedDate = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // =================================================================
  // 5. [화면 렌더링] UI 그리기
  // =================================================================
  return (
    <div className="pixel-card">
      <h3>🛒 장보기 리스트</h3>

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

      {/* 입력창 & 추가 버튼 */}
      <div className="input-group">
        <input
          className="pixel-input"
          type="text"
          placeholder="여기에 구매할 물건을 입력해주세요!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="pixel-btn"
          onClick={addItem}
          style={{ border: "none", outline: "none" }} // ★ 테두리 제거
        >
          추가
        </button>
      </div>

      {/* 리스트 출력 */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {items.length === 0 ? (
          <p
            style={{ color: "#cbd5e0", marginTop: "20px", textAlign: "center" }}
          >
            장볼 목록이 텅 비었어요!
          </p>
        ) : (
          items.map((item) => (
            <div className="item-row" key={item.id}>
              {/* 물건 이름 (구매 완료 시 취소선) */}
              <span
                style={{
                  textDecoration: item.isBought ? "line-through" : "none",
                  color: item.isBought ? "#cbd5e0" : "#4a5568",
                }}
              >
                {item.text}
              </span>

              {/* 버튼 그룹 */}
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {item.isBought ? (
                  <div
                    style={{
                      color: "#48bb78",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      marginRight: "10px",
                    }}
                  >
                    구매완료!
                  </div>
                ) : (
                  <button
                    onClick={() => markAsBought(item)}
                    style={{
                      background: "#48bb78",
                      color: "#fff",
                      border: "none",
                      outline: "none", // ★ 테두리 제거
                      height: "40px",
                      padding: "0 25px",
                      borderRadius: "15px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontFamily: "Jua",
                    }}
                  >
                    구매완료
                  </button>
                )}

                <button
                  className="pixel-btn delete"
                  onClick={() => deleteItem(item.id)}
                  style={{ border: "none", outline: "none" }} // ★ 테두리 제거
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shopping;
