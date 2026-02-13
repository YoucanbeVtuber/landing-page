// Centralized copy/text content for easy modification

export const COPY = {
  hero: {
    title: "그림 한 장으로\n파츠 분할 자동화.",
    subtitle: "업로드 한 번으로 자동 레이어 분할과 인페인팅.\n아티스트는 튜닝에만 집중하세요.",
    cta: "지금 시작하기",
  },
  
  useCase: {
    sectionTitle: "간단한 워크플로우",
    sectionSubtitle: "복잡한 수작업 없이 AI가 모든 과정을 도와드립니다",
    
    steps: [
      {
        title: "이미지 업로드",
        description: "캐릭터 일러스트를 드래그 앤 드롭하거나 파일을 선택하세요",
      },
      {
        title: "자동 분할",
        description: "AI가 얼굴, 눈, 머리카락 등을 자동으로 레이어별로 분리합니다",
      },
      {
        title: "레이어 선택",
        description: "마음에 들지 않는 레이어가 있다면 클릭하여 수정하세요",
      },
      {
        title: "수정 요청",
        description: "자연어로 원하는 변경사항을 입력합니다 (예: '앞머리만 분리해줘')",
      },
      {
        title: "재생성 확인",
        description: "AI가 요청사항을 반영하여 레이어를 다시 생성합니다",
      },
      {
        title: "PSD 내보내기",
        description: "리깅 가능한 PSD 파일을 다운로드하여 바로 사용하세요",
      },
    ],
  },
  
  preRegister: {
    title: "곧 만나요",
    subtitle: "사전 예약하시면 출시 소식을 가장 먼저 받아보실 수 있습니다",
    ctaButton: "사전 예약하기",
    
    form: {
      contactTypeLabel: "연락 방법 선택",
      email: "이메일",
      phone: "전화번호",
      emailPlaceholder: "example@email.com",
      phonePlaceholder: "010-1234-5678",
      submit: "예약하기",
      
      validation: {
        emailRequired: "이메일을 입력해주세요",
        emailInvalid: "올바른 이메일 형식이 아닙니다",
        phoneRequired: "전화번호를 입력해주세요",
        phoneInvalid: "올바른 전화번호 형식이 아닙니다 (10-11자리)",
      },
      
      success: "사전 예약이 완료되었습니다! 곧 연락드리겠습니다.",
      error: "오류가 발생했습니다. 다시 시도해주세요.",
    },
  },
} as const;
