import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Banner1 from "../../assets/Banner1.png";
import Banner2 from "../../assets/Banner2.png";
import Banner3 from "../../assets/Banner3.png";

// ✅ 기존 데이터 export 유지 (다른 곳에서 default로 import하고 있을 수 있어서)
const banners = [
  { id: 1, image: Banner1, alt: "Banner 1" },
  { id: 2, image: Banner2, alt: "Banner 2" },
  { id: 3, image: Banner3, alt: "Banner 3" },
];

/**
 * ✅ 5초마다 자동으로 넘어가는 배너 컴포넌트
 * - 기본 interval: 5000ms
 * - hover 시 자동 넘김 일시정지
 * - 좌/우 버튼 및 점(dot) 옵션
 *
 * 사용 예:
 *   import banners, { BannerCarousel } from "./Banner";
 *   <BannerCarousel interval={5000} />
 */

export function BannerCarousel({
  interval = 5000,
  height = 900,
  showArrows = true,
  showDots = true,
  className = "",
  overlay = null, // 필요하면 JSX로 오버레이(문구/버튼 등) 전달
}) {
  const slides = useMemo(() => banners, []);
  const [index, setIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (isHover) return;

    const id = window.setInterval(goNext, interval);
    return () => window.clearInterval(id);
  }, [goNext, interval, isHover, slides.length]);

  // 접근성: 키보드 좌/우
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    },
    [goPrev, goNext]
  );

  const dotsAreaHeight = showDots ? 70 : 0;

  const wrapperStyle = {
    position: "relative",
    width: "100%",
    height: height + dotsAreaHeight,
    overflow: "visible", // dots 영역이 배너 밖(아래)로 나와도 보이게
    borderRadius: 0,
  };

  const stageStyle = {
    position: "relative",
    width: "100%",
    height,
    overflow: "hidden", // 배너 이미지는 여기서만 잘라줌
    borderRadius: 0,
  };

  const slideStyleBase = {
    position: "absolute",
    inset: 0,
    transition: "opacity 500ms ease",
  };

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  };

  const arrowStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "auto",
    height: "auto",
    padding: 0,
    margin: 0,
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    zIndex: 10,
    lineHeight: 0,
    outline: "none",
    WebkitTapHighlightColor: "transparent",
  };

  const dotsAreaStyle = {
    position: "relative",
    width: "100%",
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    overflow: "visible",
    borderRadius: 0,
    marginTop: 0,
  };

  const dotsBgSvgStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    display: "block",
    zIndex: 0,
    pointerEvents: "none",
    overflow: "visible",
  };

  const dotsWrapStyle = {
    position: "relative",
    display: "flex",
    gap: 12,
    zIndex: 1,
  };

  const dotStyleBase = {
    width: 8,
    height: 8,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.35)",
    background: "transparent",
    cursor: "pointer",
    padding: 0,
  };

  const overlayStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    pointerEvents: "none", // 오버레이 내부에 버튼이 필요하면 아래에서 pointerEvents를 다시 켜면 됨
  };
  const navigate = useNavigate();

  // 현재 배너(1|2|3) 클릭 시 Information 페이지로 type 전달
  const onBannerClick = useCallback(
    (type) => {
      navigate("/information", { state: { type } });
    },
    [navigate]
  );

  return (
    <section
      className={className}
      style={wrapperStyle}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      aria-roledescription="carousel"
      aria-label="Banner carousel"
    >
      <div style={stageStyle}>
        {slides.map((b, i) => (
          <div
            key={b.id}
            style={{
              ...slideStyleBase,
              opacity: i === index ? 1 : 0,
              pointerEvents: i === index ? "auto" : "none",
            }}
            aria-hidden={i !== index}
          >
            <img
              src={b.image}
              alt={b.alt}
              style={{ ...imgStyle, cursor: "pointer" }}
              onClick={() => onBannerClick(b.id)}
            />
          </div>
        ))}

        {/* 오버레이(문구/버튼 등) 필요하면 overlay prop으로 JSX 넣어줘 */}
        {overlay ? (
          <div style={overlayStyle}>
            <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
              {overlay}
            </div>
          </div>
        ) : null}

        {showArrows ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              style={{ ...arrowStyle, left: 24 }}
              aria-label="Previous banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="54"
                viewBox="0 0 29 54"
                fill="none"
                aria-hidden="true"
                focusable="false"
                style={{ width: 29, height: 54, display: "block" }}
              >
                <path
                  d="M27 2L2 27L27 52"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              style={{ ...arrowStyle, right: 24 }}
              aria-label="Next banner"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="29"
                height="54"
                viewBox="0 0 29 54"
                fill="none"
                aria-hidden="true"
                focusable="false"
                style={{ width: 29, height: 54, display: "block" }}
              >
                <path
                  d="M2 2L27 27L2 52"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {showDots ? (
        <div style={dotsAreaStyle} aria-label="Banner dots">
          {/* dots 영역 배경 SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1916"
            height="125"
            viewBox="0 0 1916 125"
            fill="none"
            preserveAspectRatio="none"
            style={dotsBgSvgStyle}
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M0.552951 22.9969V0.5H1914.55C1914.72 7 1915.05 24.8 1915.05 44C1881.45 78.4 1809.39 94.6667 1777.55 98.5C1733.72 106.667 1600.25 122.2 1417.05 119C1233.85 115.8 990.72 104.667 892.053 99.5H803.053C-2.9556 182.864 -0.210646 28.866 0.552951 22.9969Z"
              fill="white"
            />
            <path
              d="M0.552951 0.5V23.2644C2.05273 13 -42.947 187 803.053 99.5C833.853 99.5 875.22 99.5 892.053 99.5C990.72 104.667 1233.85 115.8 1417.05 119C1600.25 122.2 1733.72 106.667 1777.55 98.5C1809.39 94.6667 1881.45 78.4 1915.05 44C1915.05 24.8 1914.72 7 1914.55 0.5H0.552951Z"
              stroke="white"
            />
          </svg>

          <div style={dotsWrapStyle}>
            {slides.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
                style={{
                  ...dotStyleBase,
                  background: i === index ? "rgba(0,0,0,0.55)" : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default banners;