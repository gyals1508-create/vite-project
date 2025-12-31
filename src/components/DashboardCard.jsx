import React from "react";
import { Link } from "react-router-dom";

const DashboardCard = ({
  title,
  list,
  emptyMsg,
  linkTo,
  btnText,
  isMeal,
  isAccount,
  isShopping,
  income,
  expense,
  totalCalories, // Home.jsx에서 전달받은 값
}) => {
  const cardStyle = {
    flex: "1",
    minWidth: "300px",
    maxWidth: "320px",
    height: "450px",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "30px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  };

  const totalBalance = (income || 0) - (expense || 0);
  // 칼로리 초과 상태 체크 (2000kcal 기준)
  const isOver = (totalCalories || 0) > 2000;

  return (
    <div className="card" style={cardStyle}>
      <h3
        style={{
          fontSize: "1.4rem",
          borderBottom: "1px solid #edf2f7",
          width: "100%",
          paddingBottom: "15px",
          textAlign: "center",
        }}
      >
        {title}
      </h3>

      <div
        style={{
          width: "100%",
          flex: 1,
          textAlign: "left",
          padding: "20px 10px",
        }}
      >
        {isAccount ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#a0aec0" }}>수입</span>
              <span style={{ color: "#5e72e4", fontWeight: "bold" }}>
                {income > 0 ? "+" : ""}
                {income.toLocaleString()}원
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#a0aec0" }}>지출</span>
              <span style={{ color: "#f5365c", fontWeight: "bold" }}>
                {expense > 0 ? "-" : ""}
                {expense.toLocaleString()}원
              </span>
            </div>
            <div
              style={{
                borderTop: "2px solid #f8fafc",
                marginTop: "10px",
                paddingTop: "15px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "0.85rem",
                  color: "#a0aec0",
                }}
              >
                오늘의 합계
              </p>
              <span
                style={{
                  fontSize: "1.8rem",
                  color: totalBalance >= 0 ? "#2d3748" : "#f5365c",
                  fontWeight: "bold",
                }}
              >
                {totalBalance.toLocaleString()}원
              </span>
            </div>
          </div>
        ) : list && list.length > 0 ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: "#4a5568",
            }}
          >
            {list.slice(0, 5).map((item, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: "12px",
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: item.isBought ? "#cbd5e0" : "#4a5568",
                }}
              >
                {isShopping ? (item.isBought ? "✅ " : "🛒 ") : "• "}
                {isMeal && item.mealType ? `[${item.mealType}] ` : ""}
                {item.text || item.title || "항목"}
              </li>
            ))}
          </ul>
        ) : (
          <p
            style={{
              color: "#cbd5e0",
              fontSize: "0.9rem",
              textAlign: "center",
              marginTop: "60px",
            }}
          >
            {emptyMsg}
          </p>
        )}
      </div>

      {/* ★ 식단 카드일 경우 버튼 위에 총 칼로리 표시 추가 */}
      {isMeal && (
        <div
          style={{ textAlign: "center", marginBottom: "15px", width: "100%" }}
        >
          <p
            style={{
              margin: "0 0 5px 0",
              fontSize: "0.85rem",
              color: "#a0aec0",
            }}
          >
            오늘 총 칼로리
          </p>
          <span
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: isOver ? "#f5365c" : "#48bb78",
            }}
          >
            {(totalCalories || 0).toLocaleString()} kcal
          </span>
        </div>
      )}

      <Link to={linkTo} style={{ width: "100%" }}>
        <button
          className="pixel-btn"
          style={{ width: "100%", padding: "12px" }}
        >
          {btnText}
        </button>
      </Link>
    </div>
  );
};

export default DashboardCard;
