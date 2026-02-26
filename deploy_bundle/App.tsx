
import React, { useState, useCallback, useEffect } from 'react';
import { KotodamaResult, ElementType } from './types';
import { calculateScores, determinePrimaryElement } from './services/kotodamaLogic';
import { generateKotodamaReading } from './services/geminiService';
import { ResultCard } from './components/ResultCard';

const LOADING_MESSAGES = [
  "言霊の響きを聴いています...",
  "エレメントを計算しています...",
  "あなたの物語が始まります..."
];

const App: React.FC = () => {
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [result, setResult] = useState<KotodamaResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugLog, setDebugLog] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  const addLog = (msg: string, data?: any) => {
    let logData = data;
    if (data instanceof Error) {
      logData = {
        name: data.name,
        message: data.message,
        stack: data.stack
      };
    }
    setDebugLog(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, data: logData }]);
  };

  const handleDiagnose = useCallback(async () => {
    const fullInput = (lastName + firstName).trim();
    if (!fullInput) {
      setError("お名前（ひらがな）を入力してください。");
      return;
    }

    if (!/^[\u3040-\u309Fー]+$/.test(fullInput)) {
      setError("正確な診断のため、ひらがなで入力してください。");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDebugLog([]);
    addLog("診断開始", { lastName, firstName });

    try {
      const waitPromise = new Promise(resolve => setTimeout(resolve, 1500));
      const { details, lastNameScores, firstNameScores } = calculateScores(lastName, firstName);
      const element = determinePrimaryElement(lastNameScores, firstNameScores);

      addLog("エレメント計算完了", { element });

      const apiPromise = generateKotodamaReading(fullInput, element, details);

      const [_, reading] = await Promise.all([waitPromise, apiPromise]);
      addLog("APIレスポンス取得成功");

      setResult({
        lastName,
        firstName,
        primaryElement: element,
        lastNameScores,
        firstNameScores,
        details,
        reading,
      });
    } catch (err: any) {
      addLog("エラー発生", err);
      const msg = err?.message || "診断中にエラーが発生しました。";
      setError(`診断エラー: ${msg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lastName, firstName]);

  const handleReset = () => {
    setResult(null);
    setLastName('');
    setFirstName('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {!loading && !result && (
        <header className="text-center mb-12 mt-12 animate-fade-in-down w-full max-w-2xl relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-100 rounded-full opacity-30 blur-3xl -z-10"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-100 rounded-full opacity-30 blur-2xl -z-10 translate-x-10 translate-y-10"></div>

          <h1 className="text-5xl md:text-6xl font-bold text-[#b44c2c] mb-6 tracking-tight font-mincho">
            名前のエレメント診断
          </h1>
          <p className="text-[#6d645e] font-serif leading-loose text-sm md:text-base">
            名前にはことだまが宿っています。<br />
            五つのエレメントから<br />
            あなたの本質と可能性について紐解きましょう
          </p>
        </header>
      )}

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fffcf5] bg-opacity-90 backdrop-blur-md animate-fade-in-up">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-100 border-t-[#d47255] rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center font-mincho text-2xl text-[#d47255] animate-pulse">
              音
            </div>
          </div>
          <h2 className="mt-8 text-xl font-mincho text-[#6d645e] tracking-widest animate-pulse">
            {LOADING_MESSAGES[loadingMsgIndex]}
          </h2>
        </div>
      )}

      {!loading && !result && (
        <div className="w-full max-w-lg bg-white/60 backdrop-blur-sm rounded-3xl shadow-[0_10px_40px_-15px_rgba(212,114,85,0.2)] p-8 border border-[#efe2d5] animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <svg width="100" height="100" viewBox="0 0 100 100" className="text-[#d47255]">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[#a09388] font-serif text-sm px-1" htmlFor="lastName">
                  せい（ひらがな）
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="さとう"
                  className="w-full bg-[#fcf9f2]/50 rounded-2xl border-2 border-[#efe2d5] text-[#3e3a36] text-xl font-mincho p-4 focus:border-[#d47255] focus:bg-white outline-none transition-all placeholder-[#dcd3cb]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[#a09388] font-serif text-sm px-1" htmlFor="firstName">
                  めい（ひらがな）
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="はなこ"
                  className="w-full bg-[#fcf9f2]/50 rounded-2xl border-2 border-[#efe2d5] text-[#3e3a36] text-xl font-mincho p-4 focus:border-[#d47255] focus:bg-white outline-none transition-all placeholder-[#dcd3cb]"
                />
              </div>
            </div>

            <p className="text-xs text-[#a09388] font-serif text-center italic">
              ※ どちらか片方でも、あなたのエレメントは導き出せます
            </p>

            {error && (
              <div className="p-4 bg-[#fff1ed] rounded-2xl border border-[#ffd8cc] text-[#d47255] text-sm font-serif text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleDiagnose}
              disabled={(!lastName.trim() && !firstName.trim())}
              className={`w-full text-white font-serif font-bold text-lg px-6 py-5 rounded-2xl transition-all shadow-lg mt-2 relative overflow-hidden group
                ${(!lastName.trim() && !firstName.trim())
                  ? 'bg-[#dcd3cb] cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#d47255] to-[#e89c85] hover:shadow-[0_15px_30px_-10px_rgba(212,114,85,0.4)] transform hover:-translate-y-1 active:translate-y-0'
                }`}
            >
              <span className="relative z-10 flex justify-center items-center gap-3">
                診断を開始する
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

      {!loading && result && (
        <ResultCard result={result} onReset={handleReset} />
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-fade-in-down {
          animation: fadeInDown 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
