// Centralized copy/text content for easy modification

export const COPY = {
  hero: {
    title: "그림 한 장으로\n파츠 분할 자동화.",
    subtitle: "자동 레이어 분할과 인페인팅.\n당신은 창작에만 집중하세요.",
    cta: "지금 시작하기",
  },
  
  useCase: {
    sectionTitle: "간단한 워크플로우",
    sectionSubtitle: "지루한 반복과 수작업으로부터의 해방.",
    
    steps: [
      {
        title: "이미지 업로드",
        description: "일러스트 이미지부터 파츠별로 분리된 PSD파일까지.\n 형식에 구애받지 않는 자유로운 업로드.",
      },
      {
        title: "자동 레이어 생성",
        description: "얼굴, 눈, 머리카락. 알아서 빈 곳까지 척척.\n까다로운 눈동자도 하이라이트까지 깔끔하게 분리.",
      },
      {
        title: "세부 수정",
        description: "마음에 들지 않는 부분은 말 한마디로 바로 수정.\n더 좋은 작품을 위해, 더 완벽한 결과를 위해.",
      },
      {
        title: "결과물 다운로드",
        description: "바로 리깅 가능한 PSD 파일 제공.\nLive2D 표준 레이어에 맞춘 스마트 레이어 구조.",
      },
    ],
  },
  
  preRegister: {
    title: "곧 만나요",
    subtitle: "사전 예약하시면 출시 소식을 가장 먼저 받아보실 수 있습니다",
    ctaButton: "얼리 액세스 신청",
    
    form: {
      contactTypeLabel: "연락 방법 선택",
      email: "이메일",
      phone: "전화번호",
      emailPlaceholder: "example@email.com",
      phonePlaceholder: "010-1234-5678",
      submit: "예약하기",
      privacy: {
        label: "개인정보수집 동의 (필수)",
        linkText: "개인정보수집",
        title: "개인정보 수집 및 이용 동의",
        purpose: "수집 목적: 사전 예약 신청 확인 및 출시 안내 연락",
        items: "수집 항목: 이메일 주소",
        retention: "보유 기간: 서비스 출시 안내 후 최대 1년 또는 동의 철회 시까지",
        rights: "동의를 거부할 권리가 있으며, 거부 시 사전 예약 신청이 제한될 수 있습니다.",
      },
      
      validation: {
        emailRequired: "이메일을 입력해주세요",
        emailInvalid: "올바른 이메일 형식이 아닙니다",
        phoneRequired: "전화번호를 입력해주세요",
        phoneInvalid: "올바른 전화번호 형식이 아닙니다 (10-11자리)",
        privacyRequired: "개인정보수집 동의가 필요합니다",
      },
      
      success: "사전 예약이 완료되었습니다! 곧 연락드리겠습니다.",
      error: "오류가 발생했습니다. 다시 시도해주세요.",
    },
  },
} as const;
