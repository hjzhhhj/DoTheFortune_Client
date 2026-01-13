import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../components/Header";
import {
  getSimilarUserMatches,
  getFortuneInfo,
  createRecord,
} from "../utils/api";
import { captureAndDownload } from "../utils/screenshot";

import cloud from "../assets/cloud.png";
import darkCloud from "../assets/darkcloud.png";
import smallCloud from "../assets/smallDarkCloud.png";
import logo from "../assets/logo.svg";

const GlobalStyle = createGlobalStyle`
  
  body {
  width: 100%;
  height: 100%;
    margin: 0;
    padding: 0;
    background-color: #fff9d7;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
    align-items: center;
    display: flex;
    justify-content: center;
    background-size: cover;
    
  }
    #root {
    min-height: 100vh; 
  }
`;
const Page = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 80px;
  min-height: 100vh;
  background: #fff9d7;
  padding-bottom: 100px;
  box-sizing: border-box;
`;

const CardWrap = styled.div`
  position: relative;
  width: 900px;
  height: 1000px;
  margin: 0 auto;
`;

const BigCloud = styled.div`
  position: absolute;
  inset: 0;
  margin: 0 auto;
  width: 900px;
  height: 900px;
  background: url(${cloud}) no-repeat center / contain;
`;

const Big1 = styled(BigCloud)`
  top: -100px;
  z-index: 3;
`;
const Big2 = styled(BigCloud)`
  top: 175px;
  z-index: 2;
`;
const Big3 = styled(BigCloud)`
  top: 350px;
  z-index: 1;
`;

const Content = styled.div`
  position: absolute;
  top: 160px;
  inset-inline: 0;
  margin: 0 auto;
  width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 32px;
`;

const SmallRow = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
`;

const SmallCloud = styled.div`
  width: 260px;
  height: 120px;
  background: url(${smallCloud}) no-repeat center / contain;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`;

const MidCloud = styled.div`
  width: 520px;
  height: 420px;
  background: url(${darkCloud}) no-repeat center / contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 32px;
  margin-bottom: 40px;
`;

const SajuGrid = styled.div`
  display: flex;
  gap: 16px;
  margin: 20px 0;
`;

const SajuCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SajuTitle = styled.div`
  font-size: 14px;
  color: #9aa;
  margin-bottom: 8px;
`;

const SajuCard = styled.div`
  width: 100px;
  height: 150px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 14px;
  margin-right: -10px;
`;

const Sky = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${({ red }) => (red ? "#e94b3c" : "#222")};
`;

const Earth = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #e94b3c;
`;

const EmptyCircle = styled.div`
  width: 26px;
  height: 26px;
  border: 2px solid #333;
  border-radius: 50%;
`;

const Buttons = styled.div`
  width: 520px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Btn = styled.button`
  height: 44px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  background: ${({ primary }) => (primary ? "#fff1a8" : "#eee")};
`;
const InfoWrapper = styled.div`
  margin-top: 20px;
`;
const InfoRow = styled.div`
  margin-top: 16px;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NameBirth = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 2px;
`;

const Percent = styled.div`
  font-size: 25px;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-left: 100px;
`;

const MatchText = styled.span`
  font-size: 12px;
  font-weight: 500;
