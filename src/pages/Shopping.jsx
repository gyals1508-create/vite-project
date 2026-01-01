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
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTarget, setSearchTarget] = useState("");

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
    setSearchError("");
    setSearchResults([]);
    setSearchTarget("");
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

  const handleMoveToDate = (dateStr, text) => {
    setCurrentDate(new Date(dateStr));
    setTimeout(() => {
      setSearchTarget(text);
      setTimeout(() => setSearchTarget(""), 10000);
    }, 300);
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;
    fetch(`http://localhost:8080/api/shopping/search?text=${inputValue}`)
      .then((res) => res.json())
      .then((data) => {
        const results = data
          .filter((i) => i.isBought && i.shoppingDate)
          .sort((a, b) => new Date(b.shoppingDate) - new Date(a.shoppingDate));
        if (results.length > 0) {
          setSearchResults(results);
          handleMoveToDate(results[0].shoppingDate, results[0].text);
          setSearchError("");
        } else {
          setSearchError("구매 내역을 찾을 수 없습니다.");
          setSearchResults([]);
          setSearchTarget("");
        }
      });
  };

  const addItemWithText = (text) => {
    if (!text || text.trim() === "") return;
    const dateStr = getDateStr(currentDate);

    // 로직 보완: 전체 아이템 중 동일 이름의 즐겨찾기 여부를 확인하여 새 항목에 적용
    const isAlreadyFavorite = items.some(
      (i) => i.text === text && i.isFavorite
    );

    const existingInToday = items.find(
      (i) => i.text === text && i.shoppingDate === dateStr
    );

    if (existingInToday) {
      const updatedItem = {
        ...existingInToday,
        count: (existingInToday.count || 1) + 1,
      };
      fetch(`http://localhost:8080/api/shopping/${existingInToday.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedItem),
      }).then(() =>
        setItems(
          items.map((i) => (i.id === existingInToday.id ? updatedItem : i))
        )
      );
    } else {
      const newItem = {
        text,
        isBought: false,
        shoppingDate: dateStr,
        isFavorite: isAlreadyFavorite, // 즐겨찾기 상태 상속
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
          setSearchError("");
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

  // 로직 보완: 동일한 이름을 가진 모든 항목의 즐겨찾기 상태를 동기화
  const toggleFavorite = (item) => {
    const nextFavoriteStatus = !item.isFavorite;

    // 현재 클릭한 항목 업데이트
    const updatedItem = { ...item, isFavorite: nextFavoriteStatus };

    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
    }).then(() => {
      // 핵심: 메모리에 있는 모든 '이름이 같은' 품목들의 별 상태를 동기화
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.text === item.text ? { ...i, isFavorite: nextFavoriteStatus } : i
        )
      );
    });
  };

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
      }).then(() =>
        setItems(items.map((i) => (i.id === item.id ? updatedItem : i)))
      );
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
      <style>{`@keyframes highlightBlink { 0%, 100% { background-color: transparent; } 50% { background-color: #fff9c4; transform: scale(1.01); } } .no-dot::before { content: none !important; }`}</style>
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
              outline: "none",
              boxShadow: "none",
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
              outline: "none",
              boxShadow: "none",
            }}
          >
            ▶
          </button>
        </div>
        <div
          className="input-group"
          style={{
            display: "flex",
            gap: "10px",
            marginBottom:
              searchError || searchResults.length > 1 ? "5px" : "20px",
          }}
        >
          <input
            className="pixel-input"
            type="text"
            placeholder="구매할 물건 입력..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setSearchError("");
              setSearchResults([]);
            }}
            onKeyPress={(e) => e.key === "Enter" && addItemWithText(inputValue)}
            style={{ outline: "none", flex: 1 }}
          />
          <button
            className="pixel-btn"
            onClick={handleSearch}
            style={{
              outline: "none",
              border: "none",
              boxShadow: "none",
              background: "#5e72e4",
            }}
          >
            검색
          </button>
          <button
            className="pixel-btn"
            onClick={() => addItemWithText(inputValue)}
            style={{ outline: "none", border: "none", boxShadow: "none" }}
          >
            추가
          </button>
        </div>
        {searchResults.length > 1 && (
          <div
            style={{
              marginBottom: "15px",
              padding: "10px",
              background: "#f8f9fa",
              borderRadius: "10px",
              fontSize: "0.85rem",
            }}
          >
            <span style={{ color: "#718096", marginRight: "10px" }}>
              여러 번 구매했네요! 날짜 선택:
            </span>
            {searchResults.map((res, idx) => (
              <button
                key={idx}
                onClick={() => handleMoveToDate(res.shoppingDate, res.text)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#5e72e4",
                  cursor: "pointer",
                  textDecoration: "underline",
                  marginRight: "8px",
                  outline: "none",
                }}
              >
                {res.shoppingDate}
              </button>
            ))}
          </div>
        )}
        {searchError && (
          <div
            style={{
              color: "#f56565",
              fontSize: "0.85rem",
              marginBottom: "15px",
              marginLeft: "5px",
              fontWeight: "bold",
            }}
          >
            ⚠️ {searchError}
          </div>
        )}
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
                    animation:
                      searchTarget === item.text
                        ? "highlightBlink 0.8s infinite"
                        : "none",
                    borderRadius: "10px",
                    padding: "5px 10px",
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
                        outline: "none",
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
                          style={{ color: "#5e72e4", fontWeight: "bold" }}
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
                          outline: "none",
                          boxShadow: "none",
                        }}
                      >
                        구매확정
                      </button>
                    )}
                    <button
                      className="pixel-btn delete"
                      onClick={() => handleDelete(item)}
                      style={{
                        padding: "0 25px",
                        height: "41px",
                        outline: "none",
                        border: "none",
                        boxShadow: "none",
                      }}
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
        <h3>⭐ 즐겨찾기</h3>
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
                    outline: "none",
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
                    outline: "none",
                    boxShadow: "none",
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
