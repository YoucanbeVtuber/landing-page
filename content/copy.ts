export type Lang = "en" | "kr";
export const DISCORD_INVITE_URL =
  process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? "https://discord.gg/your-invite-code";

export const COPY = {
  en: {
    preRegister: {
      title: "Reclaim your creative time.",
      subtitle:
        "Be the first to experience the smarter way to prepare Live2D models. Join the waiting list for early access.",
      ctaButton: "Join the Limited Beta",
      note: "* Launch updates only. Unsubscribe anytime.",
      footerLine: "Live2D preparation automation · Closed Beta",
      cancel: "Cancel",
      closeModal: "Close modal",
      form: {
        emailPlaceholder: "example@email.com",
        submit: "Join waitlist",
        loading: "Submitting...",
        rolePrompt: "What best describes your role?",
        otherPlaceholder: "Tell us more",
        roleRequired: "Please select your role",
        otherRequired: "Please describe your role",
        previewMode:
          "Preview mode is active. Submissions are not saved, but you can test the success flow.",
        privacy: {
          linkText: "Privacy Policy",
          implicitConsent:
            'By clicking "Join waitlist", you agree to the Privacy Policy.',
          title: "Consent to Collection and Use of Personal Information",
          purpose: "Purpose: to confirm waitlist registration and send launch updates",
          items: "Collected item: email address",
          retention:
            "Retention period: up to 1 year after launch notice or until consent is withdrawn",
          rights:
            "You may refuse consent, but waitlist registration may be limited if you do so.",
        },
        validation: {
          emailRequired: "Please enter your email",
          emailInvalid: "Please enter a valid email address",
          privacyRequired: "Privacy consent is required",
        },
        success: "You're on the waitlist. We'll reach out soon.",
        error: "Something went wrong. Please try again.",
      },
      discord: {
        title: "Registration Received!",
        subtitle: "",
        body:
          "Ready to split your character? Post your art in ✂️-split-my-avatar on Discord. We split it for you! Watch the process and join the first LivingCel builder group.",
        button: "Split My Art on Discord",
        imageAlt: "LivingCel community invite artwork",
        previewNote: "Set NEXT_PUBLIC_DISCORD_INVITE_URL to replace the placeholder invite link.",
      },
    },
  },
  kr: {
    preRegister: {
      title: "당신의 시간을 되찾으세요.",
      subtitle:
        "Live2D 모델을 준비하는 더 스마트한 방법을 가장 먼저 경험해보세요. 얼리 액세스를 위한 대기 리스트에 등록하세요.",
      ctaButton: "한정 베타 참여하기",
      note: "* 스팸 없이 출시 소식만 전해드립니다. 언제든지 구독 취소 가능.",
      footerLine: "Live2D 파츠 분리 자동화 · Closed Beta",
      cancel: "취소",
      closeModal: "모달 닫기",
      form: {
        emailPlaceholder: "example@email.com",
        submit: "예약하기",
        loading: "처리 중...",
        rolePrompt: "어떤 역할로 활동하고 계신가요?",
        otherPlaceholder: "직접 입력해주세요",
        roleRequired: "역할을 선택해주세요",
        otherRequired: "기타 역할을 입력해주세요",
        previewMode:
          "디자인 미리보기 모드입니다. 실제 저장은 되지 않지만 성공 화면은 테스트할 수 있습니다.",
        privacy: {
          linkText: "개인정보수집",
          implicitConsent:
            '"신청하기"를 누름으로써 개인정보 취급방침에 동의하는 것으로 간주합니다.',
          title: "개인정보 수집 및 이용 동의",
          purpose: "수집 목적: 사전 예약 신청 확인 및 출시 안내 연락",
          items: "수집 항목: 이메일 주소",
          retention: "보유 기간: 서비스 출시 안내 후 최대 1년 또는 동의 철회 시까지",
          rights:
            "동의를 거부할 권리가 있으며, 거부 시 사전 예약 신청이 제한될 수 있습니다.",
        },
        validation: {
          emailRequired: "이메일을 입력해주세요",
          emailInvalid: "올바른 이메일 형식이 아닙니다",
          privacyRequired: "개인정보수집 동의가 필요합니다",
        },
        success: "사전 예약이 완료되었습니다! 곧 연락드리겠습니다.",
        error: "오류가 발생했습니다. 다시 시도해주세요.",
      },
      discord: {
        title: "신청이 접수되었습니다!",
        subtitle:
          "캐릭터 작업을 진행하려면 디스코드에 참여한 뒤 ✂️-split-my-avatar 채널에 이미지를 올려주세요. 커뮤니티 안에서 실시간으로 요청을 처리합니다.",
        body:
          "개발 중인 기능을 가장 먼저 보고, 질문을 남기고, LivingCel의 첫 공동 빌더 그룹에 참여할 수 있습니다.",
        button: "디스코드에서 내 그림 분리하기",
        imageAlt: "LivingCel 커뮤니티 초대 일러스트",
        previewNote:
          "실제 링크는 NEXT_PUBLIC_DISCORD_INVITE_URL 환경변수로 넣어두면 바로 바뀝니다.",
      },
    },
  },
} as const;
