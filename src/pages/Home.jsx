import React, { useState, useEffect } from "react";
import axios from "axios"; // 서버와 통신하기 위한 도구 (데이터 가져올 때 씀)
import { useNavigate } from "react-router-dom"; // 페이지 이동을 도와주는 훅
import "../Retro.css"; // 공통 디자인 파일 연결 (배경, 버튼 스타일 등)

const Home = () => {
  // [상태 관리] count: 식단 기록 개수를 저장하는 변수 (초기값 0)
  const [count, setCount] = useState(0);

  // [페이지 이동] navigate: 버튼 클릭 시 다른 주소로 보내주는 함수
  const navigate = useNavigate();

  // [데이터 요청] 컴포넌트가 처음 화면에 뜰 때 딱 한 번 실행됨
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/meals") // 1. 서버에 식단 목록 요청
      .then((res) => setCount(res.data.length)); // 2. 받아온 데이터의 개수(length)를 count에 저장
  }, []); // [] : 의존성 배열이 비어있으므로 처음 한 번만 실행

  return (
    // pixel-card: Retro.css에 정의된 하얀색 둥근 카드 스타일
    <div className="pixel-card" style={{ textAlign: "center" }}>
      {/* 제목 영역: 인라인 스타일로 아래 여백(margin) 조정 */}
      <h2 style={{ marginBottom: "30px" }}>🏠 HOME DASHBOARD</h2>

      {/* 식단 개수를 보여주는 점선 박스 영역 */}
      <div
        style={{
          marginBottom: "30px",
          padding: "10px",
          background: "#f9f9f9",
          border: "2px dashed #000", // 점선 테두리 포인트
        }}
      >
        <p
          style={{
            fontSize: "20px", // 글씨 크기 약간 키움
            color: "#000000", // 완전 검은색
            fontWeight: "bold", // 두껍게 강조
            marginBottom: "10px",
          }}
        >
          오늘의 식단 기록
        </p>

        {/* 실제 개수(count)가 표시되는 부분 (색상 강조) */}
        <h1 style={{ color: "#6c5ce7", fontSize: "48px" }}>{count}</h1>
      </div>

      {/* 페이지 이동 버튼 */}
      <button
        className="pixel-btn" // Retro.css의 버튼 스타일 적용
        onClick={() => navigate("/meal")} // 클릭 시 '/meal' 주소로 이동
        style={{ width: "100%", background: "#ffde59" }} // 노란색 배경 덮어쓰기
      >
        식단 관리 페이지로 GO!
      </button>
    </div>
  );
};

export default Home;
