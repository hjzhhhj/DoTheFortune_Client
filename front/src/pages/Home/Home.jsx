import React from "react";
import "./Home.css";
import Logo from "../../assets/homelogo.svg";
import banners, { BannerCarousel } from "../../components/home/Banner";


export default function Home() {
  return (
    <div className="homePage">
      <div className="top-container">
        <svg
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

        <img src={Logo} alt="Home Logo" className="home-logo" />
        <h1>빌려온 사주</h1>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="90"
          height="83"
          viewBox="0 0 90 83"
          fill="none"
        >
          <path
            d="M45.0001 50C54.2084 50 61.6667 42.5416 61.6667 33.3333C61.6667 24.125 54.2084 16.6666 45.0001 16.6666C35.7917 16.6666 28.3334 24.125 28.3334 33.3333C28.3334 42.5416 35.7917 50 45.0001 50ZM45.0001 58.3333C33.8751 58.3333 11.6667 63.9166 11.6667 75V79.1666C11.6667 81.4583 13.5417 83.3333 15.8334 83.3333H74.1667C76.4584 83.3333 78.3334 81.4583 78.3334 79.1666V75C78.3334 63.9166 56.1251 58.3333 45.0001 58.3333Z"
            fill="#8F8F8F"
          />
        </svg>
      </div>
      <div className="banner-container">
        <BannerCarousel interval={5000} height={420} />
      </div>
    </div>
  );
}