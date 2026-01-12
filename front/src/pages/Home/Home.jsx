import React, { useEffect, useMemo, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

import Logo from "../../assets/Logo.svg";
import Card1 from "../../assets/Card1.png";
import Card2 from "../../assets/Card2.png";
import Card3 from "../../assets/Card3.png";

import { BannerCarousel } from "../../components/home/Banner";
import Footer from "../../components/home/footer";

/* =========================
   ✅ DB 미확정(협업 중)이라
   - "기능 메타" + "사용 로그(mock)"로 TOP3를 계산
   - 나중에 서버/DB 확정되면 getHomeTop3/getHomeDaily만 fetch로 교체하면 끝
   ========================= */

const FEATURE_META = [
  {
    id: "future-partner",
    title: "AI로 미래의 배우자 그려주기",
    to: "/information?type=2",
    imageUrl: Card1,
  },
  {
    id: "similar-friend",
    title: "유사 사주 친구 찾기",
    to: "/information?type=1",
    imageUrl: Card2,
  },
  {
    id: "compat-score",
    title: "사주 궁합 점수 보기",
    to: "/information?type=3",
    imageUrl: Card3,
  },
  {
    id: "today-luck",
    title: "오늘의 운세 보기",
    to: "/home",
    imageUrl: Card1,
  },
];

// "전체 사용자가 사용한 테스트 데이터"라고 가정한 mock 로그
const MOCK_USAGE_LOGS = [
  { featureId: "similar-friend" },
  { featureId: "similar-friend" },
  { featureId: "similar-friend" },
  { featureId: "compat-score" },
  { featureId: "compat-score" },
  { featureId: "future-partner" },
  { featureId: "future-partner" },
  { featureId: "future-partner" },
  { featureId: "future-partner" },
  { featureId: "today-luck" },
];

function calcTop3FromLogs({ logs, featureMeta }) {
  const counts = new Map();
  for (const row of logs) {
    if (!row?.featureId) continue;
    counts.set(row.featureId, (counts.get(row.featureId) ?? 0) + 1);
  }

  const ranked = [...featureMeta]
    .map((f) => ({ ...f, count: counts.get(f.id) ?? 0 }))
    .sort((a, b) => b.count - a.count);

  return ranked.slice(0, 3);
}

// ✅ 나중에 여기만 fetch로 바꾸면 됨
async function getHomeTop3() {
  await new Promise((r) => setTimeout(r, 200));
  return calcTop3FromLogs({ logs: MOCK_USAGE_LOGS, featureMeta: FEATURE_META });
}

async function getHomeDaily(nickname) {
  await new Promise((r) => setTimeout(r, 200));
  return {
    nickname,

    // ✅ 운세 요약: 총운/재물운/애정운/건강운 (각 1~2문장)
    fortuneSummary: {
      total:
        "오늘은 큰 흐름에서 욕심내기보다 ‘정리’에 강점이 있어요. 우선순위만 잡아도 일이 빠르게 매듭지어지는 날이에요.",
      wealth:
        "작은 지출이 모이기 쉬워요. 즉흥 결제는 한 번만 멈추고, 필요한 항목만 남기면 금전 흐름이 안정돼요.",
      love: "감정 표현은 짧고 분명할수록 좋아요. 상대를 바꾸려 하기보다 ‘내가 원하는 것’을 담백하게 말하면 관계가 부드러워져요.",
      health:
        "컨디션은 무난하지만 피로가 쌓이면 바로 티가 나요. 물/수면 리듬을 지키면 회복이 빠르게 따라와요.",
    },

    // ✅ 행운의 컬러: 오행(목/화/토/금/수) 기반 + 컬러칩
    luckyColor: {
      element: "목",
      label: "Forest Green",
      hex: "#2E7D32",
    },

    // ✅ 행운의 숫자: 0~9
    luckyNumber: 7,
  };
}

export default function Home() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("name") || "";

  return (
    <div className="homePage">
      {/* Header */}
      <div className="top-container">
        <svg
          className="top-wave"
          xmlns="http://www.w3.org/2000/svg"
          width="1944"
          height="338"
          viewBox="0 0 1944 338"
          fill="none"
        >
          <path
            d="M1869.24 93.4689C2116.24 347.469 1698.08 354.484 1292.92 326.196C887.762 297.908 154.904 335.78 23.0474 259.334C-42.2638 221.469 -22.7637 -167.709 827.736 84.4686C1215.74 199.513 1622.24 -160.531 1869.24 93.4689Z"
            fill="white"
          />
        </svg>

        <div
          onClick={() => navigate("/home")}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img src={Logo} alt="Home Logo" className="home-logo" />
          <h1>빌려온 사주</h1>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="83"
          viewBox="0 0 90 83"
          fill="none"
          onClick={() => navigate("/mypage")}
          style={{ cursor: "pointer" }}
          aria-label="마이페이지"
        >
          <path
            d="M45.0001 50C54.2084 50 61.6667 42.5416 61.6667 33.3333C61.6667 24.125 54.2084 16.6666 45.0001 16.6666C35.7917 16.6666 28.3334 24.125 28.3334 33.3333C28.3334 42.5416 35.7917 50 45.0001 50ZM45.0001 58.3333C33.8751 58.3333 11.6667 63.9166 11.6667 75V79.1666C11.6667 81.4583 13.5417 83.3333 15.8334 83.3333H74.1667C76.4584 83.3333 78.3334 81.4583 78.3334 79.1666V75C78.3334 63.9166 56.1251 58.3333 45.0001 58.3333Z"
            fill="#8F8F8F"
          />
        </svg>
      </div>

      {/* Banner */}
      <div className="banner-container">
        <BannerCarousel interval={5000} height={550} />
      </div>

      {/* Dashboard */}
      <HomeDashboard onNavigate={navigate} nickname={userName} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function HomeDashboard({ onNavigate, nickname }) {
  const [top3, setTop3] = useState([]);
  const [daily, setDaily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animatedLuckyNumber, setAnimatedLuckyNumber] = useState(0);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const [top3Data, dailyData] = await Promise.all([
          getHomeTop3(),
          getHomeDaily(nickname ?? ""),
        ]);

        if (!alive) return;
        setTop3(Array.isArray(top3Data) ? top3Data.slice(0, 3) : []);
        setDaily(dailyData);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [nickname]);

  // ✅ 행운의 숫자 애니메이션: 1,2,3... target 까지
  useEffect(() => {
    const target = daily?.luckyNumber;

    if (typeof target !== "number") {
      setAnimatedLuckyNumber(0);
      return;
    }

    if (target === 0) {
      setAnimatedLuckyNumber(0);
      return;
    }

    setAnimatedLuckyNumber(0);

    const durationMs = 700;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / durationMs, 1);
      const next = Math.max(1, Math.floor(p * target));
      setAnimatedLuckyNumber(Math.min(next, target));
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [daily?.luckyNumber]);

  const safeTop3 = useMemo(() => top3, [top3]);

  return (
    <section className="homeDashboard" aria-label="홈 메인 섹션">
      <div className="homeDashboard__inner">
        {/* LEFT: TOP3 */}
        <div className="homeDashboard__col homeDashboard__col--left">
          <div className="homeDashboard__pill homeDashboard__pill--svg">
            <svg
              className="homeDashboard__pillBg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 481 138"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M475.5 49.3967C504.476 122.183 402.27 156.283 289.646 128.012C177.023 99.7412 33.237 184.845 2.07422 81.6483C-10.5582 39.8154 31.6219 -31.3777 208.732 19.3312C265.592 35.611 435.488 -51.1112 475.5 49.3967Z"
                fill="white"
              />
            </svg>
            <span className="homeDashboard__pillLabel">
              지금 뜨고있는 사주 TOP 3
            </span>
          </div>

          <div className="homeDashboard__cards">
            {safeTop3.map((item, idx) => {
              const rank = idx + 1;
              return (
                <button
                  key={item.id ?? `${rank}`}
                  type="button"
                  className="homeDashboard__card"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                  onClick={() => {
                    if (item.to) {
                      if (item.to.startsWith("/")) {
                        onNavigate(item.to);
                      } else {
                        window.location.href = item.to;
                      }
                    }
                  }}
                >
                  <div className="homeDashboard__cardOverlay" />
                  <div className="homeDashboard__cardText">
                    <div className="homeDashboard__rank">{rank}등</div>
                    <div className="homeDashboard__title">
                      {item.title}
                      <span className="homeDashboard__arrow"> →</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {loading && (
              <div className="homeDashboard__loading">불러오는 중…</div>
            )}
          </div>
        </div>

        <div className="homeDashboard__divider" aria-hidden="true" />

        {/* RIGHT: TODAY */}
        <div className="homeDashboard__col homeDashboard__col--right">
          <div className="homeDashboard__pill homeDashboard__pill--svg">
            <svg
              className="homeDashboard__pillBg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 481 138"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M475.5 49.3967C504.476 122.183 402.27 156.283 289.646 128.012C177.023 99.7412 33.237 184.845 2.07422 81.6483C-10.5582 39.8154 31.6219 -31.3777 208.732 19.3312C265.592 35.611 435.488 -51.1112 475.5 49.3967Z"
                fill="white"
              />
            </svg>
            <span className="homeDashboard__pillLabel">
              {daily?.nickname ?? ""}님의 하루는?
            </span>
          </div>

          <div className="homeDashboard__panel">
            {/* ✅ 운세 요약 */}
            <div className="homeDashboard__block">
              <div className="homeDashboard__blockTitle">🔮 운세 요약 🔮</div>

              <div className="homeDashboard__summaryGrid">
                <div className="homeDashboard__summaryItem">
                  <div className="homeDashboard__summaryLabel">총운</div>
                  <p className="homeDashboard__summaryText">
                    {daily?.fortuneSummary?.total}
                  </p>
                </div>

                <div className="homeDashboard__summaryItem">
                  <div className="homeDashboard__summaryLabel">재물운</div>
                  <p className="homeDashboard__summaryText">
                    {daily?.fortuneSummary?.wealth}
                  </p>
                </div>

                <div className="homeDashboard__summaryItem">
                  <div className="homeDashboard__summaryLabel">애정운</div>
                  <p className="homeDashboard__summaryText">
                    {daily?.fortuneSummary?.love}
                  </p>
                </div>

                <div className="homeDashboard__summaryItem">
                  <div className="homeDashboard__summaryLabel">건강운</div>
                  <p className="homeDashboard__summaryText">
                    {daily?.fortuneSummary?.health}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ 행운 정보(컬러/숫자) : 나란히 레이아웃 */}
            <div className="homeDashboard__pairRow" aria-label="행운 정보">
              {/* LEFT: 행운의 컬러 */}
              <div className="homeDashboard__pairCol">
                <div className="homeDashboard__pairTitle">🎨 행운의 컬러</div>

                <div
                  className="homeDashboard__luckyRow"
                  style={{ "--lucky": daily?.luckyColor?.hex ?? "#D9D9D9" }}
                >
                  <span
                    className="homeDashboard__colorChip"
                    aria-label={`행운의 컬러 ${daily?.luckyColor?.label ?? ""}`}
                  />

                  <div className="homeDashboard__luckyText">
                    <div className="homeDashboard__luckyMain">
                      {daily?.luckyColor?.label ?? ""}
                    </div>
                    <div className="homeDashboard__luckySub">
                      오행: {daily?.luckyColor?.element ?? ""}
                    </div>
                    <div className="homeDashboard__luckyHex">
                      {daily?.luckyColor?.hex ?? ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="homeDashboard__pairDivider" aria-hidden="true" />

              {/* RIGHT: 행운의 숫자 */}
              <div className="homeDashboard__pairCol homeDashboard__pairCol--number">
                <div className="homeDashboard__pairTitle">🔢 행운의 숫자</div>

                <div className="homeDashboard__numberWrap">
                  <div className="homeDashboard__numberPill">
                    {typeof daily?.luckyNumber === "number"
                      ? animatedLuckyNumber
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 최소 오버라이드: 구분선 위치 + 컬러 순서 고정 */}
      <style>{`
        /* 선은 운세 요약(첫 블록) 아래로 */
        .homePage .homeDashboard__pairRow { border-top: 0 !important; padding-top: 18px; }

        /* 행운의 컬러: 동그라미 → 이름 → 오행 → 헥사코드 */
        .homePage .homeDashboard__luckyRow { display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start; gap: 14px; }
        .homePage .homeDashboard__colorChip { width: 54px; height: 54px; border-radius: 999px; background: var(--lucky); flex: 0 0 auto; }
        .homePage .homeDashboard__luckyText { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 0; }
        .homePage .homeDashboard__luckyMain { font-weight: 900; font-size: 22px; line-height: 1.05; }
        .homePage .homeDashboard__luckySub { font-weight: 800; font-size: 14px; line-height: 1.1; }
        .homePage .homeDashboard__luckyHex { width: fit-content; font-size: 14px; font-weight: 900; color: rgba(0,0,0,0.58); background: rgba(255,255,255,0.85); border-radius: 999px; padding: 8px 12px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 10px 18px rgba(0,0,0,0.06); letter-spacing: .3px; }
      `}</style>
    </section>
  );
}
