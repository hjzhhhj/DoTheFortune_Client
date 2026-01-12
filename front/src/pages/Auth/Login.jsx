import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthFrame from "../../components/auth/AuthFrame";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";
import { login } from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await login(email, pw);
      console.log("Login successful:", response);
      // 로그인 성공 시 홈으로 이동
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "로그인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthFrame>
        <AuthTitle>LOGIN</AuthTitle>

        <form className="authForm" onSubmit={onSubmit}>
          <div className="errorMessage">
            {error && (
              <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
            )}
          </div>
          <AuthInput
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={isLoading}
          />
          <AuthInput
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="current-password"
            required
            disabled={isLoading}
          />

          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </AuthButton>
        </form>

        <AuthFooter
          text="계정이 없으신가요?"
          linkText="회원가입하기"
          to="/signup"
        />
      </AuthFrame>
    </AuthLayout>
  );
}
