import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import "./InformationInput.css";
import Goback from "../../components/goback";
export default function InformationInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Banner.jsx에서 넘겨준 타입(1|2|3) 받기
  // 1) navigate(path, { state: { type: 1 } })
  // 2) path?type=1 (쿼리스트링)
  const bannerTypeRaw =
    location?.state?.type ?? location?.state?.bannerType ?? searchParams.get("type");
  const bannerType = Number(bannerTypeRaw) || 0;

  const saveBtnText =
    bannerType === 1
      ? "유사 사주 친구 찾기"
      : bannerType === 2
      ? "미래 배우자 보러가기"
      : bannerType === 3
      ? "다음으로"
      : "정보 저장하기";

  // TODO: 실제 로그인 유저명으로 교체 input 기본값도 실제 로그인 유저명으로
  const name = "희진";

  const [form, setForm] = useState({
    userName: "",
    gender: "male", // male | female
    calendar: "solar", // solar | lunar
    birthDate: "1991-01-20",
    birthTime: "01:00",
    birthCity: "",
  });

  const timeOptions = useMemo(() => {
    // 30분 단위 옵션 (원하면 10분 단위도 가능)
    const arr = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2, "0");
        const mm = String(m).padStart(2, "0");
        arr.push(`${hh}:${mm}`);
      }
    }
    return arr;
  }, []);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onToggle = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // TODO: 저장 로직(Supabase/서버) 연결
    console.log("SAVE:", form);

    if (bannerType === 3) {
      // 상대방 정보 입력 화면으로 이동
      navigate("/other-party-information", {
        state: {
          type: bannerType,
          myInfo: form,
        },
      });
      return;
    }

    alert("정보가 저장되었습니다! (콘솔 확인)");
  };

  return (
    <AuthLayout>
      <Goback />
      <AuthFrame>
        <h1 className="infoTitle">{name}님의 정보를 입력해주세요!</h1>

        <form className="infoForm" onSubmit={onSubmit}>
          {/* 이름 */}
          <input
            className="infoInput"
            placeholder="이름을 입력해주세요"
            value={form.userName}
            onChange={onChange("userName")}
            autoComplete="name"
          />

          {/* 성별 */}
          <div className="segmented" role="group" aria-label="성별 선택">
            <button
              type="button"
              className={`segBtn ${form.gender === "male" ? "active" : ""}`}
              onClick={() => onToggle("gender", "male")}
            >
              남성
            </button>
            <button
              type="button"
              className={`segBtn ${form.gender === "female" ? "active" : ""}`}
              onClick={() => onToggle("gender", "female")}
            >
              여성
            </button>
          </div>

          {/* 양력/음력 + 생년월일/시간 */}
          <div className="row">
            <div className="segmented small" role="group" aria-label="양력/음력 선택">
              <button
                type="button"
                className={`segBtn ${form.calendar === "solar" ? "active" : ""}`}
                onClick={() => onToggle("calendar", "solar")}
              >
                양력
              </button>
              <button
                type="button"
                className={`segBtn ${form.calendar === "lunar" ? "active" : ""}`}
                onClick={() => onToggle("calendar", "lunar")}
              >
                음력
              </button>
            </div>

            {/* 날짜 */}
            <div className="selectWrap">
              <input
                className="infoSelect"
                type="date"
                value={form.birthDate}
                onChange={onChange("birthDate")}
              />
              <span className="chev" aria-hidden="true">▾</span>
            </div>

            {/* 시간 */}
            <div className="selectWrap">
              <select
                className="infoSelect"
                value={form.birthTime}
                onChange={onChange("birthTime")}
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <span className="chev" aria-hidden="true">▾</span>
            </div>
          </div>

          {/* 도시 */}
          <input
            className="infoInput"
            placeholder="태어난 도시명을 입력해주세요"
            value={form.birthCity}
            onChange={onChange("birthCity")}
          />

          <button className="saveBtn" type="submit">
            {saveBtnText}
          </button>
        </form>
      </AuthFrame>
    </AuthLayout>
  );
}