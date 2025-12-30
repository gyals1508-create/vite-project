import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Retro.css";

// 달력 한글 설정 등록
registerLocale("ko", ko);

const Shopping = () => {
  // 1. 상태 관리
  const [currentDate, setCurrentDate] = useState(new Date()); // 선택된 날짜
  const [items, setItems] = useState([]); // 장보기 목록 데이터
  const [inputValue, setInputValue] = useState(""); // 입력창 텍스트

  // 2. 날짜 변환 함수 (yyyy-MM-dd)
  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 이동 함수 (◀ ▶)
  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // Home.jsx와 동일한 달력 호출 전용 컴포넌트
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

  // 3. 서버 통신 (조회)
  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    fetch(`http://localhost:8080/api/shopping?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("로드 실패:", err));
  }, [currentDate]);

  // 서버 통신 (추가)
  const addItem = () => {
    if (inputValue.trim() === "") return;
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
        setItems([...items, savedItem]);
        setInputValue("");
      });
  };

  // 서버 통신 (수정: 구매 완료 처리)
  const markAsBought = (item) => {
    const updatedItem = { ...item, isBought: true };
    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    }).then(() => {
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)));
    });
  };

  // 서버 통신 (삭제)
  const deleteItem = (id) => {
    fetch(`http://localhost:8080/api/shopping/${id}`, {
      method: "DELETE",
    }).then(() => setItems(items.filter((item) => item.id !== id)));
  };

  return (
    <div className="pixel-card">
      <h3>🛒 장보기 리스트</h3>

      {/* 날짜 선택 및 달력 네비게이션 */}
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
            outline: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "#a0aec0",
          }}
        >
          ▶
        </button>
      </div>

      {/* 입력창 영역 */}
      <div className="input-group">
        <input
          className="pixel-input"
          type="text"
          placeholder="여기에 구매할 물건을 입력해주세요!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
        />
        <button
          className="pixel-btn"
          onClick={addItem}
          style={{ border: "none", outline: "none" }}
        >
          추가
        </button>
      </div>

      {/* 목록 출력 영역 */}
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
              {/* 물건 이름 (구매 완료 시 취소선 적용) */}
              <span
                style={{
                  textDecoration: item.isBought ? "line-through" : "none",
                  color: item.isBought ? "#cbd5e0" : "#4a5568",
                }}
              >
                {item.text}
              </span>

              {/* 버튼 그룹 (구매 완료 상태에 따라 다르게 표시) */}
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
                      outline: "none",
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
                  style={{ border: "none", outline: "none" }}
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
