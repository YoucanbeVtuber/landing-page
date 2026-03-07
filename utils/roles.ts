export const RESERVED_EMAIL_STORAGE_KEY = "youcanbevtuber.reservedEmail";
export const DEMO_EMAIL_STORAGE_KEY = "youcanbevtuber.demoEmail";
export const ROLE_STORAGE_KEY = "youcanbevtuber.role";
export const ROLE_DETAIL_STORAGE_KEY = "youcanbevtuber.roleDetail";

export type UserRole = "live2d_illustrator" | "rigger" | "vtuber_creator" | "other";

export const USER_ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: "live2d_illustrator", label: "Live2D 일러스트레이터" },
  { value: "rigger", label: "리거" },
  { value: "vtuber_creator", label: "버튜버 크리에이터" },
  { value: "other", label: "기타" },
];
