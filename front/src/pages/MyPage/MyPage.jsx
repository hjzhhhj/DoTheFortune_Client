import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./MyPage.module.css";
import { getMe, logout as apiLogout, getFortuneInfo, getRecentRecords } from "../../utils/api";
import { removeToken } from "../../utils/api";

import Logo from "../../assets/Logo.svg";
import ResultCard from "../../components/mypage/result";

const TABS = [
  { key: "all", label: "전체" },
  { key: "compat", label: "궁합" },
  { key: "future", label: "미래 배우자" },
  { key: "relation", label: "관계" },
];

export default function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
  });
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 탭 알약(인디케이터) 위치/폭 측정용 refs
  const tabsRef = useRef(null);
  const tabBtnRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // 사용자 정보 및 기록 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // localStorage에서 사용자 정보 가져오기
        const name = localStorage.getItem("name") || "";
        const email = localStorage.getItem("email") || "";
        
        setUserInfo({ name, email });

        // 최근 기록 가져오기 (6개로 제한)
        try {
          const recordsData = await getRecentRecords(6);
          if (recordsData && recordsData.records) {
            // 타입 변환: backend 타입 -> frontend 타입
            const formattedRecords = recordsData.records.map((record) => {
              let type = "all";
              if (record.type === "compatibility") {
                type = "compat";
              } else if (record.type === "ai_spouse") {
                type = "future";
              } else if (record.type === "today_fortune") {
                type = "relation";
              }
              
              // metadata 파싱 (JSON 문자열일 수 있음)
              let metadata = null;
              if (record.metadata) {
                try {
                  metadata = typeof record.metadata === 'string' 
                    ? JSON.parse(record.metadata) 
                    : record.metadata;
                } catch (e) {
                  console.error("metadata 파싱 실패:", e);
                }
              }
              
              // 궁합 결과의 경우 더 자세한 제목 생성
              // 상대방 이름이 "상대방"이면 필터링 (null 또는 undefined도 체크)
              if (record.type === "compatibility" && metadata) {
                const user2Name = metadata.user2_name || "";
                if (!user2Name || user2Name.trim() === "" || user2Name === "상대방") {
                  // 상대방 이름이 없거나 "상대방"이면 이 기록을 제외
                  return null;
                }
              }
              
              let title = "기록";
              if (record.type === "compatibility" && metadata) {
                const score = metadata.score ? Math.round(metadata.score) : "";
                const user2Name = metadata.user2_name || "";
                if (score && user2Name) {
                  // 이름이 3글자 이상이면 앞 2글자만 사용
                  const shortName = user2Name.length > 2 ? user2Name.substring(0, 2) : user2Name;
                  title = `${shortName}님 궁합 ${score}점`;
                } else if (score) {
                  title = `궁합 ${score}점`;
                }
              } else if (record.type === "ai_spouse") {
                title = "나의 미래 배우자";
              } else if (record.type === "similar_friend" || record.type === "today_fortune") {
                title = "유사 친구";
              } else {
                // content에서 첫 줄만 가져오기 (최대 15자)
                const content = record.content || "";
                const firstLine = content.split('\n')[0];
                title = firstLine.length > 15 ? firstLine.substring(0, 15) + "..." : firstLine;
              }
              
              return {
                id: record.id,
                title: title,
                type: type,
                createdAt: record.created_at,
                metadata: metadata,
                recordType: record.type, // 원본 타입 저장
                recordData: record, // 전체 기록 데이터 저장
              };
            })
            .filter(record => record !== null); // null인 기록 제거
            setRecords(formattedRecords);
          }
        } catch (err) {
          console.error("기록 조회 실패:", err);
          // 기록 조회 실패해도 계속 진행
        }
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    if (window.confirm("로그아웃하시겠습니까?")) {
      try {
        await apiLogout();
        removeToken();
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        navigate("/login");
      } catch (err) {
        console.error("로그아웃 실패:", err);
        // 에러가 나도 토큰 제거하고 로그인 페이지로 이동
        removeToken();
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        navigate("/login");
      }
    }
  };

  const filtered = useMemo(() => {
    if (activeTab === "all") return records;
    return records.filter((r) => r.type === activeTab);
  }, [activeTab, records]);

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
      <header className={styles.topBar}>
        <div 
          className={styles.brand} 
          onClick={() => navigate("/home")}
          style={{ cursor: "pointer" }}
        >
          <img className={styles.logo} src={Logo} alt="logo" />
          <div className={styles.brandTitle}>빌려온 사주</div>
        </div>

        <button className={styles.iconButton} aria-label="settings">
          {/* 간단한 기어 아이콘(svg) */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M19.4 15a8.3 8.3 0 0 0 .1-1 8.3 8.3 0 0 0-.1-1l2-1.6-1.9-3.3-2.4 1a8 8 0 0 0-1.7-1l-.4-2.6H10l-.4 2.6a8 8 0 0 0-1.7 1l-2.4-1-1.9 3.3 2 1.6a8.3 8.3 0 0 0-.1 1c0 .3 0 .7.1 1l-2 1.6 1.9 3.3 2.4-1c.5.4 1.1.7 1.7 1l.4 2.6h4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1 1.9-3.3-2-1.6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

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
            </div>

            <div className={styles.profileText}>
              <div className={styles.profileName}>{userInfo.name || "사용자"}님</div>
              <div className={styles.profileEmail}>{userInfo.email || ""}</div>
            </div>

            <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃하기</button>
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
            <h2 className={styles.sectionTitle}>저장한 사주 기록git config --global --list</h2>

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
              {loading ? (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>
                  로딩 중...
                </div>
              ) : filtered.length > 0 ? (
                filtered.map((item) => (
                  <ResultCard 
                    key={item.id} 
                    title={item.title}
                    onClick={() => {
                      // 기록 타입에 따라 해당 페이지로 이동
                      if (item.recordType === "compatibility" && item.metadata) {
                        // 궁합 결과 페이지로 이동
                        navigate("/result", {
                          state: {
                            compatibility: {
                              score: item.metadata.score || 0,
                              analysis: item.metadata.analysis || "",
                              communication_analysis: item.metadata.communication_analysis || "",
                              emotion_analysis: item.metadata.emotion_analysis || "",
                              lifestyle_analysis: item.metadata.lifestyle_analysis || "",
                              caution_analysis: item.metadata.caution_analysis || "",
                            },
                            myInfo: {
                              userName: userInfo.name || "",
                            },
                            otherInfo: {
                              userName: item.metadata.user2_name || "상대방",
                            },
                          },
                        });
                      } else if (item.recordType === "ai_spouse") {
                        // 미래 배우자 페이지로 이동 (데이터를 state로 전달)
                        navigate("/future-partner", {
                          state: {
                            recordData: item.recordData,
                            metadata: item.metadata,
                          },
                        });
                      } else if (item.recordType === "similar_friend" || item.recordType === "today_fortune") {
                        // 유사 친구 또는 오늘의 운세 페이지로 이동
                        navigate("/similar-friend", {
                          state: {
                            recordData: item.recordData,
                            metadata: item.metadata,
                          },
                        });
                      }
                    }}
                  />
                ))
              ) : (
                <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#666" }}>
                  기록이 없습니다.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}