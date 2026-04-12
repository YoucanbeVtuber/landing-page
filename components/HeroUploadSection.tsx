"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, X, ChevronLeft } from "lucide-react";
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
    dropTitle: "Drop your illustration here",
    dropClick: "or click to browse",
    dropHint: "PNG · JPG · WEBP · up to 20 MB",
    uploading: "Uploading…",
    // verify
    verifyTitle: "Can we process this?",
    verifySub: "LivingCel only separates cel-shaded character art. Other file types can't be processed.",
    verifyReferenceLabel: "What we can process",
    verifyYourLabel: "Your upload",
    verifyChecks: [
      "Cel-shaded or anime-style character",
      "Transparent or plain white background",
      "Full body or bust shot",
      "Clear linework with flat colors",
    ],
    verifyWarnings: [
      "Real photographs — cannot be separated",
      "Complex backgrounds — separation fails",
    ],
    verifyConfirm: "Yes, this is the right type — request separation",
    verifyRetry: "Upload a different file",
    // contact
    uploadSuccessHeadline: "Received.",
    uploadSuccessBody: "In 24 hours, you'll have a PSD ready to rig.",
    contactTitle: "Where should we send it?",
    contactSub: "We'll reach you directly when your layers are ready.",
    contactPlaceholder: "KakaoTalk ID, email, or phone",
    submitBtn: "Request layer separation",
    submitting: "Sending…",
    // done
    doneHeadline: "You're on the list.",
    doneSub: "Within 24 hours, you'll receive a download link for your layered PSD.",
    another: "Submit another illustration",
    // errors
    errType: "Only PNG, JPG, or WEBP files are accepted.",
    errSize: "File must be under 20 MB.",
    errContact: "Please enter a contact address.",
    errServer: "Something went wrong. Please try again.",
    previewBanner: "Preview mode — submissions won't be saved.",
    // video
    videoLabel: "See how it works",
  },
  kr: {
    headline1: "일러스트를",
    headline2: "리깅용 PSD로.",
    sub: "자동 파츠 분리로 누구나 쉽고 빠르게 버튜버 데뷔를 준비할 수 있습니다.",
    // idle
    dropTitle: "일러스트를 여기 놓으세요",
    dropClick: "또는 클릭하여 파일 선택",
    dropHint: "PNG · JPG · WEBP · 최대 20 MB",
    uploading: "업로드 중…",
    // verify
    verifyTitle: "이 이미지, 처리할 수 있을까요?",
    verifySub: "LivingCel은 셀화 캐릭터 일러스트만 분리할 수 있습니다. 다른 유형은 처리가 어렵거나 불가합니다.",
    verifyReferenceLabel: "처리 가능한 이미지",
    verifyYourLabel: "업로드한 이미지",
    verifyChecks: [
      "셀화 또는 애니메이션 스타일 캐릭터",
      "투명 또는 흰 단색 배경",
      "전신 또는 상반신",
      "선명한 선화, 플랫 컬러",
    ],
    verifyWarnings: [
      "실사 사진 — 분리 불가",
      "배경 포함 이미지 — 분리 실패 가능",
    ],
    verifyConfirm: "네, 이런 이미지입니다. 분리 신청하기",
    verifyRetry: "다른 이미지로 다시 시도하기",
    // contact
    uploadSuccessHeadline: "접수됐습니다.",
    uploadSuccessBody: "24시간 내에 리깅 가능한 PSD 링크를 보내드립니다.",
    contactTitle: "결과를 어디로 보내드릴까요?",
    contactSub: "레이어가 완성되면 바로 연락드립니다.",
    contactPlaceholder: "카카오톡 ID · 이메일 · 전화번호",
    submitBtn: "레이어 분리 신청하기",
    submitting: "전송 중…",
    // done
    doneHeadline: "접수 완료.",
    doneSub: "최대 24시간 내에 레이어 PSD 다운로드 링크를 보내드립니다.",
    another: "다른 일러스트 요청하기",
    // errors
    errType: "PNG, JPG, WEBP 파일만 허용됩니다.",
    errSize: "파일 크기는 20 MB 이하여야 합니다.",
    errContact: "연락처를 입력해주세요.",
    errServer: "오류가 발생했습니다. 다시 시도해주세요.",
    previewBanner: "미리보기 모드 — Supabase 미설정으로 제출 내용이 저장되지 않습니다.",
    // video
    videoLabel: "작동 방식 미리보기",
  },
  jp: {
    headline1: "イラストを",
    headline2: "リギング用PSDへ。",
    sub: "自動パーツ分離で、誰でも簡単・スピーディにVTuberデビューの準備ができます。",
    // idle
    dropTitle: "イラストをここにドロップ",
    dropClick: "またはクリックして選択",
    dropHint: "PNG · JPG · WEBP · 20 MB まで",
    uploading: "アップロード中…",
    // verify
    verifyTitle: "この画像、処理できますか？",
    verifySub: "LivingCelはセルシェードキャラクターイラストのみ分割できます。他の形式は処理できません。",
    verifyReferenceLabel: "処理可能な画像",
    verifyYourLabel: "アップロードした画像",
    verifyChecks: [
      "セルシェードまたはアニメスタイルのキャラクター",
      "透明または白い単色背景",
      "全身または上半身",
      "クリアな線画、フラットカラー",
    ],
    verifyWarnings: [
      "実写写真 — 分割不可",
      "背景付きイラスト — 分割失敗の可能性",
    ],
    verifyConfirm: "はい、この種類です。分割を依頼する",
    verifyRetry: "別の画像で再試行",
    // contact
    uploadSuccessHeadline: "受け取りました。",
    uploadSuccessBody: "24時間以内にリギングできるPSDのリンクをお送りします。",
    contactTitle: "結果はどちらに送りますか？",
    contactSub: "レイヤーが完成したら直接ご連絡します。",
    contactPlaceholder: "連絡先（メール・電話番号など）",
    submitBtn: "レイヤー分割を依頼する",
    submitting: "送信中…",
    // done
    doneHeadline: "受付完了。",
    doneSub: "24時間以内にレイヤーPSDのダウンロードリンクをお送りします。",
    another: "別のイラストを送る",
    // errors
    errType: "PNG、JPG、WEBP のみ対応しています。",
    errSize: "ファイルサイズは 20 MB 以下にしてください。",
    errContact: "連絡先を入力してください。",
    errServer: "エラーが発生しました。もう一度お試しください。",
    previewBanner: "プレビューモード — Supabase 未設定のため送信内容は保存されません。",
    // video
    videoLabel: "動作イメージ",
  },
} as const;

