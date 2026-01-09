import React from "react";
import "./Header.module.css"
export default function Header({
  logoSrc,
  title = "",
  onLogoClick,
  onSettingsClick,
  showSettings = true,
  className = "",
  classes = {},
}) {
  const {
    topBar = "",
    brand = "",
    logo = "",
    brandTitle = "",
    iconButton = "",
  } = classes;

  const handleLogoClick = () => {
    if (typeof onLogoClick === "function") return onLogoClick();
    window.location.href = "/home";
  };

  return (
    <header
      className={["topBar", "header__topBar", topBar, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={["brand", "header__brand", brand]
          .filter(Boolean)
          .join(" ")}
      >
        {logoSrc ? (
          <img
            className={["logo", "header__logo", logo].filter(Boolean).join(" ")}
            src={logoSrc}
            alt="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        ) : null}

        {title ? (
          <div
            className={["brandTitle", "header__title", brandTitle]
              .filter(Boolean)
              .join(" ")}
          >
            {title}
          </div>
        ) : null}
      </div>
    </header>
  );
}