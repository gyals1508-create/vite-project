import React, { useState } from "react";
import "../Retro.css"; // 디자인(CSS) 파일 연결 확인 필수!

const Shopping = () => {
  // [상태 관리] items: 장보기 목록 데이터 (배열)
  // 초기값으로 예시 데이터 3개를 넣어둠
  const [items, setItems] = useState([
    { id: 1, text: "계란" },
    { id: 2, text: "닭가슴살" },
    { id: 3, text: "우유" },
  ]);

  // [상태 관리] inputValue: 입력창의 현재 텍스트
  const [inputValue, setInputValue] = useState("");

  // [기능] 아이템 추가 (Create)
  const addItem = () => {
    // 빈 칸이면 추가하지 않고 함수 종료 (유효성 검사)
    if (inputValue.trim() === "") return;

    // 새 아이템 객체 생성 (id는 현재 시간으로 고유값 확보)
    const newItem = {
      id: Date.now(),
      text: inputValue,
    };

    // [중요] 리액트는 기존 배열을 직접 수정(push)하면 안 됨!
    // ...items(전개 연산자)로 기존 목록을 복사하고, 뒤에 새 아이템을 붙여서 '새 배열'로 교체함
    setItems([...items, newItem]);

    // 입력창 비우기
    setInputValue("");
  };

  // [기능] 아이템 삭제 (Delete)
  const deleteItem = (id) => {
    // filter: 조건에 맞는(삭제하려는 id가 아닌) 녀석들만 남겨서 새 배열을 만듦
    setItems(items.filter((item) => item.id !== id));
  };

  // [UX] 엔터키 입력 지원
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addItem();
    }
  };

  return (
    // pixel-card: 하얀색 둥근 카드 배경 (Retro.css)
    <div className="pixel-card">
      {/* 제목 */}
      <h3>🛒 장보기 리스트</h3>

      {/* 입력창 + 버튼 그룹 */}
      <div className="input-group">
        <input
          className="pixel-input" // 둥근 테두리 입력창 스타일
          type="text"
          placeholder="구매할 물건을 입력해주세요..."
          value={inputValue} // 입력값 상태 연결 (Two-way binding)
          onChange={(e) => setInputValue(e.target.value)} // 입력할 때마다 상태 업데이트
          onKeyPress={handleKeyPress} // 엔터키 감지
        />
        <button className="pixel-btn" onClick={addItem}>
          추가
        </button>
      </div>

      {/* ★ 핵심: 리스트가 카드 너비를 꽉 채우도록 설정 (width: 100%) ★ 
          이 스타일이 있어야 삭제 버튼이 오른쪽 끝으로 예쁘게 밀림 */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* map 함수: items 배열 개수만큼 반복해서 화면에 그림 */}
        {items.map((item) => (
          // key: 리액트가 각 항목을 구분하기 위한 주민등록번호 같은 것 (필수)
          // item-row: 한 줄에 내용(왼쪽)과 버튼(오른쪽)을 배치하는 클래스
          <div className="item-row" key={item.id}>
            {/* 물건 이름 */}
            <span>{item.text}</span>

            {/* 삭제 버튼 */}
            <button
              className="pixel-btn delete" // delete 클래스로 파란색/작은 크기 적용
              onClick={() => deleteItem(item.id)} // 클릭 시 해당 id 삭제
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shopping;
