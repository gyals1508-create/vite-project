import React from "react";

const ShoppingItem = ({
  item,
  searchTarget,
  onMark,
  onDelete,
  onToggleFav,
}) => {
  return (
    <div
      className="item-row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        animation:
          searchTarget === item.text ? "highlightBlink 0.8s infinite" : "none",
        borderRadius: "10px",
        padding: "8px 10px",
        marginBottom: "5px",
        width: "100%",
        boxSizing: "border-box", // ★ 가로폭이 넘치지 않게 고정
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flex: 1,
          minWidth: 0,
        }}
      >
        <span
          onClick={() => onToggleFav(item)}
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
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.text}{" "}
          {item.count > 1 && (
            <span style={{ color: "#5e72e4", fontWeight: "bold" }}>
              {item.count}개
            </span>
          )}
        </span>
      </div>
      <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
        {item.isBought ? (
          <span
            className="no-dot"
            style={{ color: "#48bb78", fontWeight: "bold" }}
          >
            구매완료!
          </span>
        ) : (
          <button
            onClick={() => onMark(item)}
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
          onClick={() => onDelete(item)}
          style={{ padding: "0 20px", height: "40px", fontSize: "14px" }}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
export default ShoppingItem;
