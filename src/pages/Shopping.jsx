import React, { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../Retro.css";

registerLocale("ko", ko);

const Shopping = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const getDateStr = (dateObj) => {
    if (!dateObj) return null;
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

  // 날짜 변경 시 데이터를 가져오되, 즐겨찾기 목록 구성을 위해 전체 데이터를 관리하는 흐름으로 유지
  useEffect(() => {
    const dateStr = getDateStr(currentDate);
    fetch(`http://localhost:8080/api/shopping?date=${dateStr}`)
      .then((res) => res.json())
      .then((data) =>
        setItems(
          data.map((i) => ({
            ...i,
            isFavorite: i.isFavorite || false,
            count: i.count || 1,
          }))
        )
      )
      .catch((err) => console.error("로드 실패:", err));
  }, [currentDate]);

  const addItemWithText = (text) => {
    if (!text || text.trim() === "") return;
    const existingItem = items.find(
      (i) =>
        i.text === text &&
        !i.isBought &&
        i.shoppingDate === getDateStr(currentDate)
    );

    if (existingItem) {
      const updatedItem = {
        ...existingItem,
        count: (existingItem.count || 1) + 1,
      };
      fetch(`http://localhost:8080/api/shopping/${existingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      }).then(() =>
        setItems(items.map((i) => (i.id === existingItem.id ? updatedItem : i)))
      );
    } else {
      const newItem = {
        text,
        isBought: false,
        shoppingDate: getDateStr(currentDate),
        isFavorite: false,
        count: 1,
      };
      fetch("http://localhost:8080/api/shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((savedItem) => {
          setItems([...items, { ...savedItem, count: 1 }]);
          setInputValue("");
        });
    }
  };

  const markAsBought = (item) => {
    const updatedItem = { ...item, isBought: true };
    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    }).then(() =>
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)))
    );
  };

  const toggleFavorite = (item) => {
    const updatedItem = { ...item, isFavorite: !item.isFavorite };
    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    }).then(() =>
      setItems(items.map((i) => (i.id === item.id ? updatedItem : i)))
    );
  };

  // ★ 수정된 삭제 로직: 즐겨찾기면 날짜만 비우고, 아니면 완전 삭제
  const handleDelete = (item) => {
    if (item.isFavorite) {
      const updatedItem = {
        ...item,
        shoppingDate: null,
        isBought: false,
        count: 1,
      };
      fetch(`http://localhost:8080/api/shopping/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      }).then(() => setItems(items.filter((i) => i.id !== item.id)));
    } else {
      fetch(`http://localhost:8080/api/shopping/${item.id}`, {
        method: "DELETE",
      }).then(() => setItems(items.filter((i) => i.id !== item.id)));
    }
  };

  const uniqueFavorites = Array.from(
    new Set(items.filter((i) => i.isFavorite).map((i) => i.text))
  ).map((text) => items.find((i) => i.text === text && i.isFavorite));

  return (
    <div
      className="main-content"
      style={{
        display: "flex",
        gap: "25px",
        alignItems: "flex-start",
        maxWidth: "1200px",
        margin: "100px auto 0",
        justifyContent: "center",
      }}
    >
      <style>{`.no-dot::before { content: none !important; }`}</style>
      <div className="pixel-card" style={{ flex: 1.5, minWidth: "0" }}>
        <h3>오늘의 장바구니🛍️</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
            marginTop: "-20px",
            marginBottom: "25px",
          }}
        >
          <button
            onClick={() => changeDate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5e72e4",
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
              color: "#5e72e4",
              fontSize: "1.2rem",
            }}
          >
            ▶
          </button>
        </div>
        <div className="input-group">
          <input
            className="pixel-input"
            type="text"
            placeholder="구매할 물건 입력..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItemWithText(inputValue)}
          />
          <button
            className="pixel-btn"
            onClick={() => addItemWithText(inputValue)}
          >
            추가
          </button>
        </div>
        <div style={{ width: "100%" }}>
          {items.filter((i) => i.shoppingDate === getDateStr(currentDate))
            .length === 0 ? (
            <p style={{ color: "#cbd5e0", textAlign: "center" }}>
              목록이 비었어요!
            </p>
          ) : (
            items
              .filter((i) => i.shoppingDate === getDateStr(currentDate))
              .map((item) => (
                <div
                  className="item-row"
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      onClick={() => toggleFavorite(item)}
                      className="no-dot"
                      style={{
                        cursor: "pointer",
                        fontSize: "1.3rem",
                        color: item.isFavorite ? "#fbc02d" : "#cbd5e0",
                      }}
                    >
                      {item.isFavorite ? "★" : "☆"}
                    </span>
                    <span
                      className="no-dot"
                      style={{
                        textDecoration: item.isBought ? "line-through" : "none",
                        color: item.isBought ? "#cbd5e0" : "#4a5568",
                      }}
                    >
                      {item.text}{" "}
                      {item.count > 1 && (
                        <span
                          className="no-dot"
                          style={{
                            marginLeft: "8px",
                            color: "#5e72e4",
                            fontWeight: "bold",
                          }}
                        >
                          {item.count}개
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {item.isBought ? (
                      <span
                        className="no-dot"
                        style={{ color: "#48bb78", fontWeight: "bold" }}
                      >
                        구매완료!
                      </span>
                    ) : (
                      <button
                        onClick={() => markAsBought(item)}
                        style={{
                          background: "#48bb78",
                          color: "#fff",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "15px",
                          cursor: "pointer",
                          fontFamily: "Jua",
                        }}
                      >
                        구매완료
                      </button>
                    )}
                    <button
                      className="pixel-btn delete"
                      onClick={() => handleDelete(item)}
                      style={{ padding: "0 15px", height: "40px" }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
      <div
        className="pixel-card"
        style={{
          flex: 0.7,
          minWidth: "280px",
          position: "sticky",
          top: "115px",
          padding: "25px",
          minHeight: "auto",
          justifyContent: "flex-start",
        }}
      >
        <h3 style={{ fontSize: "1.3rem", marginBottom: "15px" }}>
          ⭐ 자주 사는 품목
        </h3>
        {uniqueFavorites.length === 0 ? (
          <p
            style={{
              color: "#cbd5e0",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            별을 눌러 추가해보세요!
          </p>
        ) : (
          <ul
            style={{ listStyle: "none", padding: 0, margin: 0, width: "100%" }}
          >
            {uniqueFavorites.map((fav) => (
              <li
                key={fav.id}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  color: "#4a5568",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "12px",
                  border: "1px dashed #edf2f7",
                }}
              >
                <div
                  onClick={() => addItemWithText(fav.text)}
                  style={{
                    cursor: "pointer",
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span className="no-dot" style={{ color: "#fbc02d" }}>
                    ★
                  </span>
                  <span className="no-dot">{fav.text}</span>
                </div>
                <button
                  onClick={() => toggleFavorite(fav)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#cbd5e0",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    padding: "0 5px",
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Shopping;
