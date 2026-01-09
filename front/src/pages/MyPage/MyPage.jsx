import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import styles from "./MyPage.module.css";

import Logo from "../../assets/Logo.svg";
import ResultCard from "../../components/mypage/result";
import Header from "../../components/Header";

const TABS = [
  { key: "all", label: "전체" },
  { key: "compat", label: "궁합" },
  { key: "future", label: "미래 배우자" },
  { key: "relation", label: "관계" },
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("all");

  // ✅ 탭 알약(인디케이터) 위치/폭 측정용 refs
  const tabsRef = useRef(null);
  const tabBtnRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // 더미 데이터 (원하시면 실제 데이터로 교체)
  const results = useMemo(
    () => [
      { id: 1, title: "희진님의 정보", type: "compat" },
      { id: 2, title: "희진님의 정보", type: "future" },
      { id: 3, title: "희진님의 정보", type: "relation" },
      { id: 4, title: "희진님의 정보", type: "compat" },
      { id: 5, title: "희진님의 정보", type: "future" },
      { id: 6, title: "희진님의 정보", type: "relation" },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (activeTab === "all") return results;
    return results.filter((r) => r.type === activeTab);
  }, [activeTab, results]);

  // 3열 그리드 기준으로 추가 배경이 필요한지 계산
  const columns = 3;
  const rows = Math.max(1, Math.ceil(filtered.length / columns));
  const baseRowsCovered = 2; // 기본 큰 배경이 보통 2줄 정도는 커버
  const extraLayers = Math.max(0, rows - baseRowsCovered);

  // ✅ activeTab 바뀔 때마다 알약 위치/폭 계산 (useLayoutEffect라 깜빡임 최소)
  useLayoutEffect(() => {
    const updateIndicator = () => {
      const container = tabsRef.current;
      const activeBtn = tabBtnRefs.current[activeTab];
      if (!container || !activeBtn) return;

      const cRect = container.getBoundingClientRect();
      const bRect = activeBtn.getBoundingClientRect();

      // container 기준 상대 좌표
      const left = bRect.left - cRect.left;
      const width = bRect.width;

      setIndicator({ left, width });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <div className={styles.page}>
      {/* 상단 바 */}
      <Header
        logoSrc={Logo}
        title="빌려온 사주"
        classes={{
          topBar: styles.topBar,
          brand: styles.brand,
          logo: styles.logo,
          brandTitle: styles.brandTitle,
          iconButton: styles.iconButton,
        }}
      />

      {/* 프로필 카드 */}
      <section className={styles.profileWrap}>
        <div className={styles.profileBg} aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1744 522" className={styles.svgFull}>
            <path
              d="M1729.85 203.569C1830.81 466.439 1371.39 556.032 992.944 510.79C614.494 465.548 45.5198 600.913 0 288.156C0 113.423 71.1979 -65.2798 735.51 32.9942C936.959 62.7953 1597.57 -140.817 1729.85 203.569Z"
              fill="white"
            />
          </svg>
        </div>

        <div className={styles.profileContent}>
          <div className={styles.profileComponents}>
            <div className={styles.avatar}>
              <div className={styles.avatarCircle} />
              <button className={styles.avatarEdit} aria-label="edit profile">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 17.25V21h3.75L17.8 9.95l-3.75-3.75L3 17.25Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.06 4.94 17.81 8.69"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className={styles.profileText}>
              <div className={styles.profileName}>공구님</div>
              <div className={styles.profileEmail}>bornin2009@gmail.com</div>
            </div>

            <button className={styles.logoutBtn}>로그아웃하기</button>
          </div>
        </div>
      </section>

      {/* 최근 기록 섹션 */}
      <div className={styles.recordsSectionDown}>
        <section className={styles.recordsWrap}>
          {/* 배경 SVG 스택 (기본 큰 배경 + 추가 배경(겹침)) */}
          <div className={styles.recordsBg} aria-hidden="true">
            <div className={styles.bgStack}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1752 1454" className={styles.svgFull}>
                <g filter="url(#filter0_d_178_43)">
                  <path
                    d="M739.51 62.9541C940.959 119.816 1601.57 -268.685 1733.85 388.42C1761.54 525.964 1747.08 638.645 1703.71 727.976C1715.6 760.801 1725.72 797.227 1733.85 837.602C1834.81 1339.17 1375.39 1510.12 996.944 1423.79C618.494 1337.47 49.5198 1595.75 4 998.996C4.00001 900.34 10.2364 801.021 36.2285 714.928C19.9671 668.877 8.92232 614.345 4 549.814C4.00003 216.416 75.1984 -124.557 739.51 62.9541Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_178_43"
                    x="0"
                    y="0"
                    width="1752"
                    height="1453.18"
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
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_178_43" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_178_43" result="shape" />
                  </filter>
                </defs>
              </svg>

              {/* 결과가 늘어날 때마다 아래 SVG가 "겹쳐지며" 추가 */}
              {Array.from({ length: extraLayers }).map((_, idx) => (
                <svg
                  key={idx}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1752 1004"
                  className={`${styles.svgFull} ${styles.svgOverlap}`}
                >
                  <g filter="url(#filter0_d_50_139)">
                    <path
                      d="M1733.85 388.419C1834.81 889.986 1375.39 1060.94 996.944 974.611C618.494 888.286 49.5198 1146.57 4 549.815C4 216.416 75.1982 -124.557 739.51 62.9543C940.959 119.816 1601.57 -268.685 1733.85 388.419Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_50_139"
                      x="0"
                      y="0"
                      width="1752"
                      height="1004"
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
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_50_139" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_50_139" result="shape" />
                    </filter>
                  </defs>
                </svg>
              ))}
            </div>
          </div>

          <div className={styles.recordsContent}>
            <h2 className={styles.sectionTitle}>최근 본 운세 기록</h2>

            {/* ✅ 탭 바: 알약은 1개만 두고, 위치/폭만 애니메이션 */}
            <div className={styles.tabs} ref={tabsRef}>
              <motion.div
                className={styles.tabPill}
                animate={{ x: indicator.left, width: indicator.width }}
                transition={{ type: "spring", stiffness: 520, damping: 42, bounce: 0 }}
              />

              {TABS.map((t) => {
                const active = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    ref={(el) => {
                      if (el) tabBtnRefs.current[t.key] = el;
                    }}
                    className={`${styles.tab} ${active ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab(t.key)}
                    type="button"
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className={styles.grid}>
              {filtered.map((item) => (
                <ResultCard key={item.id} title={item.title} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}