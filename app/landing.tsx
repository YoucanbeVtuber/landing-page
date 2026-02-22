import React, { useState, useRef } from 'react';
import { 
  Folder, Mail, Sparkles, UploadCloud, 
  Wand2, Layers, CheckCircle2, ChevronRight, Gift, PlayCircle, X, Upload 
} from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const topFormRef = useRef(null);

  // --- 추가된 상태: 탭 전환 및 업로드 폼 처리용 ---
  const [activeMode, setActiveMode] = useState('demo'); // 기본값을 'demo'(무료 샘플 신청)로 변경
  const [demoEmail, setDemoEmail] = useState('');
  const [demoFile, setDemoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDemoSubmitted, setIsDemoSubmitted] = useState(false);
  const [submittedDemoEmail, setSubmittedDemoEmail] = useState(''); // 모달에 표시할 이메일 저장용
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim() === '') return;
    
    // 이메일 제출 로직 (API 연동 등)
    console.log('Submitted email:', email);
    setIsSubmitted(true);
    setEmail('');
    
    // 3초 후 완료 메시지 숨김
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  // --- 추가된 함수: 파일 선택 및 폼 제출 핸들러 ---
  const handleFileSelection = (file: File) => {
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setDemoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("PNG 또는 JPG 파일만 업로드 가능합니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setDemoFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDemoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!demoEmail || !demoFile) {
      alert("이미지와 이메일을 모두 입력해주세요.");
      return;
    }
    
    // 이메일 및 이미지 제출 로직 (API 연동)
    console.log('Demo requested by:', demoEmail, 'File:', demoFile!.name);
    setSubmittedDemoEmail(demoEmail);
    setIsDemoSubmitted(true); // 모달 띄우기
    
    // 모달을 닫을 때 폼을 초기화하므로 여기서는 초기화하지 않습니다.
  };

  const closeDemoModal = () => {
    setIsDemoSubmitted(false);
    removeFile();
    setDemoEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans text-gray-900 selection:bg-pink-100">
      {/* Header */}
      <header className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto w-full">
        <div className="font-extrabold text-2xl tracking-tight cursor-pointer">
          LivingCel
        </div>
        <div className="flex items-center gap-6">
          <button className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
            <Folder size={18} />
            <span className="text-sm">내 작업실</span>
          </button>
          <button className="bg-[#1a1f36] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-black transition-colors shadow-sm">
            로그인
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mt-12 sm:mt-16 px-4 w-full max-w-4xl relative">
          
          {/* ✨ 통합 예정 영역: 파츠가 사방으로 분할되어 퍼지는 영상/애니메이션 컴포넌트를 이 위치에 배치하세요 ✨ */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            {/* <YourParticleVideo autoPlay loop muted className="w-full h-full object-cover opacity-50" /> */}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.2] tracking-tight mt-4">
            움직이는 캐릭터의 시작,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500">
              AI 파츠 분리
            </span>
          </h1>
          
          <p className="text-gray-500 text-base sm:text-lg mt-2 mb-10 max-w-xl mx-auto font-medium">
            지루한 파츠 분리 밑작업,<br className="hidden sm:block" />
            AI 초안으로 작업 시간을 획기적으로 단축하세요.
          </p>

          {/* Mode Toggle (사전 예약 vs 무료 샘플) */}
          <div className="flex bg-gray-100/80 backdrop-blur p-1.5 rounded-full mb-8 z-10 relative shadow-inner">
            <button
              onClick={() => setActiveMode('reserve')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeMode === 'reserve' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              출시 알림 받기
            </button>
            <button
              onClick={() => setActiveMode('demo')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'demo' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sparkles size={16} className={activeMode === 'demo' ? 'text-pink-500' : 'text-gray-400'} />
              무료 샘플 신청
            </button>
          </div>

          {/* Email Subscription Form OR Demo Upload Form */}
          <div className="w-full flex flex-col items-center mb-16 relative z-10" ref={topFormRef}>
            
            {activeMode === 'reserve' ? (
              // --- 1. 사전 예약 폼 ---
              <div className="w-full flex flex-col items-center relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                <form 
                  onSubmit={handleSubmit}
                  className="flex w-full max-w-md bg-white shadow-md hover:shadow-lg transition-shadow rounded-full overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-pink-100 focus-within:border-pink-300"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="이메일 주소를 입력해주세요 💌"
                    required
                    className="flex-1 px-6 py-4 text-gray-700 placeholder-gray-400 outline-none w-full text-sm sm:text-base bg-transparent"
                  />
                  <button 
                    type="submit" 
                    className="bg-[#1a1f36] text-white px-6 sm:px-8 flex items-center justify-center gap-2 hover:bg-black transition-colors font-bold whitespace-nowrap"
                  >
                    <span>사전 예약</span>
                    <Mail size={18} className="hidden sm:block" />
                  </button>
                </form>
                
                {isSubmitted && (
                  <div className="absolute -bottom-14 text-sm text-blue-600 font-bold animate-fade-in-up bg-blue-50 border border-blue-100 px-5 py-2 rounded-full shadow-sm z-20">
                    사전 예약이 완료되었습니다! 출시 시 안내해 드릴게요 🎉
                  </div>
                )}

                {/* Benefits Highlight (Cleaned up) */}
                <div className="mt-4 flex flex-col items-center gap-1.5 animate-fade-in-up">
                  <div className="flex items-center gap-1.5 text-gray-700 text-sm font-medium">
                    <Gift size={16} className="text-pink-500" />
                    <span>사전 예약 시 정식 출시 후 <strong className="text-pink-500">무료 크레딧 100% 증정!</strong></span>
                  </div>
                  <p className="text-xs text-gray-400">
                    * 스팸 메일 없이 서비스 출시 소식만 전해드립니다.
                  </p>
                </div>
              </div>
            ) : (
              // --- 2. 무료 샘플 신청 (이미지 업로드) 폼 ---
              <div className="w-full max-w-md bg-white shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 md:p-8 border border-gray-100 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                {!demoFile ? (
                  // 업로드 전 상태
                  <div className="flex flex-col w-full">
                    {/* 추가된 최소한의 안내 텍스트 */}
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">내 캐릭터로 결과물 받아보기</h3>
                      <p className="text-sm text-gray-500 break-keep leading-relaxed">
                        이미지를 업로드해주시면 저희가 직접 파츠를 분리하여 <strong className="text-pink-500 font-bold">파츠 분리된 PSD 초안</strong>을 보내드립니다.
                      </p>
                    </div>

                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-3xl py-10 px-6 flex flex-col items-center justify-center transition-colors w-full ${
                        isDragging ? 'border-pink-400 bg-pink-50' : 'border-gray-300 bg-white hover:border-pink-300 hover:bg-pink-50/30'
                      }`}
                    >
                      <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-4">
                        <Upload size={28} strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">일러스트 업로드</h3>
                      <p className="text-gray-400 text-sm mb-6">PNG, JPG 지원</p>
                      
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#1a1f36] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-black transition-colors"
                      >
                        PC에서 파일 선택
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/png, image/jpeg" 
                        onChange={handleFileChange} 
                      />
                    </div>
                  </div>
                ) : (
                  // 업로드 후 상태 (미리보기 및 이메일 입력)
                  <form onSubmit={handleDemoSubmit} className="flex flex-col items-center w-full animate-in fade-in duration-300">
                    {/* Image Preview */}
                    <div className="relative mb-8 mt-2">
                      <div className="w-32 h-32 rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white flex items-center justify-center">
                        {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />}
                      </div>
                      <button 
                        type="button"
                        onClick={removeFile}
                        className="absolute -top-3 -right-3 bg-white border border-gray-200 text-gray-500 hover:text-gray-800 rounded-full p-1.5 shadow-md transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-4">결과물을 받을 이메일 주소</h4>
                    
                    <div className="w-full mb-4">
                      <input
                        type="email"
                        required
                        value={demoEmail}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDemoEmail(e.target.value)}
                        placeholder="example@email.com"
                        className="w-full px-5 py-4 border-2 border-pink-400 rounded-xl text-gray-700 placeholder-gray-400 outline-none focus:ring-4 focus:ring-pink-100 transition-all text-center"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-[#df3f81] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#c9306f] transition-colors shadow-sm"
                    >
                      PSD 초안 + 무료 크레딧 받기
                    </button>
                    
                    <p className="text-xs text-gray-400 mt-4">
                      * 테스트 기간으로 초안 발송에 며칠 소요될 수 있습니다.
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Video Section */}
        <section className="w-full max-w-4xl mx-auto px-4 relative flex flex-col items-center">
          <div className="absolute top-0 left-4 sm:-translate-x-12 sm:-translate-y-8 text-yellow-400 animate-pulse z-0">
            <Sparkles size={32} />
          </div>
          <div className="absolute bottom-12 right-4 sm:translate-x-12 sm:translate-y-8 text-blue-300 animate-pulse delay-300 z-0">
            <Sparkles size={24} />
          </div>

          <div className="w-full bg-white p-2 sm:p-3 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 mb-32 relative group z-10">
            <div className="relative rounded-[1.5rem] overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
                muted
                playsInline
                poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              >
                <source src="/파츠 분할 데모 영상2.mp4" type="video/mp4" />
                브라우저가 비디오 태그를 지원하지 않습니다.
              </video>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-black/30 transition-colors duration-300">
                <h2 className="text-white text-2xl sm:text-5xl md:text-7xl font-black tracking-widest drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] transform -rotate-2 opacity-80">
                  사전 예약 진행 중
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline Section (Vertical Scroll Journey) */}
        <section className="w-full max-w-5xl mx-auto mb-40 px-4">
          <div className="text-center mb-24">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              맨땅에서 시작하지 마세요.<br className="block sm:hidden" /> AI가 밑작업을 돕습니다.
            </h2>
            <p className="text-gray-500 font-medium text-lg mt-4">
              단순 반복 작업은 맡기고, 디테일을 살리는 데 더 많은 시간을 투자하세요.
            </p>
          </div>

          <div className="flex flex-col gap-32">
            
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="flex-1 md:text-right flex flex-col items-start md:items-end">
                <span className="text-pink-500 font-black text-6xl mb-4 opacity-50">01</span>
                <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">이미지 업로드</h3>
                <p className="text-gray-500 text-lg leading-relaxed break-keep">
                  일러스트를 올리기만 하세요.
                </p>
              </div>
              <div className="flex-[1.5] w-full">
                {/* Video Placeholder 1 */}
                <div className="w-full aspect-video bg-gray-100 rounded-[2rem] border border-gray-200 shadow-lg overflow-hidden flex items-center justify-center relative">
                  {/* 실제 영상 삽입 시 아래 주석 해제 후 src 변경 */}
                  {/* <video src="/step1-video.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" /> */}
                  <div className="flex flex-col items-center text-gray-400">
                    <PlayCircle size={48} strokeWidth={1.5} />
                    <span className="mt-2 font-medium">1단계 영상 영역</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
              <div className="flex-1 flex flex-col items-start">
                <span className="text-purple-500 font-black text-6xl mb-4 opacity-50">02</span>
                <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">자동 파츠 분리</h3>
                <p className="text-gray-500 text-lg leading-relaxed break-keep">
                  주요 파츠를 AI가 인식하여 레이어 초안을 빠르게 생성합니다.
                </p>
              </div>
              <div className="flex-[1.5] w-full">
                {/* Video Placeholder 2 */}
                <div className="w-full aspect-video bg-gray-100 rounded-[2rem] border border-gray-200 shadow-lg overflow-hidden flex items-center justify-center relative">
                  {/* <video src="/step2-video.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" /> */}
                  <div className="flex flex-col items-center text-gray-400">
                    <PlayCircle size={48} strokeWidth={1.5} />
                    <span className="mt-2 font-medium">2단계 영상 영역</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="flex-1 md:text-right flex flex-col items-start md:items-end">
                <span className="text-blue-500 font-black text-6xl mb-4 opacity-50">03</span>
                <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">세부 수정</h3>
                <p className="text-gray-500 text-lg leading-relaxed break-keep">
                  빈 공간 채우기 등 까다로운 작업도 AI 보조로 쉽게 수정하세요.
                </p>
              </div>
              <div className="flex-[1.5] w-full">
                {/* Video Placeholder 3 */}
                <div className="w-full aspect-video bg-gray-100 rounded-[2rem] border border-gray-200 shadow-lg overflow-hidden flex items-center justify-center relative">
                  {/* <video src="/step3-video.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" /> */}
                  <div className="flex flex-col items-center text-gray-400">
                    <PlayCircle size={48} strokeWidth={1.5} />
                    <span className="mt-2 font-medium">3단계 영상 영역</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
              <div className="flex-1 flex flex-col items-start">
                <span className="text-green-500 font-black text-6xl mb-4 opacity-50">04</span>
                <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">PSD 다운로드</h3>
                <p className="text-gray-500 text-lg leading-relaxed break-keep">
                  생성된 초안을 PSD로 다운받아 바로 디테일 작업에 돌입하세요.
                </p>
              </div>
              <div className="flex-[1.5] w-full">
                {/* Video Placeholder 4 */}
                <div className="w-full aspect-video bg-gray-100 rounded-[2rem] border border-gray-200 shadow-lg overflow-hidden flex items-center justify-center relative">
                  {/* <video src="/step4-video.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" /> */}
                  <div className="flex flex-col items-center text-gray-400">
                    <PlayCircle size={48} strokeWidth={1.5} />
                    <span className="mt-2 font-medium">4단계 영상 영역</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="w-full bg-[#111424] pt-24 pb-28 px-4 text-center relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none blur-3xl rounded-full"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              지루한 파츠 분리 밑작업,<br /> 
              이제 AI 어시스턴트에게 맡겨보세요.
            </h2>
            <p className="text-gray-400 text-lg mb-10 font-medium">
              지금 사전 예약하고 <span className="text-pink-400 font-bold">무료 크레딧</span>을 받아가세요.
            </p>
            
            {/* Simple Scroll-to-Top Button */}
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveMode('reserve'); // 최상단 이동 시 사전 예약 탭으로 자동 전환
              }}
              className="mx-auto bg-pink-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-600 transition-all hover:-translate-y-1 shadow-[0_8px_20px_-6px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2"
            >
              <span>지금 바로 사전 예약하기</span>
              <ChevronRight size={20} className="text-pink-200" />
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
              <CheckCircle2 size={16} className="text-pink-400" />
              <span>정식 출시 알림 + 무료 크레딧 자동 지급</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0a0c16] text-center py-10 px-4 text-sm text-gray-500 border-t border-gray-800 flex flex-col items-center">
        <div className="font-bold text-lg text-gray-300 mb-2">LivingCel</div>
        <p>© {new Date().getFullYear()} LivingCel. All rights reserved.</p>
      </footer>

      {/* --- 업로드 완료 모달 (Interactive Success Modal) --- */}
      {isDemoSubmitted && activeMode === 'demo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            {/* Uploaded Image Thumbnail */}
            <div className="relative w-32 h-32 mb-6 rounded-2xl overflow-hidden border-4 border-gray-50 shadow-md">
              {previewUrl && <img src={previewUrl} alt="Uploaded Character" className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">신청 완료!</h3>
            <p className="text-gray-500 text-sm mb-3 break-keep leading-relaxed">
              <strong className="text-gray-800">{submittedDemoEmail}</strong> 주소로<br />
              파츠 분리된 PSD 초안을 보내드릴게요.
            </p>
            <p className="text-xs text-pink-500 font-medium mb-8 break-keep">
              * 테스트 기간으로 초안 발송에 며칠 소요될 수 있습니다.
            </p>

            {/* Close Button */}
            <button
              onClick={closeDemoModal}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}