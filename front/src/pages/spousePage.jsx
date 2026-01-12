import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import logo from '../assets/logo.svg';
import { createRecord, getSpouseImage } from '../utils/api';
import { captureAndDownload } from '../utils/screenshot';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
`;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #fff9d7;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const TopHeader = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 50px;
  line-height: 1;
  img { width: 50px; }
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: #2c2c2c;
`;

const ContentCard = styled.div`
  width: 90vw;
  height: 75vh;
  max-width: 1280px;
  background-image: url("data:image/svg+xml,%3Csvg width='1508' height='865' viewBox='0 0 1508 865' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23filter0_d_234_1206)'%3E%3Cpath d='M1491.83 334.212C1578.67 765.782 1183.52 912.873 858.023 838.596C532.521 764.319 43.1512 986.556 4 473.084C4 186.214 65.2367 -107.174 636.606 54.1686C809.871 103.095 1378.06 -231.188 1491.83 334.212Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_d_234_1206' x='0' y='0' width='1508' height='865' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='4'/%3E%3CfeGaussianBlur stdDeviation='2'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/%3E%3CfeBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_234_1206'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_234_1206' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 3vh 5vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const TextGroup = styled.div`
  text-align: center;
`;

const MainTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #2c2c2c;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0;
  line-height: 1.5;
`;

const ResultSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 25px;
  flex: 1;
  max-height: 320px;
`;

const SpouseImageContainer = styled.div`
  flex-shrink: 0;
  height: 100%;
  aspect-ratio: 1 / 1;
`;

const SpouseImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #e0e0e0;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 500px;
`;

const InfoBox = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 5px;
`;

const InfoTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #2c2c2c;
  margin-bottom: 3px;
`;

const InfoItem = styled.div`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
`;

const SaveButton = styled.button`
  width: 100%;
  max-width: 500px;
  height: 48px;
  background: #FFF3AE;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 400;

  &:hover {
    background: #FFD93D;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const ShareButton = styled.button`
  width: 100%;
  max-width: 500px;
  height: 48px;
  background: #E8F4F8;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #2c2c2c;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 400;
  margin-top: 12px;

  &:hover {
    background: #D0E8F0;
    transform: translateY(-2px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoadingMessage = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export default function SpousePage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  
  const [spouseData, setSpouseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentCardRef = useRef(null);

  useEffect(() => {
    const fetchSpouseData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getSpouseImage();
        
        if (response.status !== 'success' || !response.data) {
          throw new Error('데이터를 가져오지 못했습니다.');
        }

        const data = response.data;

        const spouseData = {
          imageUrl: data.image_url, // 예: /assets/ai_f/wood_1.png
          impression: data.attributes.impression || [],
          fashion: data.attributes.fashion || [],
          mood: data.attributes.mood || [],
          job: data.attributes.job || [],
        };

        setSpouseData(spouseData);

      } catch (err) {
        console.error('배우자 이미지 조회 실패:', err);
        setError(err.message || '결과를 가져오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSpouseData();
  }, []);

  const handleSave = async () => {
    if (saved) return;
    
    try {
      setSaved(true);
      
      const content = `나의 미래 배우자\n인상: ${spouseData?.impression?.join(", ") || ""}\n패션: ${spouseData?.fashion?.join(", ") || ""}\n무드: ${spouseData?.mood?.join(", ") || ""}\n직업: ${spouseData?.job?.join(", ") || ""}`;
      const metadata = JSON.stringify({
        impression: spouseData?.impression || [],
        fashion: spouseData?.fashion || [],
        mood: spouseData?.mood || [],
        job: spouseData?.job || [],
        image_url: spouseData?.imageUrl || "",
      });

      await createRecord({
        type: "ai_spouse",
        content: content,
        image_url: spouseData?.imageUrl || "",
        metadata: metadata,
      });

      alert('저장되었습니다! 📸');
    } catch (err) {
      console.error("저장 실패:", err);
      setSaved(false);
      alert(err.message || "저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  const handleShare = async () => {
    try {
      if (!contentCardRef.current) {
        alert("공유할 내용을 찾을 수 없습니다.");
        return;
      }
      await captureAndDownload(contentCardRef.current, "미래배우자결과");
      alert("이미지가 저장되었습니다! 📸");
    } catch (err) {
      console.error("캡처 실패:", err);
      alert("이미지 저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingMessage>
          <div>🔮</div>
          <div>결과 분석 중입니다...</div>
        </LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <LoadingMessage>{error}</LoadingMessage>
      </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <TopHeader>
          <Logo onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
            <img src={logo} alt="logo"/>
          </Logo>
          <Title onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>빌려온 사주</Title>
        </TopHeader>

        <ContentCard ref={contentCardRef}>
          <TextGroup>
            <MainTitle>나의 미래 배우자는?</MainTitle>
            <Subtitle>실제 인물을 예측하는 것이 아니며, 사주 성향을 바탕으로 시각화한 이미지입니다.</Subtitle>
          </TextGroup>

          <ResultSection>
            <SpouseImageContainer>
              <SpouseImage>
                {spouseData?.imageUrl ? (
                  <img src={spouseData.imageUrl} alt="미래 배우자 이미지" />
                ) : (
                  "이미지 없음"
                )}
              </SpouseImage>
            </SpouseImageContainer>

            <InfoGrid>
              <InfoBox>
                <InfoTitle>인상</InfoTitle>
                {spouseData?.impression?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>

              <InfoBox>
                <InfoTitle>패션</InfoTitle>
                {spouseData?.fashion?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>

              <InfoBox>
                <InfoTitle>무드</InfoTitle>
                {spouseData?.mood?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>

              <InfoBox>
                <InfoTitle>직업</InfoTitle>
                {spouseData?.job?.map((item, idx) => (
                  <InfoItem key={idx}>{item}</InfoItem>
                ))}
              </InfoBox>
            </InfoGrid>
          </ResultSection>

          <ButtonContainer>
            <SaveButton onClick={handleSave}>
              {saved ? '저장 완료! ✅' : '나의 미래 배우자 저장하기'}
            </SaveButton>
            <ShareButton onClick={handleShare}>
              공유하기
            </ShareButton>
          </ButtonContainer>
        </ContentCard>
      </Container>
    </>
  );
};