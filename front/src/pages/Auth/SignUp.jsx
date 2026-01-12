import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";

export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // 유효성 검증
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    // 데이터를 localStorage에 임시 저장
    localStorage.setItem("signup_email", email);
    localStorage.setItem("signup_password", password);

    // 정보 입력 페이지로 이동
    navigate("/information", {
      state: {
        isSignup: true,
        email: email,
      },
    });
  };

  return (
    <AuthLayout>
      <AuthFrame>
        <AuthTitle>SIGN UP</AuthTitle>

        <form className="authForm" onSubmit={handleSubmit}>
          <div className="errorMessage">
            {error && (
              <div
                style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}
              >
                {error}
              </div>
            )}
          </div>
          <AuthInput
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <AuthInput
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />

          <AuthButton type="submit">다음으로</AuthButton>
        </form>

        <AuthFooter
          text="이미 계정이 있으신가요?"
          linkText="로그인하기"
          to="/login"
        />
      </AuthFrame>
    </AuthLayout>
  );
}
