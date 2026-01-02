import React from "react";
import ShoppingMainSection from "./ShoppingMainSection";
import ShoppingFavSection from "./ShoppingFavSection";

const ShoppingView = (props) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "flex-start",
        width: "100%",
        justifyContent: "center",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <style>{`@keyframes highlightBlink { 0%, 100% { background-color: transparent; } 50% { background-color: #fff9c4; transform: scale(1.01); } } .no-dot::before { content: none !important; }`}</style>
      <ShoppingMainSection {...props} />
      <ShoppingFavSection
        uniqueFavorites={props.uniqueFavorites}
        onAdd={props.onAdd}
        onToggleFav={props.onToggleFav}
      />
    </div>
  );
};
export default ShoppingView;
