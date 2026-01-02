import React, { useState, useEffect } from "react";
import ShoppingView from "./ShoppingView";

const ShoppingList = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [items, setItems] = useState([]);
  // [수정 1] 즐겨찾기를 위한 별도 상태 추가
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTarget, setSearchTarget] = useState("");

  const getApiDate = (dateObj) =>
    `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(dateObj.getDate()).padStart(2, "0")}`;

  // [수정 2] 즐겨찾기 목록을 별도로 불러오는 함수 (백엔드 API 필요)
  // 만약 별도 API가 없다면 fetchItems 결과에서 추출해서 초기화해야 함
  const fetchFavorites = () => {
    fetch("http://localhost:8080/api/shopping/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data))
      .catch((e) => console.log("즐겨찾기 로드 실패(혹은 API 없음):", e));
  };

  const fetchItems = () => {
    setIsLoading(true);
    fetch(`http://localhost:8080/api/shopping?date=${getApiDate(currentDate)}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(
          data.map((i) => ({
            ...i,
            isFavorite: i.isFavorite || false,
            count: i.count || 1,
          }))
        );
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchItems();
    fetchFavorites(); // [수정 3] 초기 로드 시 즐겨찾기 따로 호출
  }, [currentDate]);

  const handleToggleFav = (item) => {
    const newFavStatus = !item.isFavorite;

    // 1. 장보기 목록(items) 업데이트
    setItems((prev) =>
      prev.map((i) =>
        i.text === item.text ? { ...i, isFavorite: newFavStatus } : i
      )
    );

    // 2. 즐겨찾기 목록(favorites) 업데이트 (즉시 반영)
    if (newFavStatus) {
      // 추가: 중복 방지를 위해 확인 후 추가
      setFavorites((prev) => {
        if (prev.some((f) => f.text === item.text)) return prev;
        return [...prev, { ...item, isFavorite: true }];
      });
    } else {
      // 삭제: 즐겨찾기 목록에서 제거
      setFavorites((prev) => prev.filter((f) => f.text !== item.text));
    }

    const updated = { ...item, isFavorite: newFavStatus };
    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => {
      // fetchItems(); // 굳이 전체 리로드 안 해도 됨 (깜빡임 방지)
    });
  };

  const handleDelete = (item) => {
    // [핵심 수정] items에서만 제거하고, favorites는 건드리지 않음!
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    fetch(`http://localhost:8080/api/shopping/${item.id}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok) fetchItems();
    });
  };

  return (
    <ShoppingView
      {...{
        currentDate,
        items,
        isLoading,
        inputValue,
        setInputValue,
        searchError,
        searchResults,
        searchTarget,
      }}
      // [수정 4] 계산된 값이 아닌, 별도 관리되는 favorites 상태 전달
      uniqueFavorites={favorites}
      onDateChange={(n) => {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + n);
        setCurrentDate(d);
      }}
      onDatePickerChange={setCurrentDate}
      onSearch={() => {
        if (!inputValue.trim()) return;
        fetch(
          `http://localhost:8080/api/shopping/search?text=${encodeURIComponent(
            inputValue
          )}`
        )
          .then((res) => res.json())
          .then((data) => {
            setSearchResults(data);
            const dated = data.filter((r) => r.shoppingDate);
            if (dated.length > 0) {
              const [y, m, d] = dated[0].shoppingDate.split("-").map(Number);
              setCurrentDate(new Date(y, m - 1, d));
              setSearchTarget(inputValue);
              setTimeout(() => setSearchTarget(""), 5000);
            }
            setSearchError(data.length === 0 ? "검색 결과가 없습니다." : "");
          });
      }}
      onAdd={(text) => {
        if (!text || !text.trim()) return;
        fetch("http://localhost:8080/api/shopping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            isBought: false,
            shoppingDate: getApiDate(currentDate),
            isFavorite: false,
            count: 1,
          }),
        })
          .then((res) => res.json())
          .then((saved) => {
            setItems((prev) => {
              const idx = prev.findIndex((i) => i.id === saved.id);
              if (idx !== -1) {
                return prev.map((i) => (i.id === saved.id ? saved : i));
              } else {
                return [...prev, saved];
              }
            });
          });
      }}
      onMoveDate={(dateStr, text) => {
        const [y, m, d] = dateStr.split("-").map(Number);
        setCurrentDate(new Date(y, m - 1, d));
        setSearchTarget(text);
        setTimeout(() => setSearchTarget(""), 5000);
      }}
      onMark={(item) => {
        const updated = { ...item, isBought: true };
        fetch(`http://localhost:8080/api/shopping/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }).then(() =>
          setItems(items.map((i) => (i.id === item.id ? updated : i)))
        );
      }}
      onDelete={handleDelete}
      onToggleFav={handleToggleFav}
      getDateStr={(dateObj) => {
        const days = [
          "일요일",
          "월요일",
          "화요일",
          "수요일",
          "목요일",
          "금요일",
          "토요일",
        ];
        return `${dateObj.getFullYear()}년 ${String(
          dateObj.getMonth() + 1
        ).padStart(2, "0")}월 ${String(dateObj.getDate()).padStart(2, "0")}일 ${
          days[dateObj.getDay()]
        }`;
      }}
      getApiDate={getApiDate}
    />
  );
};
export default ShoppingList;
