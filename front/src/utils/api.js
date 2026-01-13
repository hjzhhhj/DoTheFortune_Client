/**
 * Go 백엔드 API 유틸리티
 * 기본 URL: https://api.dothefortune.com (배포 환경)
 * 모든 API는 /api/v1로 시작합니다
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.dothefortune.com';
const API_VERSION = '/api/v1';

/**
 * 토큰 가져오기 (로컬 스토리지 또는 쿠키)
 */
function getToken() {
  // 로컬 스토리지에서 토큰 가져오기
  return localStorage.getItem('token') || '';
}

/**
 * 토큰 저장하기
 */
export function setToken(token) {
  localStorage.setItem('token', token);
}

/**
 * 토큰 제거하기
 */
export function removeToken() {
  localStorage.removeItem('token');
}

/**
 * 기본 fetch 래퍼 - 에러 처리 및 인증 토큰 포함
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${API_VERSION}${endpoint}`;
  
  const token = getToken();
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  console.log('API Request:', { method: options.method || 'GET', url, hasToken: !!token });

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    console.log('API Response:', { status: response.status, statusText: response.statusText, url });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      const errorMessage = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * 로그인
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 */
export async function login(email, password) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.token) {
    setToken(response.token);
  }
  
  // 사용자 정보 저장
  if (response.user) {
    if (response.user.name) {
      localStorage.setItem('name', response.user.name);
    }
    if (response.user.email) {
      localStorage.setItem('email', response.user.email);
    }
  } else {
    // user가 없으면 email을 name으로도 저장 (임시)
    localStorage.setItem('email', email);
  }
  
  return response;
}

/**
 * 회원가입
 * @param {Object} userData - 회원가입 정보
 */
export async function register(userData) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (response.token) {
    setToken(response.token);
  }
  
  return response;
}

/**
 * 로그아웃
 */
export async function logout() {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
    });
  } finally {
    removeToken();
  }
}

/**
 * 현재 사용자 정보 조회
 */
export async function getMe() {
  return apiRequest('/auth/me', {
    method: 'GET',
  });
}

/**
 * 사주 정보 등록/수정
 * @param {Object} fortuneInfo - 사주 정보
 * @param {number} fortuneInfo.birth_year - 출생 연도
 * @param {number} fortuneInfo.birth_month - 출생 월
 * @param {number} fortuneInfo.birth_day - 출생 일
 * @param {number} fortuneInfo.birth_hour - 출생 시각 (0-23, 선택)
 * @param {number} fortuneInfo.birth_minute - 출생 분 (0-59, 선택)
 * @param {boolean} fortuneInfo.unknown_time - 출생 시각을 모를 경우 true
 * @param {string} fortuneInfo.birth_place - 출생지
 */
export async function saveUserInfo(fortuneInfo) {
  return apiRequest('/fortune/info', {
    method: 'POST',
    body: JSON.stringify(fortuneInfo),
  });
}

/**
 * 궁합 계산
 * @param {number} user2Id - 상대방 사용자 ID
 */
export async function calculateCompatibility(user2Id) {
  return apiRequest(`/compatibility/calculate?user2_id=${user2Id}`, {
    method: 'GET',
  });
}

/**
 * 임시 사용자 등록 (상대방 정보로 궁합 계산용)
 * @param {Object} userData - 회원가입 정보
 */
export async function registerTempUser(userData) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  return response;
}

/**
 * 현재 사용자 ID 조회
 */
export async function getCurrentUserId() {
  const response = await apiRequest('/auth/me', {
    method: 'GET',
  });
  return response.user_id || response.id;
}

/**
 * 오늘의 운세 조회
 */
export async function getTodayFortune() {
  return apiRequest('/fortune/today', {
    method: 'GET',
  });
}

/**
 * 유사 사주 친구 찾기
 * @param {number} limit - 반환할 최대 사용자 수 (기본값: 10)
 */
export async function findSimilarFriends(limit = 10) {
  return apiRequest(`/fortune/similar?limit=${limit}`, {
    method: 'GET',
  });
}

/**
 * 유사 사주 친구 매칭 (가장 비슷한, 잘 맞는, 잘 안 맞는)
 */
export async function getSimilarUserMatches() {
  return apiRequest('/fortune/similar-matches', {
    method: 'GET',
  });
}

/**
 * 사주 정보 조회
 */
export async function getFortuneInfo() {
  return apiRequest('/fortune/info', {
    method: 'GET',
  });
}

/**
 * 최근 기록 조회
 * @param {number} limit - 반환할 최대 기록 수 (기본값: 20)
 */
export async function getRecentRecords(limit = 20) {
  return apiRequest(`/records?limit=${limit}`, {
    method: 'GET',
  });
}

/**
 * 배우자 이미지 조회
 */
export async function getSpouseImage() {
  return apiRequest('/records/spouse-image', {
    method: 'GET',
  });
}

/**
 * 기록 생성
 * @param {Object} recordData - 기록 데이터
 * @param {string} recordData.type - 기록 타입 (compatibility, ai_spouse, today_fortune 등)
 * @param {string} recordData.content - 기록 내용
 * @param {string} recordData.image_url - 이미지 URL (선택사항)
 * @param {string} recordData.metadata - 메타데이터 JSON 문자열 (선택사항)
 */
export async function createRecord(recordData) {
  // image_url이 없으면 전송하지 않음
  const requestData = {
    type: recordData.type,
    content: recordData.content,
  };
  
  if (recordData.image_url) {
    requestData.image_url = recordData.image_url;
  }
  
  if (recordData.metadata) {
    requestData.metadata = recordData.metadata;
  }

  return apiRequest('/records', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
}