// ─── types ─────────────────────────────────────────────────────────────────────
type Step = "idle" | "verify" | "contact" | "done";
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 20 * 1024 * 1024;

// ease
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── component ─────────────────────────────────────────────────────────────────
export default function HeroUploadSection({ lang = "en" }: { lang?: Lang }) {
  const t = TEXT[lang] ?? TEXT.en;

  const [step, setStep] = useState<Step>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState("");
  const [contact, setContact] = useState("");
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
    if (!contact.trim()) { setContactErr(t.errContact); return; }
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
          .insert({ contact: contact.trim(), image_path: name, status: "pending" });
        if (dbErr) throw dbErr;
      }
      setStep("done");
    } catch {
      setContactErr(t.errServer);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => { clearFile(); setContact(""); setContactErr(""); };

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-[#f7f8fc] px-5 pb-28 pt-28 sm:pt-36"
    >
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-200/40 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute right-[6%] top-[15%] h-56 w-56 rounded-full bg-sky-200/30 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute left-[6%] bottom-[10%] h-72 w-72 rounded-full bg-indigo-100/40 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-3xl">

        {/* ════ HEADLINE ════ */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
        >
          <h1 className="text-5xl font-[900] leading-[1.08] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
                transition={{ duration: 0.22 }}
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
                  onKeyDown={(e) => e.key === "Enter" && !isUploading && inputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`
                    relative flex cursor-pointer flex-col items-center justify-center
                    rounded-[28px] px-8 py-16 transition-all duration-200
                    focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/30
                    ${isDragging
                      ? "border-2 border-dashed border-indigo-400 bg-indigo-50 shadow-[0_0_0_8px_rgba(99,102,241,0.08)]"
                      : "border-2 border-dashed border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.06)]"
                    }
                  `}
                >
                  <motion.div
                    className="mb-5 text-indigo-400"
                    animate={{ y: isDragging ? -8 : 0 }}
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
                      <Loader2 size={36} className="animate-spin text-indigo-500" />
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_20px_60px_-16px_rgba(15,23,42,0.10)]">

                  {/* ── header ── */}
                  <div className="border-b border-slate-100 px-7 py-6">
                    <p className="text-lg font-black text-slate-900">{t.verifyTitle}</p>
                    <p className="mt-1 text-sm text-slate-400">{t.verifySub}</p>
                  </div>

                  {/* ── comparison grid ──
                      Left (narrower): reference "ideal" image — anchor for comparison
                      Right (wider): uploaded image + checklist — user self-evaluates  */}
                  <div className="grid grid-cols-[2fr_3fr] gap-0">

                    {/* Reference column */}
                    <div className="border-r border-slate-100 bg-[#f7f8fc] p-5">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        {t.verifyReferenceLabel}
                      </p>
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
                        <Image
                          src="/hero/assets/cropped.png"
                          alt="Reference illustration"
                          fill
                          className="object-contain p-3"
                          sizes="200px"
                        />
                        <span className="absolute right-2 top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-white">
                          ✓
                        </span>
                      </div>

                      {/* bad mini examples */}
                      <div className="mt-4 space-y-2">
                        {t.verifyWarnings.map((w) => (
                          <div key={w} className="flex items-start gap-2 rounded-xl bg-red-50/80 px-3 py-2">
                            <span className="mt-px shrink-0 text-[11px] font-black text-red-400">✕</span>
                            <p className="text-[11px] leading-snug text-slate-500">{w}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upload + checklist column */}
                    <div className="p-5">
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
                            aria-label="Remove"
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-400 backdrop-blur-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-400"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      )}

                      {/* checklist */}
                      <ul className="mt-4 space-y-1.5">
                        {t.verifyChecks.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0 text-[11px] font-black text-emerald-500">✓</span>
                            <span className="text-[12px] leading-snug text-slate-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* ── CTAs ── */}
                  <div className="px-6 pb-7 pt-5">
                    <motion.button
                      type="button"
                      onClick={() => setStep("contact")}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#111827] py-4 text-base font-black text-white shadow-lg transition-all hover:bg-slate-800"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                    >
                      {t.verifyConfirm}
                      <ArrowRight size={16} className="text-indigo-400" />
                    </motion.button>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-slate-400 transition-opacity hover:opacity-70"
                    >
                      <ChevronLeft size={14} />
                      {t.verifyRetry}
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ── CONTACT ── */}
            {step === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-[0_20px_60px_-16px_rgba(15,23,42,0.1)]">

                  {preview && (
                    <div className="flex items-center gap-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50/60 to-white px-6 py-5">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <motion.p
                          className="text-base font-black text-slate-900"
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 }}
                        >
                          {t.uploadSuccessHeadline}
                        </motion.p>
                        <motion.p
                          className="mt-0.5 text-sm text-slate-500"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.18 }}
                        >
                          {t.uploadSuccessBody}
                        </motion.p>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        aria-label="Remove"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="px-6 py-7">
                    <p className="text-base font-bold text-slate-900">{t.contactTitle}</p>
                    <p className="mb-5 mt-1 text-sm text-slate-400">{t.contactSub}</p>

                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder={t.contactPlaceholder}
                      autoFocus
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-base text-gray-900 placeholder-slate-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />

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
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#111827] py-4 text-base font-black text-white shadow-lg transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      whileHover={!isSubmitting ? { scale: 1.015 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.985 } : {}}
                    >
                      {isSubmitting ? (
                        <><Loader2 size={16} className="animate-spin" />{t.submitting}</>
                      ) : (
                        <>{t.submitBtn}<ArrowRight size={16} className="text-indigo-400" /></>
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
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="rounded-[28px] border border-emerald-100 bg-white px-8 py-12 text-center shadow-[0_20px_60px_-16px_rgba(15,23,42,0.08)]">
                  <motion.div
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 16 }}
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <p className="text-2xl font-bold text-slate-900">{t.doneHeadline}</p>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                    {t.doneSub}
                  </p>
                  {preview && (
                    <div className="mx-auto mt-6 h-20 w-20 overflow-hidden rounded-2xl border border-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-7 text-sm font-semibold text-slate-400 underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    {t.another}
                  </button>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.28, ease: EASE }}
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

// ─── layers icon ───────────────────────────────────────────────────────────────
function LayersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="4" y="28" width="36" height="14" rx="4" fill="currentColor" opacity="0.12" />
      <rect x="4" y="18" width="36" height="14" rx="4" fill="currentColor" opacity="0.25" />
      <rect x="4" y="8"  width="36" height="14" rx="4" fill="currentColor" opacity="0.55"
        stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" />
      <path d="M30 16 L30 10 M30 10 L34 14 M30 10 L26 14"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}
