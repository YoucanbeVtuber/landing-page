"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Loader2, X, ChevronLeft, CheckCircle, Mail } from "lucide-react";
import Image from "next/image";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Lang } from "@/content/copy";

// ─── copy ──────────────────────────────────────────────────────────────────────
const TEXT = {
  en: {
    headline1: "Illustration to",
    headline2: "rig-ready PSD.",
    sub: "Automated part separation so anyone can prepare for their VTuber debut, quickly and easily.",
    // idle
    dropTitle: "Drop your VTuber character illustration",
    dropClick: "or click to browse",
    dropHint: "PNG · JPG · WEBP · up to 20 MB",
    uploading: "Uploading…",
    // verify
    verifyTitle: "Hold on — ready to proceed?",
    verifyReferenceLabel: "Accepted example",
    verifyYourLabel: "Your upload",
    verifyChecks: [
      "Character facing forward",
      "Bust shot or full body",
      "High-quality anime-style illustration",
    ],
    verifyDisclaimer: "※ If conditions are not met, results may be limited or not processed.",
    verifyConfirm: "Request separation",
    verifyRetry: "Try a different image",
    // contact
    uploadSuccessHeadline: "Received.",
    uploadSuccessBody: "We'll send your layered PSD as soon as it's ready.",
    channels: {
      discord: {
        tab: "Discord",
        title: "What's your Discord username?",
        sub: "We'll send your PSD there when it's ready.",
        placeholder: "username or username#1234",
      },
      x: {
        tab: "X (Twitter)",
        title: "What's your X handle?",
        sub: "We'll DM your PSD download link when it's ready.",
        placeholder: "@handle",
      },
      email: {
        tab: "Email",
        title: "What's your email?",
        sub: "We'll send your PSD download link by email.",
        placeholder: "example@email.com",
      },
    },
    submitBtn: "Request layer separation",
    submitting: "Sending…",
    // done
    doneHeadline: "Your character is in good hands.",
    doneSub: "We'll send you a download link as soon as your layered PSD is ready.",
    another: "Submit another illustration",
    // errors
    errType: "Only PNG, JPG, or WEBP files are accepted.",
    errSize: "File must be under 20 MB.",
    errContact: "Please enter your contact.",
    errServer: "Something went wrong. Please try again.",
    previewBanner: "Preview mode — submissions won't be saved.",
    // video
    videoLabel: "See how it works",
    removeLabel: "Remove",
  },
  kr: {
    headline1: "일러스트를",
    headline2: "리깅용 PSD로.",
    sub: "자동 파츠 분리로 누구나 쉽고 빠르게 버튜버 데뷔를 준비할 수 있습니다.",
    // idle
    dropTitle: "버츄얼 캐릭터 일러스트를 올려주세요",
    dropClick: "또는 클릭하여 파일 선택",
    dropHint: "PNG · JPG · WEBP · 최대 20 MB",
    uploading: "업로드 중…",
    // verify
    verifyTitle: "잠깐! 이대로 진행할까요?",
    verifyReferenceLabel: "처리 가능한 예시",
    verifyYourLabel: "업로드한 이미지",
    verifyChecks: [
      "정면을 바라보는 캐릭터",
      "상반신, 혹은 전신",
      "고화질 버츄얼 일러스트",
    ],
    verifyDisclaimer: "※ 조건을 만족하지 않는 경우, 결과가 제한되거나 처리되지 않을 수 있습니다.",
    verifyConfirm: "분리 신청하기",
    verifyRetry: "다른 이미지로 다시 시도하기",
    // contact
    uploadSuccessHeadline: "접수됐습니다.",
    uploadSuccessBody: "완성되는 즉시 리깅 가능한 PSD 링크를 보내드립니다.",
    channels: {
      discord: {
        tab: "Discord",
        title: "디스코드 아이디를 알려주세요.",
        sub: "작업이 완료되면 디스코드로 바로 전달해드립니다.",
        placeholder: "username 또는 username#1234",
      },
      x: {
        tab: "X (Twitter)",
        title: "X 핸들을 알려주세요.",
        sub: "완성된 PSD 다운로드 링크를 X DM으로 보내드립니다.",
        placeholder: "@handle",
      },
      email: {
        tab: "Email",
        title: "이메일을 알려주세요.",
        sub: "완성된 PSD 다운로드 링크를 이메일로 보내드립니다.",
        placeholder: "example@email.com",
      },
    },
    submitBtn: "레이어 분리 신청하기",
    submitting: "전송 중…",
    // done
    doneHeadline: "소중한 캐릭터, 잘 받았습니다.",
    doneSub: "완성되는 즉시 레이어 PSD 다운로드 링크를 보내드립니다.",
    another: "다른 일러스트 요청하기",
    // errors
    errType: "PNG, JPG, WEBP 파일만 허용됩니다.",
    errSize: "파일 크기는 20 MB 이하여야 합니다.",
    errContact: "연락처를 입력해주세요.",
    errServer: "오류가 발생했습니다. 다시 시도해주세요.",
    previewBanner: "미리보기 모드 — Supabase 미설정으로 제출 내용이 저장되지 않습니다.",
    // video
    videoLabel: "작동 방식 미리보기",
    removeLabel: "제거",
  },
  jp: {
    headline1: "イラストを",
    headline2: "リギング用PSDへ。",
    sub: "自動パーツ分離で、誰でも簡単・スピーディにVTuberデビューの準備ができます。",
    // idle
    dropTitle: "バーチャルキャラクターのイラストをドロップ",
    dropClick: "またはクリックして選択",
    dropHint: "PNG · JPG · WEBP · 20 MB まで",
    uploading: "アップロード中…",
    // verify
    verifyTitle: "確認！このまま進めますか？",
    verifyReferenceLabel: "処理可能な例",
    verifyYourLabel: "アップロードした画像",
    verifyChecks: [
      "正面を向いているキャラクター",
      "上半身、または全身",
      "アニメスタイルの高品質イラスト",
    ],
    verifyDisclaimer: "※ 条件を満たさない場合、結果が制限されるか処理されない場合があります。",
    verifyConfirm: "分割を依頼する",
    verifyRetry: "別の画像で再試行",
    // contact
    uploadSuccessHeadline: "受け取りました。",
    uploadSuccessBody: "完成次第、リギングできるPSDのリンクをお送りします。",
    channels: {
      discord: {
        tab: "Discord",
        title: "DiscordのIDを教えてください。",
        sub: "完成したPSDをDiscordでお届けします。",
        placeholder: "username または username#1234",
      },
      x: {
        tab: "X (Twitter)",
        title: "XのハンドルIDを教えてください。",
        sub: "完成したPSDのリンクをX DMでお送りします。",
        placeholder: "@handle",
      },
      email: {
        tab: "Email",
        title: "メールアドレスを教えてください。",
        sub: "完成したPSDのダウンロードリンクをメールでお送りします。",
        placeholder: "example@email.com",
      },
    },
    submitBtn: "レイヤー分割を依頼する",
    submitting: "送信中…",
    // done
    doneHeadline: "大切なキャラクター、確かに受け取りました。",
    doneSub: "完成次第、レイヤーPSDのダウンロードリンクをお送りします。",
    another: "別のイラストを送る",
    // errors
    errType: "PNG、JPG、WEBP のみ対応しています。",
    errSize: "ファイルサイズは 20 MB 以下にしてください。",
    errContact: "連絡先を入力してください。",
    errServer: "エラーが発生しました。もう一度お試しください。",
    previewBanner: "プレビューモード — Supabase 未設定のため送信内容は保存されません。",
    // video
    videoLabel: "動作イメージ",
    removeLabel: "削除",
  },
} as const;

