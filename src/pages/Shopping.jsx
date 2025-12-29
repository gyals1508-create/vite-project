import React, { useState, useEffect } from "react";
import "../Retro.css";

const Shopping = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const getDateStr = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    fetch(`http://localhost:8080/api/shopping?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("로드 실패:", err));
  }, [currentDate]);

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

  const deleteItem = (id) => {
    fetch(`http://localhost:8080/api/shopping/${id}`, {
      method: "DELETE",
    }).then(() => setItems(items.filter((item) => item.id !== id)));
  };

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addItem();
  };

  const formattedDate = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="pixel-card">
      <h3>🛒 장보기 리스트</h3>

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

      <div className="input-group">
        <input
          className="pixel-input"
          type="text"
          placeholder="여기에 구매할 물건을 입력해주세요!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="pixel-btn" onClick={addItem}>
          추가
        </button>
      </div>

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
              {/* 물건 이름 */}
              <span
                style={{
                  textDecoration: item.isBought ? "line-through" : "none",
                  color: item.isBought ? "#cbd5e0" : "#4a5568",
                }}
              >
                {item.text}
              </span>

              {/* 오른쪽 버튼 그룹 */}
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* ★ 핵심 수정: div로 바꿔서 점 제거 & 폰트 키움 ★ */}
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
                      height: "40px",
                      padding: "0 25px",
                      borderRadius: "15px",
                      fontSize: "16px",
                      cursor: "pointer",
                      fontFamily: "Jua",
                      outline: "none",
                    }}
                  >
                    구매완료
                  </button>
                )}

                <button
                  className="pixel-btn delete"
                  onClick={() => deleteItem(item.id)}
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
