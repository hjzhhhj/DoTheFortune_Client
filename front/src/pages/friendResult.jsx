import { useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";

import cloud from "../assets/cloud.png";
import darkCloud from "../assets/darkCloud.png";
import smallCloud from "../assets/smallDarkCloud.png";
import logo from "../assets/logo.svg";
import Header from "../components/Header";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-1Thin.woff2")
      format("woff2");
    font-weight: 100;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-2ExtraLight.woff2")
      format("woff2");
    font-weight: 200;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-3Light.woff2")
      format("woff2");
    font-weight: 300;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-4Regular.woff2")
      format("woff2");
    font-weight: 400;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-5Medium.woff2")
      format("woff2");
    font-weight: 500;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-6SemiBold.woff2")
      format("woff2");
    font-weight: 600;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-7Bold.woff2")
      format("woff2");
    font-weight: 700;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-8ExtraBold.woff2")
      format("woff2");
    font-weight: 800;
    font-display: swap;
  }

  @font-face {
    font-family: "Paperozi";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0/Paperlogy-9Black.woff2")
      format("woff2");
    font-weight: 900;
    font-display: swap;
  }
  body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background-color: #fff9d7;
    font-family: "Paperozi";
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
  height: 1250px;
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
  font-family: "Paperozi";
  width: 520px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Btn = styled.button`
  font-family: "Paperozi";
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

const TopHeader = styled(Header)`
  position: absolute;
  top: 30px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;

  .header__logo {
    width: 50px;
  }

  .header__title {
    font-size: 30px;
    font-weight: bold;
  }
`;

const Highlight = styled.span`
  font-weight: 800;
  font-size: 16px;
`;

export default function FriendResult() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    setResult({
      bestMatch: "이함한해",
      worstMatch: "기태연",
      similar: {
        name: "윤성연",
        birth: "2008.01.21",
        percent: 94,
      },
      saju: {
        si: { sky: null, earth: null },
        il: { sky: "甲", earth: "子" },
        wol: { sky: "己", earth: "亥" },
        nyeon: { sky: "丙", earth: "子" },
      },
    });
  }, []);

  if (!result) return null;

  return (
    <>
      <GlobalStyle />
      <TopHeader logoSrc={logo} title="빌려온 사주" showSettings={false} />
      <Page>
        <CardWrap>
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
              <Btn primary>관계 저장하기</Btn>
              <Btn>결과 공유하기</Btn>
            </Buttons>
          </Content>
        </CardWrap>
      </Page>
    </>
  );
}