// ─── types ─────────────────────────────────────────────────────────────────────
type Step = "idle" | "verify" | "contact" | "done";
type ContactType = "discord" | "x" | "email";
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 20 * 1024 * 1024;

// ease
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── component ─────────────────────────────────────────────────────────────────
export default function HeroUploadSection({ lang = "en" }: { lang?: Lang }) {
  const t = TEXT[lang] ?? TEXT.en;
  const shouldReduceMotion = useReducedMotion() ?? false;
  const dur = (ms: number) => (shouldReduceMotion ? 0 : ms);

  const [step, setStep] = useState<Step>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState("");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<ContactType>("discord");
  const [contactErr, setContactErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // ── file handling ─────────────────────────────────────────────────────────
  const processFile = useCallback(
    async (f: File) => {
      setUploadErr("");
      if (!ACCEPTED.includes(f.type)) { setUploadErr(t.errType); return; }
      if (f.size > MAX_BYTES) { setUploadErr(t.errSize); return; }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setIsUploading(true);
      await new Promise((r) => setTimeout(r, 700));
      setIsUploading(false);
      setStep("verify");
    },
    [t]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview(null); setStep("idle"); setUploadErr("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactErr("");
    const trimmed = contact.trim();
    if (!trimmed) { setContactErr(t.errContact); return; }
    if (contactType === "email" && !trimmed.includes("@")) { setContactErr(t.errContact); return; }
    setIsSubmitting(true);
    try {
      if (isSupabaseConfigured && supabase && file) {
        const ext = file.name.split(".").pop() ?? "png";
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: stErr } = await supabase.storage
          .from("uploads")
          .upload(name, file, { contentType: file.type });
        if (stErr) throw stErr;
        const { error: dbErr } = await supabase
          .from("upload_requests")
          .insert({ contact: `${contactType}:${trimmed}`, image_path: name, status: "pending" });
        if (dbErr) throw dbErr;
      }
      setStep("done");
    } catch {
      setContactErr(t.errServer);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => { clearFile(); setContact(""); setContactType("discord"); setContactErr(""); };

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-[#f7f8fc] px-5 pb-28 pt-28 sm:pt-36"
      style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
    >
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-200/40 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute right-[6%] top-[15%] hidden h-56 w-56 rounded-full bg-sky-200/30 blur-[100px] sm:block" />
      <div aria-hidden className="pointer-events-none absolute left-[6%] bottom-[10%] hidden h-72 w-72 rounded-full bg-[oklch(52%_0.19_315)]/8 blur-[120px] sm:block" />

      <div className="relative z-10 mx-auto max-w-3xl">

        {/* ════ HEADLINE ════ */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.65), ease: EASE }}
        >
          <h1
            className="text-5xl font-[900] leading-[1.08] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-gloock), var(--font-noto-serif-kr), Georgia, serif" }}
          >
            {t.headline1}
            <br />
            {t.headline2}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg font-medium leading-relaxed text-slate-500">
            {t.sub}
          </p>
        </motion.div>

        {/* ════ UPLOAD WIDGET ════ */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur(0.65), delay: dur(0.12), ease: EASE }}
        >
          {!isSupabaseConfigured && step !== "done" && (
            <div className="mb-4 rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
              {t.previewBanner}
            </div>
          )}

          <AnimatePresence mode="wait">

            {/* ── IDLE: dropzone ── */}
            {step === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98, transition: { duration: dur(0.18) } }}
                transition={{ duration: dur(0.22) }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleChange}
                />
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={t.dropTitle}
                  onClick={() => !isUploading && inputRef.current?.click()}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !isUploading && inputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`
                    relative flex cursor-pointer flex-col items-center justify-center
                    rounded-[28px] px-8 py-16 transition-all duration-200
                    focus:outline-none focus-visible:ring-4 focus-visible:ring-[oklch(52%_0.19_315)]/20
                    ${isDragging
                      ? "border-2 border-dashed border-[oklch(52%_0.19_315)] bg-[oklch(96%_0.04_315)] shadow-[0_0_0_8px_oklch(52%_0.19_315_/_0.07)]"
                      : "border-2 border-dashed border-slate-200 bg-white hover:border-[oklch(62%_0.19_315)] hover:bg-[oklch(96%_0.04_315)]/40 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.06)]"
                    }
                  `}
                >
                  <motion.div
                    className="mb-5 text-[oklch(52%_0.19_315)]"
                    animate={{ y: isDragging && !shouldReduceMotion ? -8 : 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  >
                    <LayersIcon className="h-14 w-14" />
                  </motion.div>
                  <p className="text-xl font-bold text-slate-800 sm:text-2xl">{t.dropTitle}</p>
                  <p className="mt-2 text-sm text-slate-400">{t.dropClick}</p>
                  <span className="mt-5 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-400">
                    {t.dropHint}
                  </span>

                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[26px] bg-white/90 backdrop-blur-sm"
                    >
                      <Loader2 size={36} className="animate-spin text-[oklch(52%_0.19_315)]" />
                      <span className="text-sm font-semibold text-slate-600">{t.uploading}</span>
                    </motion.div>
                  )}
                </div>

                {uploadErr && (
                  <motion.p
                    className="mt-3 text-center text-sm text-red-500"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {uploadErr}
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* ── VERIFY: upload-first, verify-later ── */}
            {step === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10, transition: { duration: dur(0.2) } }}
                transition={{ duration: dur(0.3), ease: EASE }}
              >
                <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_20px_60px_-16px_rgba(15,23,42,0.10)]">

                  {/* ── header ── */}
                  <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
                    <p className="text-lg font-black text-slate-900">{t.verifyTitle}</p>
                  </div>

                  {/* ── comparison grid ──
                      Left (narrower): reference "ideal" image — anchor for comparison
                      Right (wider): uploaded image + checklist — user self-evaluates  */}
                  <div className="grid grid-cols-[2fr_3fr] gap-0">

                    {/* Reference column */}
                    <div className="border-r border-slate-100 bg-[#f7f8fc] p-3 sm:p-5">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        {t.verifyReferenceLabel}
                      </p>
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
                        <Image
                          src="/hero/assets/cropped.png"
                          alt="Reference illustration"
                          fill
                          className="object-contain p-3"
                          sizes="(min-width: 768px) 280px, 40vw"
                        />
                        <span className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white">
                          ✓
                        </span>
                      </div>
                    </div>

                    {/* Upload column — image only */}
                    <div className="p-3 sm:p-5">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {t.verifyYourLabel}
                      </p>
                      {preview && (
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={preview}
                            alt="Your upload"
                            className="h-full w-full object-contain p-2"
                          />
                          <button
                            type="button"
                            onClick={clearFile}
                            aria-label={t.removeLabel}
                            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-400 backdrop-blur-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-400 sm:h-7 sm:w-7"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Criteria — below images, full-width scan ── */}
                  <div className="border-t border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
                    <ul className="flex flex-col gap-2.5">
                      {t.verifyChecks.map((item) => (
                        <li key={item} className="flex items-center gap-2.5">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-black text-emerald-600">✓</span>
                          <span className="text-[13px] font-medium text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ── CTAs ── */}
                  <div className="px-4 pb-5 pt-3 sm:px-6 sm:pt-4">
                    <motion.button
                      type="button"
                      onClick={() => setStep("contact")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1025] py-4 text-base font-black text-white shadow-lg transition-all hover:bg-[#261535]"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.015 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.985 }}
                    >
                      {t.verifyConfirm}
                      <ArrowRight size={16} className="text-[oklch(62%_0.19_315)]" />
                    </motion.button>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="mt-4 flex min-h-[44px] w-full items-center justify-center gap-1 text-sm font-medium text-slate-400 transition-opacity hover:opacity-70"
                    >
                      <ChevronLeft size={14} />
                      {t.verifyRetry}
                    </button>
                    <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-300">
                      {t.verifyDisclaimer}
                    </p>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ── CONTACT ── */}
            {step === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: dur(0.28), ease: EASE }}
              >
                <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_20px_60px_-16px_rgba(15,23,42,0.1)]">

                  {preview && (
                    <div className="flex items-center gap-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-emerald-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <motion.p
                          className="flex items-center gap-1.5 text-base font-black text-emerald-600"
                          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: dur(0.05) }}
                        >
                          <CheckCircle size={15} className="shrink-0" />
                          {t.uploadSuccessHeadline}
                        </motion.p>
                        <motion.p
                          className="mt-0.5 text-sm text-slate-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: dur(0.18) }}
                        >
                          {t.uploadSuccessBody}
                        </motion.p>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        aria-label={t.removeLabel}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 sm:h-8 sm:w-8"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="px-6 py-7">

                    {/* ── Channel tabs ── */}
                    <div className="mb-5 flex gap-1 rounded-xl bg-slate-100 p-1">
                      {(["discord", "x", "email"] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => { setContactType(ch); setContact(""); setContactErr(""); }}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[11px] font-bold transition-all ${
                            contactType === ch
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {ch === "discord" && <DiscordIcon className="h-3 w-3 shrink-0" />}
                          {ch === "x" && <XIcon className="h-3 w-3 shrink-0" />}
                          {ch === "email" && <Mail size={11} className="shrink-0" />}
                          <span>{t.channels[ch].tab}</span>
                        </button>
                      ))}
                    </div>

                    {/* ── Title + sub ── */}
                    <p className="text-base font-bold text-slate-900">
                      {t.channels[contactType].title}
                    </p>
                    <p className="mb-4 mt-0.5 text-sm text-slate-400">
                      {t.channels[contactType].sub}
                    </p>

                    {/* ── Input with channel icon ── */}
                    <div className="relative">
                      <div
                        className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded ${
                          contactType === "discord"
                            ? "bg-[#5865F2]"
                            : contactType === "x"
                            ? "bg-slate-900"
                            : "bg-[oklch(52%_0.19_315)]"
                        }`}
                      >
                        {contactType === "discord" && <DiscordIcon className="h-3.5 w-3.5 text-white" />}
                        {contactType === "x" && <XIcon className="h-3.5 w-3.5 text-white" />}
                        {contactType === "email" && <Mail size={13} className="text-white" />}
                      </div>
                      <input
                        key={contactType}
                        type={contactType === "email" ? "email" : "text"}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={t.channels[contactType].placeholder}
                        autoFocus
                        className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-base text-gray-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${
                          contactType === "discord"
                            ? "focus:border-[#5865F2] focus:ring-[#5865F2]/10"
                            : contactType === "x"
                            ? "focus:border-slate-700 focus:ring-slate-700/10"
                            : "focus:border-[oklch(52%_0.19_315)] focus:ring-[oklch(52%_0.19_315)]/10"
                        }`}
                      />
                    </div>

                    {contactErr && (
                      <motion.p
                        className="mt-2 text-sm text-red-500"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {contactErr}
                      </motion.p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a1025] py-4 text-base font-black text-white shadow-lg transition-all hover:bg-[#261535] disabled:cursor-not-allowed disabled:opacity-50"
                      whileHover={!isSubmitting && !shouldReduceMotion ? { scale: 1.015 } : {}}
                      whileTap={!isSubmitting && !shouldReduceMotion ? { scale: 0.985 } : {}}
                    >
                      {isSubmitting ? (
                        <><Loader2 size={16} className="animate-spin" />{t.submitting}</>
                      ) : (
                        <>{t.submitBtn}<ArrowRight size={16} className="text-[oklch(72%_0.14_315)]" /></>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── DONE ── */}
            {step === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: dur(0.32), ease: EASE }}
              >
                <div className="rounded-[28px] border border-slate-100 bg-white px-8 py-12 text-center shadow-[0_20px_60px_-16px_rgba(15,23,42,0.08)]">
                  {/* icon + particle burst */}
                  <div className="relative mx-auto mb-6 h-16 w-16">
                    {/* radial particles */}
                    {!shouldReduceMotion && ([0, 45, 90, 135, 180, 225, 270, 315] as const).map((deg, i) => {
                      const rad = (deg * Math.PI) / 180;
                      const tx = Math.round(Math.cos(rad) * 32);
                      const ty = Math.round(Math.sin(rad) * 32);
                      return (
                        <motion.span
                          key={deg}
                          className="pointer-events-none absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full"
                          style={{ background: i % 2 === 0 ? "oklch(52% 0.19 315)" : "oklch(72% 0.14 75)" }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{ x: tx, y: ty, opacity: 0, scale: 0.2 }}
                          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.3, 1], delay: 0.18 }}
                        />
                      );
                    })}
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(96%_0.04_315)] text-[oklch(52%_0.19_315)]"
                      initial={{ scale: shouldReduceMotion ? 1 : 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.08, type: "spring", stiffness: 300, damping: 18 }}
                    >
                      <Sparkles size={28} />
                    </motion.div>
                  </div>
                  <motion.p
                    className="text-2xl font-bold text-slate-900"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: dur(0.3), delay: dur(0.22), ease: EASE }}
                  >
                    {t.doneHeadline}
                  </motion.p>
                  <motion.p
                    className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: dur(0.3), delay: dur(0.34), ease: EASE }}
                  >
                    {t.doneSub}
                  </motion.p>
                  {preview && (
                    <motion.div
                      className="mx-auto mt-6 h-24 w-24 overflow-hidden rounded-2xl"
                      style={{ boxShadow: "0 0 0 3px oklch(52% 0.19 315 / 0.15), 0 8px 24px -4px oklch(52% 0.19 315 / 0.18)" }}
                      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.38, type: "spring", stiffness: 240, damping: 20 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="" className="h-full w-full object-cover" />
                    </motion.div>
                  )}
                  <motion.button
                    type="button"
                    onClick={reset}
                    className="mt-8 text-sm font-semibold text-slate-400 underline underline-offset-4 transition-opacity hover:opacity-70"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: dur(0.25), delay: dur(0.5) }}
                  >
                    {t.another}
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        {/* ════ VIDEO (idle only) ════ */}
        <AnimatePresence>
          {step === "idle" && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              transition={{ duration: dur(0.4), delay: dur(0.28), ease: EASE }}
              className="mt-8"
            >
              <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                {t.videoLabel}
              </p>
              <div className="overflow-hidden rounded-[24px] shadow-[0_12px_48px_-12px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80">
                <video
                  src="/landing-hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full bg-slate-100"
                  style={{ aspectRatio: "16/9" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

// ─── discord icon ──────────────────────────────────────────────────────────────
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

// ─── x icon ────────────────────────────────────────────────────────────────────
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// ─── layers icon ───────────────────────────────────────────────────────────────
function LayersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="4" y="28" width="36" height="14" rx="4" fill="currentColor" opacity="0.12" />
      <rect x="4" y="18" width="36" height="14" rx="4" fill="currentColor" opacity="0.25" />
      <rect x="4" y="8" width="36" height="14" rx="4" fill="currentColor" opacity="0.55"
        stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <path d="M30 16 L30 10 M30 10 L34 14 M30 10 L26 14"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}
