import React from "react";
import "./CompatibilityResult.css";
import Logo from "../../assets/Logo.svg";

// Figma: 궁합결과 화면 구현
export default function CompatibilityResult() {
  // TODO: 실제 데이터 연동 시 props 또는 상태로 교체
  const user1Name = "희진님";
  const user2Name = "성연님";
  const user1Info = "성별 : 여자\n생년월일 : 2009.01.20";
  const user2Info = "성별 : 여자\n생년월일 : 2008.01.21";

  // Figma에 있는 각 회색 섹션 텍스트를 개별 블록으로 분리
  const resultSections = [
    {
      title: "두 사람의 궁합 점수 : 88점",
      body: "서로의 부족한 부분을 자연스럽게 채워주는 관계예요.\n대화가 편안하고 함께 있으면 안정감을 느낄 수 있어요.",
    },
    {
      title: "🗣️ 대화 방식",
      body: "두 분의 대화의 흐름이 비교적 부드러운 편이에요.\n굳이 설명하지 않아도 감정이나 의도를 눈치채는 순간이 있고,\n때로는 친구처럼 편안하게 이야기가 이어져요.\n다만 생각의 방향이 다를 때는 서로의 관점을 끝까지 들어주는 태도가 관계를 더 단단하게 만들어줘요.",
    },
    {
      title: "💖 감정·성격",
      body: "감정 표현이 조금 다를 수는 있지만, 그 차이가 오히려 서로를 보완하는 역할을 해요.\n한 사람은 차분하게 상황을 바라보고,\n다른 한 사람은 솔직하게 감정을 드러내며 관계에 생동감을 불어넣는 조합이에요.",
    },
    {
      title: "🏠 목표·생활 방식",
      body: "현실적인 목표나 생활 태도에서 공통점이 많은 편이에요.\n함께 무언가를 계획하거나 도전할 때 자연스럽게 역할 분담이 이루어질 가능성이 커요.\n다만 생활 리듬이나 중요하게 여기는 우선순위는 다를 수 있으니,\n중요한 결정은 충분한 대화를 거쳐 조율하는 게 좋아요.",
    },
    {
      title: "⚡ 주의할 점",
      body: "가끔은 서로 다른 속도와 스타일 때문에 오해가 생길 수 있어요.\n상대의 말투나 표현 방식 뒤에 숨은 진짜 의도를 한 번 더 생각해 보고,\n감정이 격해질수록 잠시 멈춘 뒤 대화하는 연습이 도움이 돼요.",
    },
  ];

  const handleSave = () => {
    // 정보 저장 로직 자리
    console.log("정보 저장하기");
  };

  const handleShare = () => {
    // 결과 공유 로직 자리
    console.log("결과 공유하기");
  };

  return (
    <div className="compat-result-root">
      {/* 배경 레이어 */}
      <div className="compat-bg-layers" aria-hidden="true">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => (
          <div key={n} className={`compat-bg-layer compat-bg-layer-${n}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1508 865"
              className="compat-bg-svg"
            >
              <g filter="url(#filter0_d)">
                <path
                  d="M1491.83 334.212C1578.67 765.782 1183.52 912.873 858.023 838.596C532.521 764.318 43.1512 986.556 4 473.084C4 186.214 65.2367 -107.174 636.606 54.1686C809.87 103.095 1378.06 -231.188 1491.83 334.212Z"
                  fill="white"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d"
                  x="0"
                  y="0"
                  width="1508"
                  height="865"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                  />
                  <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>
              </defs>
            </svg>
          </div>
        ))}
      </div>

      <div className="compat-content">
        {/* 헤더 */}
        <header className="compat-header">
          <div className="compat-logo-wrap">
            <img src={Logo} alt="빌려온 사주 로고" className="compat-logo-img" />
          </div>
          <h1 className="compat-header-title">빌려온 사주</h1>
        </header>

        <main className="compat-main">
          {/* 메인 제목 */}
          <h2 className="compat-main-title">
            {user1Name}과 {user2Name}의 궁합 결과
          </h2>

          {/* 사용자 정보 두 카드 */}
          <section className="compat-users">
            <article className="compat-user-card">
              <div className="compat-user-bg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 492 273"
                  className="compat-user-bg-svg"
                >
                  <path
                    d="M488.007 106.464C516.491 243.942 386.884 290.799 280.12 267.137C173.355 243.476 12.8416 314.27 0 150.702C0 59.319 20.0856 -34.1406 207.495 17.2556C264.326 32.8412 450.691 -73.6456 488.007 106.464Z"
                    fill="#F5F5F5"
                  />
                </svg>
              </div>
              <div className="compat-user-text">
                <h3 className="compat-user-title">{user1Name}의 정보</h3>
                <p className="compat-user-desc">{user1Info}</p>
              </div>
            </article>

            <article className="compat-user-card">
              <div className="compat-user-bg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 492 273"
                  className="compat-user-bg-svg"
                >
                  <path
                    d="M488.007 106.464C516.491 243.942 386.884 290.799 280.12 267.137C173.355 243.476 12.8416 314.27 0 150.702C0 59.319 20.0856 -34.1406 207.495 17.2556C264.326 32.8412 450.691 -73.6456 488.007 106.464Z"
                    fill="#F5F5F5"
                  />
                </svg>
              </div>
              <div className="compat-user-text">
                <h3 className="compat-user-title">{user2Name}의 정보</h3>
                <p className="compat-user-desc">{user2Info}</p>
              </div>
            </article>
          </section>

          {/* 관계별 궁합 분석 섹션들 (각각 회색 박스, 흰색 blob 모양 배경) */}
          {resultSections.map((section) => (
            <section
              key={section.title}
              className="compat-section compat-section-analysis"
            >
              <div className="compat-section-bg" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1508 865"
                  className="compat-section-bg-svg"
                >
                  <g filter="url(#sectionFilter)">
                    <path
                      d="M1491.83 334.212C1578.67 765.782 1183.52 912.873 858.023 838.596C532.521 764.318 43.1512 986.556 4 473.084C4 186.214 65.2367 -107.174 636.606 54.1686C809.87 103.095 1378.06 -231.188 1491.83 334.212Z"
                      fill="#F4F4F4"
                    />
                  </g>
                  <defs>
                    <filter
                      id="sectionFilter"
                      x="0"
                      y="0"
                      width="1508"
                      height="865"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="2" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                      />
                      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
                      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                  </defs>
                </svg>
              </div>

              <div className="compat-section-inner">
                <h3 className="compat-section-title">{section.title}</h3>
                <p className="compat-analysis-text">{section.body}</p>
              </div>
            </section>
          ))}

          {/* 하단 버튼 두 개 */}
          <div className="compat-actions">
            <button className="compat-action-btn" type="button" onClick={handleSave}>
              정보 저장하기
            </button>
            <button className="compat-action-btn" type="button" onClick={handleShare}>
              결과 공유하기
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

