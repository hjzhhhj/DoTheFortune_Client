import React, { useMemo, useState } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import "./InformationInput.css";

export default function InformationInput() {
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

    alert("정보가 저장되었습니다! (콘솔 확인)");
  };

  return (
    <AuthLayout>
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
            정보 저장하기
          </button>
        </form>
      </AuthFrame>
    </AuthLayout>
  );
}