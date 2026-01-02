import React from "react";
import styles from "./result.module.css";

export default function ResultCard({ title = "희진님의 정보", onClick }) {
  return (
    <button className={styles.card} onClick={onClick} type="button">
      {/* 요청하신 카드 배경 SVG */}
      <div className={styles.bg} aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 492 273"
          className={styles.svg}
        >
          <path
            d="M488.007 106.464C516.491 243.942 386.884 290.799 280.12 267.137C173.355 243.476 12.8416 314.27 0 150.702C0 59.319 20.0856 -34.1406 207.495 17.2556C264.326 32.8412 450.691 -73.6456 488.007 106.464Z"
            fill="#F5F5F5"
          />
        </svg>
      </div>

      <div className={styles.text}>{title}</div>
    </button>
  );
}