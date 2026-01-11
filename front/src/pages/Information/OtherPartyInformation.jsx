import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import "./OtherPartyInformation.css";
import Goback from "../../components/goback";
import Loading from "../../components/loading/Loading";
import LoadingSuccess from "../../components/loading/LoadingSuccess";
import { calculateCompatibility, saveUserInfo, registerTempUser, getCurrentUserId, getFortuneInfo } from "../../utils/api";

export default function OtherPartyInformation() {
  const navigate = useNavigate();
  const location = useLocation();

  const myInfo = location?.state?.myInfo || null;
  const [myFortuneInfo, setMyFortuneInfo] = useState(null);

  // 저장된 내 정보 가져오기 (myInfo가 null인 경우)
  useEffect(() => {
    if (myInfo === null) {
      const fetchMyInfo = async () => {
        try {
          const fortuneInfo = await getFortuneInfo();
          setMyFortuneInfo(fortuneInfo);
        } catch (err) {
          console.error("내 정보 조회 실패:", err);
          // 정보가 없으면 정보 입력 페이지로 리다이렉트
          navigate("/information", { state: { type: 3 } });
        }
      };
      fetchMyInfo();
    }
  }, [myInfo, navigate]);

  // 로딩 오버레이 (궁합 계산)
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const loadingTitle = "두 분의 궁합을 계산하고 있어요";
  const loadingDesc = "사주 정보를 분석 중입니다";

  const successTitle = "궁합 결과가 준비됐어요!";
  const successDesc = "결과를 확인해 주세요";
  const successActionText = "홈으로 →";

  // TODO: 실제 로그인 유저명으로 교체 input 기본값도 실제 로그인 유저명으로

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

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsSuccessOpen(false);
    setIsLoading(true);

    try {
      // 상대방 정보 파싱
      const [birthYear, birthMonth, birthDay] = form.birthDate.split("-").map(Number);
      const [birthHour, birthMinute] = form.birthTime.split(":").map(Number);
      const gender = form.gender === "male" ? "M" : "F";

      // 임시 사용자 이메일 생성 (타임스탬프 기반으로 고유성 보장)
      const tempEmail = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@temp.com`;

      // 상대방 정보로 임시 사용자 등록 (사주 정보도 함께 생성됨)
      const tempUserData = {
        email: tempEmail,
        password: "temp123456", // 임시 비밀번호
        name: form.userName || "상대방",
        gender: gender,
        birth_year: birthYear,
        birth_month: birthMonth,
        birth_day: birthDay,
        birth_hour: birthHour,
        birth_minute: birthMinute,
        birth_place: form.birthCity || "서울",
        is_lunar: form.calendar === "lunar",
      };

      console.log("임시 사용자 등록 중...", tempUserData);
      const tempUserResponse = await registerTempUser(tempUserData);
      
      // 임시 사용자의 ID 가져오기
      const tempUserId = tempUserResponse.user?.id || tempUserResponse.id;
      
      if (!tempUserId) {
        throw new Error("임시 사용자 등록에 실패했습니다.");
      }

      console.log("임시 사용자 ID:", tempUserId);

      // 궁합 계산 API 호출
      console.log("궁합 계산 중...");
      const compatibilityResult = await calculateCompatibility(tempUserId);
      
      console.log("궁합 결과:", compatibilityResult);

      // 내 정보 준비 (myInfo가 있으면 그것을, 없으면 저장된 정보 사용)
      let finalMyInfo = myInfo;
      if (!finalMyInfo && myFortuneInfo) {
        // 저장된 정보를 myInfo 형식으로 변환
        finalMyInfo = {
          userName: localStorage.getItem("name") || "나",
          gender: myFortuneInfo.user?.gender === "M" ? "male" : "female",
          calendar: myFortuneInfo.is_lunar ? "lunar" : "solar",
          birthDate: `${myFortuneInfo.birth_year}-${String(myFortuneInfo.birth_month).padStart(2, "0")}-${String(myFortuneInfo.birth_day).padStart(2, "0")}`,
          birthTime: `${String(myFortuneInfo.birth_hour || 0).padStart(2, "0")}:${String(myFortuneInfo.birth_minute || 0).padStart(2, "0")}`,
          birthCity: myFortuneInfo.birth_place || "",
        };
      }

      // 궁합 결과 페이지로 이동
      navigate("/result", {
        state: {
          compatibility: compatibilityResult,
          myInfo: finalMyInfo,
          otherInfo: {
            userName: form.userName || "상대방",
            gender: form.gender,
            calendar: form.calendar,
            birthDate: form.birthDate,
            birthTime: form.birthTime,
            birthCity: form.birthCity,
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "궁합 계산 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Goback />
      <AuthFrame>
        <h1 className="infoTitle">상대방의 정보를 입력해주세요!</h1>

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

      {/* ✅ 상대방 정보까지 입력 완료 후 궁합 계산 로딩 */}
      <Loading open={isLoading} title={loadingTitle} desc={loadingDesc} />
      {/* Success 오버레이는 navigate로 이동하므로 여기서는 사용하지 않음 */}
    </AuthLayout>
  );
}
