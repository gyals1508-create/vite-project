import React from "react";

const ShoppingFavSection = ({ uniqueFavorites, onAdd, onToggleFav }) => {
  return (
    <div
      className="pixel-card"
      style={{ flex: 0.6, padding: "20px", minWidth: "250px" }}
    >
      <h3 style={{ fontSize: "1.3rem", marginBottom: "15px" }}>
        <span style={{ color: "#fbc02d" }}>⭐</span> 즐겨찾기
      </h3>
      <ul style={{ listStyle: "none", padding: 0, width: "100%", margin: 0 }}>
        {uniqueFavorites.map((fav) => (
          <li
            key={fav.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              border: "1px dashed #edf2f7",
              borderRadius: "12px",
              marginBottom: "8px",
              backgroundColor: "#fff",
            }}
          >
            <div
              onClick={() => onAdd(fav.text)}
              style={{ cursor: "pointer", color: "#4a5568", fontWeight: "500" }}
            >
              {/* ★ 즐겨찾기 목록에 노란색 별 복구 */}
              <span style={{ color: "#fbc02d", marginRight: "5px" }}>★</span>
              {fav.text}
            </div>
            <button
              onClick={() => onToggleFav(fav)}
              style={{
                border: "none",
                background: "none",
                color: "#cbd5e0",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      {uniqueFavorites.length === 0 && (
        <p
          style={{ color: "#cbd5e0", fontSize: "0.85rem", textAlign: "center" }}
        >
          별을 눌러 추가해보세요!
        </p>
      )}
    </div>
  );
};
export default ShoppingFavSection;
