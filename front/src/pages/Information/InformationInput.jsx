import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import "./InformationInput.css";
import Goback from "../../components/goback";
import Loading from "../../components/loading/Loading";
import LoadingSuccess from "../../components/loading/LoadingSuccess";
import {
  saveUserInfo,
  findSimilarFriends,
  getSimilarUserMatches,
  register,
  getFortuneInfo,
} from "../../utils/api";

export default function InformationInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 회원가입 플로우인지 확인
  const isSignup = location?.state?.isSignup || false;
  const signupEmail =
    location?.state?.email || localStorage.getItem("signup_email") || "";
  const signupPassword = localStorage.getItem("signup_password") || "";

  // Banner.jsx에서 넘겨준 타입(1|2|3) 받기
  // 1) navigate(path, { state: { type: 1 } })
  // 2) path?type=1 (쿼리스트링)
  const bannerTypeRaw =
    location?.state?.type ??
    location?.state?.bannerType ??
    searchParams.get("type");
  const bannerType = Number(bannerTypeRaw) || 0;

  const saveBtnText = isSignup
    ? "회원가입 완료하기"
    : bannerType === 1
    ? "유사 사주 친구 찾기"
    : bannerType === 2
    ? "미래 배우자 보러가기"
    : bannerType === 3
    ? "다음으로"
    : "회원가입 완료하기";

  // 로딩 오버레이
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const loadingTitle =
    bannerType === 1
      ? "유사 사주 친구를 찾는 중…"
      : bannerType === 2
      ? "미래 배우자를 그리는 중…"
      : bannerType === 3
      ? "다음 단계로 이동 중…"
      : "저장 중…";

  const loadingDesc =
    bannerType === 1
      ? "데이터를 분석하고 있어요"
      : bannerType === 2
      ? "AI가 분석 중입니다"
      : bannerType === 3
      ? "입력 정보를 확인하고 있어요"
      : "잠시만 기다려 주세요";

  const successTitle =
    bannerType === 1
      ? "유사 사주 친구를 찾았어요!"
      : bannerType === 2
      ? "미래 배우자는 누구일까요?"
      : bannerType === 3
      ? "다음 단계로 이동할게요"
      : "저장이 완료됐어요";

  const successDesc =
    bannerType === 1
      ? "매칭 결과를 준비했어요"
      : bannerType === 2
      ? "이미지 생성 완료"
      : bannerType === 3
      ? "화면을 이동합니다"
      : "완료되었습니다";

  const successActionText =
    bannerType === 1
      ? "유사 사주 친구 보러가기 →"
      : bannerType === 2
      ? "미래 배우자 보러가기 →"
      : bannerType === 3
      ? "다음으로 →"
      : "홈으로 →";

  const successActionTo =
    bannerType === 1
      ? "/similar-friend"
      : bannerType === 2
      ? "/future-partner"
      : bannerType === 3
      ? undefined // 다음 단계로 이동은 onSubmit에서 처리
      : "/home";

  // 회원가입 플로우가 아니면 localStorage에서 가져오기
  const name = isSignup ? "" : localStorage.getItem("name") || "";

  const [form, setForm] = useState({
    userName: name,
    gender: "male", // male | female
    calendar: "solar", // solar | lunar
    birthDate: "1991-01-20",
    birthTime: "01:00",
    birthCity: "",
  });

  // 저장된 사주 정보 확인 및 자동 리다이렉트
  useEffect(() => {
    // 회원가입 플로우가 아니고, bannerType이 있는 경우에만 확인
    if (isSignup || !bannerType) return;

    const checkExistingInfo = async () => {
      try {
        const fortuneInfo = await getFortuneInfo();

        // 저장된 정보가 있는 경우
        if (fortuneInfo && fortuneInfo.birth_year) {
          if (bannerType === 3) {
            // 궁합 점수 보기: 내 정보가 있으면 바로 상대방 정보 입력으로 이동
            navigate("/other-party-information", {
              state: {
                type: bannerType,
                myInfo: null, // 저장된 정보 사용
              },
            });
          } else if (bannerType === 1) {
            // 유사 사주 친구 찾기: 바로 결과로 이동
            navigate("/similar-friend");
          } else if (bannerType === 2) {
            // 미래 배우자: 바로 결과로 이동
            navigate("/future-partner");
          }
        }
      } catch (err) {
        // 정보가 없거나 에러인 경우 (404 등) - 정보 입력 화면에 머물기
        console.log("저장된 사주 정보 없음, 정보 입력 진행");
      }
    };

    checkExistingInfo();
  }, [bannerType, isSignup, navigate]);

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

    // 회원가입 플로우인 경우: 모든 정보를 회원가입 API로 전송
    if (isSignup) {
      setIsLoading(true);
      setIsSuccessOpen(false);

      try {
        // 생년월일 파싱 (YYYY-MM-DD 형식)
        const [birthYear, birthMonth, birthDay] = form.birthDate
          .split("-")
          .map(Number);
        const [birthHour, birthMinute] = form.birthTime.split(":").map(Number);

        // 회원가입 API 호출 (모든 정보 포함)
        const response = await register({
          email: signupEmail,
          password: signupPassword,
          name: form.userName,
          gender: form.gender === "male" ? "M" : "F",
          birth_year: birthYear,
          birth_month: birthMonth,
          birth_day: birthDay,
          birth_hour: birthHour,
          birth_minute: birthMinute,
          is_lunar: form.calendar === "lunar",
          birth_place: form.birthCity || "",
        });

        console.log("회원가입 성공:", response);

        // 회원가입 완료 후 localStorage 정리
        localStorage.removeItem("signup_email");
        localStorage.removeItem("signup_password");

        // 토큰 저장
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
        if (response.user?.name) {
          localStorage.setItem("name", response.user.name);
        }
        if (response.user?.email) {
          localStorage.setItem("email", response.user.email);
        } else if (signupEmail) {
          localStorage.setItem("email", signupEmail);
        }

        // 회원가입 완료 후 홈으로 이동
        navigate("/home");
      } catch (err) {
        console.error("회원가입 오류:", err);
        alert(err.message || "회원가입에 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 기존 플로우: 로그인된 사용자의 사주 정보 저장
    // ✅ 궁합(타입 3)은 상대방 정보만 입력하도록 변경
    // 내 정보는 저장된 정보를 사용하므로, 여기서 내 정보를 저장하고 상대방 정보 입력으로 이동
    if (bannerType === 3) {
      // 내 정보를 먼저 저장
      setIsLoading(true);
      try {
        const [birthYear, birthMonth, birthDay] = form.birthDate
          .split("-")
          .map(Number);
        const [birthHour, birthMinute] = form.birthTime.split(":").map(Number);

        const fortuneInfo = {
          birth_year: birthYear,
          birth_month: birthMonth,
          birth_day: birthDay,
          birth_hour: birthHour,
          birth_minute: birthMinute,
          unknown_time: false,
          birth_place: form.birthCity || "",
        };

        await saveUserInfo(fortuneInfo);

        // 내 정보 저장 후 상대방 정보 입력으로 이동
        navigate("/other-party-information", {
          state: {
            type: bannerType,
            myInfo: null, // 저장된 정보 사용
          },
        });
      } catch (err) {
        console.error("내 정보 저장 오류:", err);
        alert(
          err.message || "정보 저장 중 오류가 발생했습니다. 다시 시도해 주세요."
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 새 요청 시 성공 오버레이는 닫기
    setIsSuccessOpen(false);

    setIsLoading(true);
    try {
      // 생년월일 파싱 (YYYY-MM-DD 형식)
      const [birthYear, birthMonth, birthDay] = form.birthDate
        .split("-")
        .map(Number);
      const [birthHour, birthMinute] = form.birthTime.split(":").map(Number);

      // 백엔드 API 형식에 맞게 데이터 변환
      const fortuneInfo = {
        birth_year: birthYear,
        birth_month: birthMonth,
        birth_day: birthDay,
        birth_hour: birthHour,
        birth_minute: birthMinute,
        unknown_time: false,
        birth_place: form.birthCity || "",
      };

      // 사주 정보 저장
      const result = await saveUserInfo(fortuneInfo);
      console.log("API Response:", result);

      // bannerType에 따라 추가 작업 및 결과 페이지로 이동
      if (bannerType === 1) {
        // 유사 사주 친구 찾기 (이미 저장된 정보 기반)
        const similarResult = await getSimilarUserMatches();
        console.log("Similar friends:", similarResult);
        // 로딩 종료 후 성공 오버레이 표시 (결과 페이지로 이동할 준비)
        setIsSuccessOpen(true);
      } else if (bannerType === 2) {
        // 미래 배우자 이미지 생성
        // TODO: generateFutureSpouse API 호출 (필요시)
        // 로딩 종료 후 성공 오버레이 표시 (결과 페이지로 이동할 준비)
        setIsSuccessOpen(true);
      } else {
        // 기타 경우 (타입이 없거나 0인 경우)
        setIsSuccessOpen(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {!isSignup && <Goback />}
      <AuthFrame>
        <h1 className="infoTitle">
          {isSignup
            ? "정보를 입력해주세요!"
            : `${name}님의 정보를 입력해주세요!`}
        </h1>

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
            <motion.button
              type="button"
              className={`segBtn ${form.gender === "male" ? "active" : ""}`}
              onClick={() => onToggle("gender", "male")}
              animate={{
                background: form.gender === "male" ? "#fff3b0" : "#f3f3f3",
                color: form.gender === "male" ? "#333" : "#555",
              }}
              transition={{
                type: "spring",
                stiffness: 520,
                damping: 42,
                bounce: 0,
              }}
            >
              남성
            </motion.button>
            <motion.button
              type="button"
              className={`segBtn ${form.gender === "female" ? "active" : ""}`}
              onClick={() => onToggle("gender", "female")}
              animate={{
                background: form.gender === "female" ? "#fff3b0" : "#f3f3f3",
                color: form.gender === "female" ? "#333" : "#555",
              }}
              transition={{
                type: "spring",
                stiffness: 520,
                damping: 42,
                bounce: 0,
              }}
            >
              여성
            </motion.button>
          </div>

          {/* 양력/음력 + 생년월일/시간 */}
          <div className="row">
            <div
              className="segmented small"
              role="group"
              aria-label="양력/음력 선택"
            >
              <motion.button
                type="button"
                className={`segBtn ${
                  form.calendar === "solar" ? "active" : ""
                }`}
                onClick={() => onToggle("calendar", "solar")}
                animate={{
                  background: form.calendar === "solar" ? "#fff3b0" : "#f3f3f3",
                  color: form.calendar === "solar" ? "#333" : "#555",
                }}
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 42,
                  bounce: 0,
                }}
              >
                양력
              </motion.button>
              <motion.button
                type="button"
                className={`segBtn ${
                  form.calendar === "lunar" ? "active" : ""
                }`}
                onClick={() => onToggle("calendar", "lunar")}
                animate={{
                  background: form.calendar === "lunar" ? "#fff3b0" : "#f3f3f3",
                  color: form.calendar === "lunar" ? "#333" : "#555",
                }}
                transition={{
                  type: "spring",
                  stiffness: 520,
                  damping: 42,
                  bounce: 0,
                }}
              >
                음력
              </motion.button>
            </div>

            {/* 날짜 */}
            <div className="selectWrap">
              <input
                className="infoSelect"
                type="date"
                value={form.birthDate}
                onChange={onChange("birthDate")}
              />
              <span className="chev" aria-hidden="true">
                ▾
              </span>
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
              <span className="chev" aria-hidden="true">
                ▾
              </span>
            </div>
          </div>

          {/* 도시 */}
          <input
            className="infoInput"
            placeholder="태어난 도시명을 입력해주세요"
            value={form.birthCity}
            onChange={onChange("birthCity")}
          />

          <button className="saveBtn" type="submit" disabled={isLoading}>
            {saveBtnText}
          </button>
        </form>
      </AuthFrame>

      {/* ✅ 입력 화면 위에 덮이는 로딩 오버레이 */}
      <Loading open={isLoading} title={loadingTitle} desc={loadingDesc} />
      <LoadingSuccess
        open={isSuccessOpen}
        title={successTitle}
        desc={successDesc}
        actionText={successActionText}
        actionTo={successActionTo}
      />
    </AuthLayout>
  );
}
