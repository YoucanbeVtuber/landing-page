"use client";

import React, { useState, useRef } from "react";
import {
  Mail, Sparkles, Gift, X, Upload, CheckCircle2, ChevronRight, Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "./ContactForm";
import { COPY } from "@/content/copy";
import { supabase } from "@/lib/supabase";

export default function HeroRegisterSection() {
  // ---- 출시 알림 받기 폼 상태 ----
  const [activeMode, setActiveMode] = useState<"reserve" | "demo">("reserve");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [reservedEmail, setReservedEmail] = useState(""); // 출시 알림 신청에 사용한 이메일

  // ---- 무료 샘플 신청 폼 상태 ----
  const [demoEmail, setDemoEmail] = useState("");
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);
  const [submittedDemoEmail, setSubmittedDemoEmail] = useState("");
  const [useReservedEmail, setUseReservedEmail] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- 출시 알림 핸들러 ----
  const handleSuccess = () => {
    setIsSubmitted(true);
    setShowContactForm(false);
    setTimeout(() => setIsSubmitted(false), 4000);
  };
  const handleError = () => {};

  // 출시 알림 신청에 사용한 이메일을 저장
  const handleEmailSubmitted = (email: string) => {
    setReservedEmail(email);
  };

  // ---- 파일 관련 핸들러 ----
  const handleFileSelection = (file: File) => {
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      setDemoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("PNG 또는 JPG 파일만 업로드 가능합니다.");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFileSelection(e.target.files[0]);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFileSelection(e.dataTransfer.files[0]);
  };
  const removeFile = () => {
    setDemoFile(null);
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUseReservedEmail(false);
  };

  // 현재 실제 사용할 이메일 (재사용 체크 시 reservedEmail, 아니면 demoEmail)
  const effectiveDemoEmail = useReservedEmail ? reservedEmail : demoEmail;

  const handleDemoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!effectiveDemoEmail || !demoFile) { alert("이미지와 연락처를 모두 입력해주세요."); return; }

    setIsUploading(true);
    try {
      // 1) Storage 업로드 (파일명 충돌 방지를 위해 타임스탬프 prefix)
      const ext = demoFile.name.split(".").pop();
      const filePath = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("character-uploads")
        .upload(filePath, demoFile, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      // 2) 공개 URL 생성
      const { data: urlData } = supabase.storage
        .from("character-uploads")
        .getPublicUrl(filePath);
      const imageUrl = urlData.publicUrl;

      // 3) DB insert
      const { error: dbError } = await supabase
        .from("registrations")
        .insert({ type: "demo_request", email: effectiveDemoEmail, image_url: imageUrl });
      if (dbError) throw dbError;

      setSubmittedDemoEmail(effectiveDemoEmail);
      setIsDemoSubmitted(true);
    } catch (err) {
      console.error("Demo submit error:", err);
      alert("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };
  const closeDemoModal = () => {
    setIsDemoSubmitted(false);
    removeFile();
    setDemoEmail("");
    setUseReservedEmail(false);
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-28 pb-20 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-xs font-semibold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          사전 예약 진행 중
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 text-center mb-5 leading-[1.15] tracking-tight max-w-3xl"
      >
        움직이는 캐릭터의 시작,
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-500">
          AI 파츠 분리
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-gray-500 text-base sm:text-lg text-center mb-10 max-w-xl leading-relaxed"
      >
        지루한 파츠 분리 밑작업,
        <br className="hidden sm:block" />
        AI 초안으로 작업 시간을 획기적으로 단축하세요.
      </motion.p>

      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex bg-gray-100 p-1 rounded-full mb-8 shadow-inner"
      >
        <button
          onClick={() => setActiveMode("reserve")}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeMode === "reserve"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          출시 알림 받기
        </button>
        <button
          onClick={() => setActiveMode("demo")}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
            activeMode === "demo"
              ? "bg-white text-pink-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles size={14} className={activeMode === "demo" ? "text-pink-500" : "text-gray-400"} />
          무료 샘플 신청
        </button>
      </motion.div>

      {/* Form Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {activeMode === "reserve" ? (
            <motion.div
              key="reserve"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              {!showContactForm ? (
                <>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-black transition-all hover:-translate-y-0.5 shadow-lg shadow-gray-900/20"
                  >
                    <span>얼리 액세스 신청하기</span>
                    <ChevronRight size={18} className="text-gray-300" />
                  </button>

                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-sm text-green-600 font-medium bg-green-50 border border-green-100 px-5 py-2.5 rounded-full"
                    >
                      사전 예약 완료! 출시 시 안내해 드릴게요 🎉
                    </motion.div>
                  )}

                  <div className="mt-5 flex items-center gap-2 text-gray-500 text-sm">
                    <Gift size={15} className="text-pink-400 flex-shrink-0" />
                    <span>
                      사전 예약 시{" "}
                      <strong className="text-gray-800">무료 크레딧 100% 증정</strong>
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    * 스팸 없이 출시 소식만 전해드립니다.
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <ContactForm
                    onSuccess={handleSuccess}
                    onError={handleError}
                    onEmailSubmitted={handleEmailSubmitted}
                  />
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors w-full text-center"
                  >
                    취소
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="demo"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/80 p-6"
            >
              {!demoFile ? (
                <>
                  <div className="text-center mb-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">내 캐릭터로 결과물 받아보기</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      이미지를 업로드하면 직접 파츠를 분리해{" "}
                      <strong className="text-pink-500">PSD 초안</strong>을 보내드립니다.
                    </p>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl py-10 px-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-pink-400 bg-pink-50"
                        : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/40"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mb-3">
                      <Upload size={24} strokeWidth={2} />
                    </div>
                    <p className="font-semibold text-gray-700 text-sm">이미지 드래그 또는 클릭</p>
                    <p className="text-gray-400 text-xs mt-1">PNG, JPG 지원</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                </>
              ) : (
                <form onSubmit={handleDemoSubmit} className="flex flex-col items-center">
                  {/* 업로드된 이미지 미리보기 */}
                  <div className="relative mb-5 mt-1">
                    <div className="w-28 h-28 rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-gray-50 flex items-center justify-center">
                      {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />}
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-400 hover:text-gray-700 rounded-full p-1.5 shadow-md transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* 연락처 섹션 */}
                  <div className="w-full mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">결과물 받을 연락처</p>

                    {/* 출시 알림 신청 연락처 재사용 옵션 (출시 알림 신청한 경우에만 표시) */}
                    {reservedEmail && (
                      <motion.label
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-3 w-full mb-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          useReservedEmail
                            ? "border-pink-300 bg-pink-50/60"
                            : "border-gray-200 bg-gray-50 hover:border-pink-200"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={useReservedEmail}
                          onChange={(e) => setUseReservedEmail(e.target.checked)}
                          className="h-4 w-4 rounded border border-gray-300 bg-white checked:bg-pink-500 checked:border-pink-500 focus:ring-1 focus:ring-pink-400 focus:ring-offset-0 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-gray-700">출시 알림 신청 연락처와 동일하게</span>
                          <span className="text-xs text-gray-400 truncate">{reservedEmail}</span>
                        </div>
                        <Copy size={13} className="text-gray-300 ml-auto flex-shrink-0" />
                      </motion.label>
                    )}

                    {/* 이메일 직접 입력 */}
                    <AnimatePresence>
                      {!useReservedEmail && (
                        <motion.input
                          key="emailInput"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          type="email"
                          required={!useReservedEmail}
                          value={demoEmail}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDemoEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50 transition-all text-sm"
                        />
                      )}
                    </AnimatePresence>

                    {/* 재사용 선택 시 선택된 이메일 표시 */}
                    {useReservedEmail && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full px-4 py-3 border-2 border-pink-200 bg-pink-50/40 rounded-xl text-sm text-pink-700 font-medium"
                      >
                        {reservedEmail}
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isUploading ? "업로드 중..." : "PSD 초안 + 무료 크레딧 받기"}
                  </button>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    * 테스트 기간으로 초안 발송에 며칠 소요될 수 있습니다.
                  </p>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Demo Submit Success Modal */}
      {isDemoSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-5">
              <CheckCircle2 size={32} strokeWidth={2} />
            </div>
            <div className="relative w-28 h-28 mb-5 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {previewUrl && <img src={previewUrl} alt="Uploaded Character" className="w-full h-full object-cover" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">신청 완료!</h3>
            <p className="text-gray-500 text-sm mb-1">
              <strong className="text-gray-800">{submittedDemoEmail}</strong> 주소로
              <br />파츠 분리된 PSD 초안을 보내드릴게요.
            </p>
            <p className="text-xs text-pink-500 font-medium mb-6">
              * 테스트 기간으로 초안 발송에 며칠 소요될 수 있습니다.
            </p>
            <button
              onClick={closeDemoModal}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-black transition-colors"
            >
              확인
            </button>
          </motion.div>
        </div>
      )}
    </section>
  );
}
