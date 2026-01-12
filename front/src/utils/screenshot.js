import html2canvas from 'html2canvas';

/**
 * 특정 요소를 캡처하여 이미지로 다운로드하는 함수
 * @param {HTMLElement} element - 캡처할 DOM 요소
 * @param {string} filename - 저장할 파일명 (확장자 제외)
 * @param {object} options - html2canvas 옵션
 */
export async function captureAndDownload(element, filename = 'screenshot', options = {}) {
  if (!element) {
    throw new Error('캡처할 요소를 찾을 수 없습니다.');
  }

  try {
    // 기본 옵션 설정
    const defaultOptions = {
      backgroundColor: '#fff9d7', // 배경색 (앱의 기본 배경색)
      scale: 2, // 고해상도를 위해 2배 스케일
      useCORS: true, // 외부 이미지 로드 허용
      logging: false, // 콘솔 로그 비활성화
      ...options,
    };

    // 캡처 실행
    const canvas = await html2canvas(element, defaultOptions);

    // Canvas를 Blob으로 변환
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('이미지 생성에 실패했습니다.');
      }

      // Blob URL 생성
      const url = URL.createObjectURL(blob);

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 메모리 정리
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }, 'image/png');
  } catch (error) {
    console.error('캡처 중 오류 발생:', error);
    throw error;
  }
}
