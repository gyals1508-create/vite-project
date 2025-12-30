# 💧 Pocket Life (포켓 라이프)

### 📖 프로젝트 소개

일상의 소소한 기록을 관리하는 귀여운 웹 애플리케이션입니다.  
식단, 장보기, 일정, 가계부 등 생활 필수 기능을 직관적이고 감성적인 디자인(Jua 폰트, 파스텔 톤)으로 제공합니다.

---

### 🛠 기술 스택 (Tech Stack)

- **Frontend**: React (Vite), React-Router-Dom
- **Components**: React-DatePicker (달력 기능)
- **Backend**: Java 17, Spring Boot 4.x
- **Database**: MySQL
- **Styling**: Custom Retro CSS
- **Tool**: VS Code, Git/GitHub

---

### 📂 주요 기능

1. **대시보드 (Home) 🏠**

   - 📅 **스마트 달력**: 날짜 클릭 시 달력이 펼쳐져 원하는 날짜로 즉시 이동 가능
   - 📊 **실시간 요약**: 식단 횟수, 장바구니 현황, 할 일 개수, 가계부 합계를 한눈에 확인

2. **식단 관리 (Meal) 🥗**

   - 🍚 **카테고리**: 아침/점심/저녁/간식 분류 및 30자 이내의 메뉴명 기록
   - 📅 **날짜별 조회**: 특정 날짜를 선택하여 과거 기록 확인 및 관리
   - 🔄 **자동 저장**: 백엔드 API 연동으로 새로고침 후에도 데이터 보존

3. **장보기 (Shopping) 🛒**
   - ✅ **구매 체크**: '구매완료' 클릭 시 초록색 강조 및 취소선 효과 (기존 UI 보존)
   - 🗑 **동적 관리**: 날짜별 장보기 리스트 추가 및 실시간 삭제 기능

---

### 🚀 시작 가이드 (Getting Started)

팀원분들은 아래 순서대로 실행해 주세요!

**1. 데이터베이스 설정 (MySQL)**

- MySQL Workbench에서 `life_manager` 스키마를 생성하세요.
- 백엔드 리드미의 최신 SQL을 실행하여 테이블 구조(`VARCHAR(30)`)를 맞추세요.

**2. 백엔드 실행 (Spring Boot)**

- `backend` 폴더를 IntelliJ로 열고 실행합니다.
- 포트 `8080`이 정상적으로 대기 중인지 확인하세요.

**3. 프론트엔드 실행 (React)**

```bash
# 1. 프론트엔드 폴더로 이동
cd vite-project

# 2. 필요한 라이브러리 설치 (최초 1회)
# react-datepicker, date-fns 등이 설치됩니다.
npm install

# 3. 개발 서버 실행
npm run dev
```
