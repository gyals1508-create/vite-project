import React, { useState, useEffect } from "react";
import ShoppingView from "./ShoppingView";

const ShoppingList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTarget, setSearchTarget] = useState("");

  const getDateStr = (dateObj) => {
    if (!dateObj) return null;
    const days = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const dayName = days[dateObj.getDay()];
    return `${year}년 ${month}월 ${day}일 ${dayName}`;
  };

  const getApiDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const dateStr = getApiDate(currentDate);
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
    const dateStr = getApiDate(currentDate);
    const existing = items.find(
      (i) => i.text === text && i.shoppingDate === dateStr
    );
    const fav = items.find((i) => i.text === text && i.isFavorite);

    if (existing) {
      const updated = { ...existing, count: (existing.count || 1) + 1 };
      fetch(`http://localhost:8080/api/shopping/${existing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).then(() =>
        setItems(items.map((i) => (i.id === existing.id ? updated : i)))
      );
    } else if (fav) {
      const updated = {
        ...fav,
        shoppingDate: dateStr,
        isBought: false,
        count: 1,
      };
      fetch(`http://localhost:8080/api/shopping/${fav.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).then(() =>
        setItems(items.map((i) => (i.id === fav.id ? updated : i)))
      );
    } else {
      const newItem = {
        text,
        isBought: false,
        shoppingDate: dateStr,
        isFavorite: false,
        count: 1,
      };
      fetch("http://localhost:8080/api/shopping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((saved) => {
          setItems([...items, saved]);
          setInputValue("");
          setSearchError("");
        });
    }
  };

  const markAsBought = (item) => {
    const updated = { ...item, isBought: true };
    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => setItems(items.map((i) => (i.id === item.id ? updated : i))));
  };

  const toggleFav = (item) => {
    const updated = { ...item, isFavorite: !item.isFavorite };
    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => setItems(items.map((i) => (i.id === item.id ? updated : i))));
  };

  const handleDelete = (item) => {
    if (item.isFavorite) {
      const updated = {
        ...item,
        shoppingDate: null,
        isBought: false,
        count: 1,
      };
      fetch(`http://localhost:8080/api/shopping/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      }).then(() =>
        setItems(items.map((i) => (i.id === item.id ? updated : i)))
      );
    } else {
      fetch(`http://localhost:8080/api/shopping/${item.id}`, {
        method: "DELETE",
      }).then(() => setItems(items.filter((i) => i.id !== item.id)));
    }
  };

  return (
    <ShoppingView
      currentDate={currentDate}
      items={items}
      inputValue={inputValue}
      setInputValue={setInputValue}
      searchError={searchError}
      searchResults={searchResults}
      searchTarget={searchTarget}
      uniqueFavorites={Array.from(
        new Set(items.filter((i) => i.isFavorite).map((i) => i.text))
      ).map((text) => items.find((i) => i.text === text && i.isFavorite))}
      onDateChange={(days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate);
        setSearchError("");
        setSearchResults([]);
        setSearchTarget("");
      }}
      onDatePickerChange={(date) => setCurrentDate(date)}
      onSearch={handleSearch}
      onAdd={addItemWithText}
      onMoveDate={handleMoveToDate}
      onMark={markAsBought}
      onDelete={handleDelete}
      onToggleFav={toggleFav}
      getDateStr={getDateStr}
      getApiDate={getApiDate}
    />
  );
};
export default ShoppingList;