`;
const HeaderWrapper = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  z-index: 10;

  .topBar,
  .header__topBar {
    margin-bottom: 0;
  }
`;
const Highlight = styled.span`
  font-weight: 800;
  font-size: 16px;
`;
/* ===== Component ===== */
export default function FriendResult() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardWrapRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 유사 사주 친구 매칭 결과 가져오기
        const matchesData = await getSimilarUserMatches();

        // 내 사주 정보 가져오기
        const myFortuneInfo = await getFortuneInfo();

        // 데이터 변환
        const similarUser = matchesData.similar_user;
        const bestMatch = matchesData.best_match;
        const worstMatch = matchesData.worst_match;

        // 생년월일 포맷팅 함수
        const formatBirthDate = (user) => {
          if (!user || !user.fortune_info) return "";
          const { birth_year, birth_month, birth_day } = user.fortune_info;
          return `${birth_year}.${String(birth_month).padStart(
            2,
            "0"
          )}.${String(birth_day).padStart(2, "0")}`;
        };

        // 사주 정보 파싱 함수
        const parseSaju = (fortuneInfo) => {
          if (!fortuneInfo) {
            return {
              si: { sky: null, earth: null },
              il: { sky: null, earth: null },
              wol: { sky: null, earth: null },
              nyeon: { sky: null, earth: null },
            };
          }
          return {
            si: {
              sky: fortuneInfo.hour_heavenly_stem || null,
              earth: fortuneInfo.hour_earthly_branch || null,
            },
            il: {
              sky: fortuneInfo.day_heavenly_stem || null,
              earth: fortuneInfo.day_earthly_branch || null,
            },
            wol: {
              sky: fortuneInfo.month_heavenly_stem || null,
              earth: fortuneInfo.month_earthly_branch || null,
            },
            nyeon: {
              sky: fortuneInfo.year_heavenly_stem || null,
              earth: fortuneInfo.year_earthly_branch || null,
            },
          };
        };

        setResult({
          bestMatch: bestMatch?.user?.name || "없음",
          worstMatch: worstMatch?.user?.name || "없음",
          similar: similarUser
            ? {
                name: similarUser.user?.name || "없음",
                birth: formatBirthDate(similarUser.user),
                percent: Math.round(similarUser.score || 0),
              }
            : {
                name: "없음",
                birth: "",
                percent: 0,
              },
          saju: parseSaju(similarUser?.user?.fortune_info || myFortuneInfo),
        });
      } catch (err) {
        console.error("데이터 가져오기 실패:", err);
        setError(err.message || "데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <HeaderWrapper>
          <Header
            logoSrc={logo}
            title="빌려온 사주"
            onLogoClick={() => navigate("/home")}
          />
        </HeaderWrapper>
        <Page>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div>유사 사주 친구를 찾는 중...</div>
          </div>
        </Page>
      </>
    );
  }

  if (error || !result) {
    return (
      <>
        <GlobalStyle />
        <HeaderWrapper>
          <Header
            logoSrc={logo}
            title="빌려온 사주"
            onLogoClick={() => navigate("/home")}
          />
        </HeaderWrapper>
        <Page>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              color: "red",
            }}
          >
            <div>{error || "데이터를 불러올 수 없습니다."}</div>
          </div>
        </Page>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <HeaderWrapper>
        <Header
          logoSrc={logo}
          title="빌려온 사주"
          onLogoClick={() => navigate("/home")}
        />
      </HeaderWrapper>
      <Page>
        <CardWrap ref={cardWrapRef}>
          <Big3 />
          <Big2 />
          <Big1 />

          <Content>
            <Title>유사 사주 친구 결과</Title>

            <SmallRow>
              <SmallCloud>
                잘맞는 학생
                <Highlight>{result.bestMatch}</Highlight>
              </SmallCloud>
              <SmallCloud>
                안맞는 학생
                <Highlight>{result.worstMatch}</Highlight>
              </SmallCloud>
            </SmallRow>

            <MidCloud>
              <div>나와 비슷한 사주를 가진 학생</div>
              <InfoWrapper>
                <InfoRow>
                  <NameBirth>
                    <b>{result.similar.name}</b>
                    <div>{result.similar.birth}</div>
                  </NameBirth>
                  <Percent>
                    {result.similar.percent}%<MatchText>일치</MatchText>
                  </Percent>
                </InfoRow>
              </InfoWrapper>
              <SajuGrid>
                {[
                  { label: "시주", key: "si" },
                  { label: "일주", key: "il" },
                  { label: "월주", key: "wol" },
                  { label: "년주", key: "nyeon" },
                ].map(({ label, key }) => {
                  const v = result.saju[key];
                  return (
                    <SajuCol key={key}>
                      <SajuTitle>{label}</SajuTitle>
                      <SajuCard>
                        {v.sky ? (
                          <Sky red={key !== "wol"}>{v.sky}</Sky>
                        ) : (
                          <EmptyCircle />
                        )}
                        {v.earth ? <Earth>{v.earth}</Earth> : <EmptyCircle />}
                      </SajuCard>
                    </SajuCol>
                  );
                })}
              </SajuGrid>
            </MidCloud>

            <Buttons>
              <Btn
                primary
                onClick={async () => {
                  if (!result) return;

                  try {
                    const content = `유사 사주 친구 찾기 결과\n비슷한 사주: ${result.similar.name} (${result.similar.percent}% 일치)\n잘 맞는 학생: ${result.bestMatch}\n안 맞는 학생: ${result.worstMatch}`;
                    const metadata = JSON.stringify({
                      similar_user: result.similar.name,
                      similar_score: result.similar.percent,
                      best_match: result.bestMatch,
                      worst_match: result.worstMatch,
                    });
                    await createRecord({
                      type: "similar_friend",
                      content: content,
                      metadata: metadata,
                    });
                    alert("저장이 완료되었습니다! ✅");
                  } catch (err) {
                    console.error("저장 실패:", err);
                    alert(err.message || "저장 중 오류가 발생했습니다.");
                  }
                }}
              >
                관계 저장하기
              </Btn>
              <Btn
                onClick={async () => {
                  try {
                    if (!cardWrapRef.current) {
                      alert("공유할 내용을 찾을 수 없습니다.");
                      return;
                    }
                    await captureAndDownload(
                      cardWrapRef.current,
                      "유사사주친구결과"
                    );
                    alert("이미지가 저장되었습니다! 📸");
                  } catch (err) {
                    console.error("캡처 실패:", err);
                    alert(
                      "이미지 저장 중 오류가 발생했습니다. 다시 시도해 주세요."
                    );
                  }
                }}
              >
                결과 공유하기
              </Btn>
            </Buttons>
          </Content>
        </CardWrap>
      </Page>
    </>
  );
}
