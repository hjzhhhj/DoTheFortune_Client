/** @jsxImportSource @emotion/react */
import React from "react";
import { useNavigate } from "react-router-dom";
import { css } from "@emotion/react";

import footerLogo from "../../assets/footerlogo.svg";
import Github from "../../assets/Github.png";

export default function Footer() {
  const navigate = useNavigate();

  function goGitHub() {
    window.location.href = "https://github.com/MIRIM-22";
  }

  return (
    <footer css={wrap}>
      {/* White curved footer background */}
      <svg
        css={wave}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1919 419"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0.5 150.749V415.749L1918.5 418.25V175.749C1812.9 -46.2507 1533.17 -11.084 1406.5 34.2494C1380.83 40.5827 1309.2 58.0494 1228 77.2494C1016.4 134.449 847 91.7495 786 77.2494C754.167 68.916 678 49.3493 628 37.7491C180 -64.2509 23 70.5825 0.5 150.749Z"
          fill="white"
          stroke="white"
        />
      </svg>

      {/* Content overlay */}
      <div css={content}>
        <div css={left}>
          <div
            css={brandRow}
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer" }}
          >
            <img css={logo} src={footerLogo} alt="빌려온 사주 로고" />
            <h1 css={title}>빌려온 사주</h1>
          </div>
          <p css={copy}>
            © 2025 MIRIM MEISTER HIGH SCHOOL 2-2. All Rights Reserved
          </p>
        </div>

        <button
          type="button"
          css={githubBtn}
          onClick={goGitHub}
          aria-label="GitHub"
        >
          <img css={githubIcon} src={Github} alt="" aria-hidden="true" />
        </button>
      </div>
    </footer>
  );
}

const wrap = css`
  position: relative;
  width: 100%;
  /* screenshot처럼 연노랑 배경 */
  background: #fff7d6;
  overflow: hidden;
  /* footer 높이 */
  height: clamp(190px, 18vw, 260px);
`;

const wave = css`
  width: 100%;
  height: 100%;
  display: block;
`;

const content = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(32px, 4vw, 64px) clamp(22px, 5vw, 90px);
  box-sizing: border-box;
`;

const left = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

const brandRow = css`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const logo = css`
  width: 80px;
  height: 80px;
  display: block;
`;

const title = css`
  margin: -10px;
  font-size: clamp(22px, 2.2vw, 34px);
  font-weight: 600;
  line-height: 1.1;
  color: #111;
  letter-spacing: -0.02em;
`;

const copy = css`
  margin: 0;
  font-size: clamp(12px, 1.2vw, 16px);
  color: #111;
  opacity: 0.9;
  line-height: 1.4;
  word-break: keep-all;
`;

const githubBtn = css`
  width: clamp(46px, 4.5vw, 72px);
  height: clamp(46px, 4.5vw, 72px);
  border: 0;
  border-radius: 999px;
  background: #000;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);

  &:active {
    transform: translateY(1px);
  }
`;

const githubIcon = css`
  width: 58%;
  height: 58%;
  object-fit: contain;
  /* 아이콘이 검정/회색이면 흰색처럼 보이게 */
  filter: invert(1);
`;
