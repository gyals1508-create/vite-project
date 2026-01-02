import React from "react";
import DatePicker from "react-datepicker";
import ShoppingItem from "./ShoppingItem";

const ShoppingMainSection = (props) => {
  const {
    currentDate,
    onDateChange,
    onDatePickerChange,
    getDateStr,
    getApiDate,
    inputValue,
    setInputValue,
    onSearch,
    onAdd,
    searchResults,
    onMoveDate,
    searchError,
    items,
    searchTarget,
    onMark,
    onDelete,
    onToggleFav,
  } = props;

  return (
    <div
      className="pixel-card"
      style={{ flex: 1.2, padding: "25px", minWidth: "500px" }}
    >
      <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        오늘의 장바구니🛍️
      </h3>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => onDateChange(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#5e72e4",
            fontSize: "1.2rem",
            cursor: "pointer",
            outline: "none",
            boxShadow: "none",
          }}
        >
          ◀
        </button>
        <DatePicker
          locale="ko"
          selected={currentDate}
          onChange={onDatePickerChange}
          dateFormat="yyyy년 MM월 dd일 EEEE"
          customInput={
            <span
              style={{
                fontWeight: "bold",
                cursor: "pointer",
                color: "#4a5568",
              }}
            >
              {getDateStr(currentDate)} 📅
            </span>
          }
        />
        <button
          onClick={() => onDateChange(1)}
          style={{
            background: "none",
            border: "none",
            color: "#5e72e4",
            fontSize: "1.2rem",
            cursor: "pointer",
            outline: "none",
            boxShadow: "none",
          }}
        >
          ▶
        </button>
      </div>
      <div className="input-group">
        <input
          className="pixel-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onAdd(inputValue)}
          placeholder="구매할 물건 입력..."
          style={{ outline: "none" }}
        />
        <button
          className="pixel-btn"
          onClick={onSearch}
          style={{ background: "#5e72e4", border: "none", outline: "none" }}
        >
          검색
        </button>
        <button
          className="pixel-btn"
          onClick={() => onAdd(inputValue)}
          style={{ border: "none", outline: "none" }}
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
            여러 번 구매했네요!
          </span>
          {searchResults.map((res, idx) => (
            <button
              key={idx}
              onClick={() => onMoveDate(res.shoppingDate, res.text)}
              style={{
                border: "none",
                color: "#5e72e4",
                cursor: "pointer",
                marginRight: "8px",
                background: "none",
                textDecoration: "underline",
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
          style={{ color: "#f56565", marginBottom: "15px", fontWeight: "bold" }}
        >
          ⚠️ {searchError}
        </div>
      )}
      <div
        style={{
          width: "100%",
          maxHeight: "430px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {items
          .filter((i) => i.shoppingDate === getApiDate(currentDate))
          .map((item) => (
            <ShoppingItem
              key={item.id}
              item={item}
              searchTarget={searchTarget}
              onMark={onMark}
              onDelete={onDelete}
              onToggleFav={onToggleFav}
            />
          ))}
      </div>
    </div>
  );
};
export default ShoppingMainSection;
