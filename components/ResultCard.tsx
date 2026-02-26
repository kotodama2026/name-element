
import React, { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { KotodamaResult, ElementType } from '../types';
import { ELEMENTS_CONFIG } from '../services/kotodamaLogic';

interface ResultCardProps {
  result: KotodamaResult;
  onReset: () => void;
}

const EXPLANATION_URL = "https://drive.google.com/file/d/1ix06TfgfgO1gkzT3SIl-igNgMC07YthL/view?usp=sharing";

// 円グラフと中央の漢字を完全に統合したSVGコンポーネント
const SvgPieChart: React.FC<{
  scores: Record<ElementType, number>;
  total: number;
  primaryChar: string | null;
  primaryColor: string;
}> = ({ scores, total, primaryChar, primaryColor }) => {
  const elements = [ElementType.FIRE, ElementType.WATER, ElementType.WIND, ElementType.EARTH, ElementType.VOID];

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  let currentAngle = 0;
  const slices = elements.map((el) => {
    if (total === 0 || scores[el] === 0) return null;
    const percent = scores[el] / total;
    const angle = percent * 360;

    if (percent >= 0.99) {
      const color = el === ElementType.FIRE ? '#fb7185' : // rose-400
        el === ElementType.WATER ? '#38bdf8' : // sky-400
          el === ElementType.WIND ? '#fde047' : // yellow-300
            el === ElementType.EARTH ? '#34d399' : // emerald-400
              '#c084fc'; // purple-400 (VOID)
      return <circle key={el} cx="50" cy="50" r="45" fill={color} />;
    }

    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const color = el === ElementType.FIRE ? '#e11d48' : // rose-600
      el === ElementType.WATER ? '#0284c7' : // sky-600
        el === ElementType.WIND ? '#eab308' : // yellow-600
          el === ElementType.EARTH ? '#059669' : // emerald-600
            '#9333ea'; // purple-600 (VOID)

    const sliceColor = el === ElementType.FIRE ? '#fb7185' : // rose-400
      el === ElementType.WATER ? '#38bdf8' : // sky-400
        el === ElementType.WIND ? '#fde047' : // yellow-300
          el === ElementType.EARTH ? '#34d399' : // emerald-400
            '#c084fc'; // purple-400 (VOID)

    return <path key={el} d={describeArc(50, 50, 45, startAngle, endAngle)} fill={sliceColor} />;
  });

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" overflow="visible">
      <circle cx="50" cy="50" r="45" fill="#fcf9f2" />
      <g>{total > 0 && slices}</g>
      <circle cx="50" cy="50" r="32" fill="white" stroke="#efe2d5" strokeWidth="0.5" />
      {primaryChar && (
        <text
          x="50"
          y="51"
          fill={primaryColor}
          fontSize="35"
          fontWeight="800"
          fontFamily="'Noto Serif JP', 'Yu Mincho', 'YuMincho', 'Hiragino Mincho ProN', 'MS Mincho', serif"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ userSelect: 'none' }}
        >
          {primaryChar}
        </text>
      )}
    </svg>
  );
};

const ElementPieChart: React.FC<{
  scores: Record<ElementType, number>;
  title: string;
}> = ({ scores, title }) => {
  const elements = [ElementType.FIRE, ElementType.WATER, ElementType.WIND, ElementType.EARTH, ElementType.VOID];
  const total = useMemo(() => Object.values(scores).reduce((a: number, b: number) => a + b, 0), [scores]);

  const primaryForPart = useMemo(() => {
    if (total === 0) return null;
    let max = -1;
    let winner = ElementType.VOID;
    elements.forEach(el => {
      if (scores[el] > max) {
        max = scores[el];
        winner = el;
      }
    });
    return winner;
  }, [scores, total, elements]);

  const getPrimaryHexColor = (el: ElementType | null) => {
    if (!el) return '#dcd3cb';
    switch (el) {
      case ElementType.FIRE: return '#e11d48'; // rose-600
      case ElementType.WATER: return '#0284c7'; // sky-600
      case ElementType.WIND: return '#ca8a04'; // yellow-600
      case ElementType.EARTH: return '#059669'; // emerald-600
      case ElementType.VOID: return '#9333ea'; // purple-600
      default: return '#3e3a36';
    }
  };

  return (
    <div className="bg-white p-10 rounded-2xl border-2 border-[#efe2d5] shadow-sm w-full relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#efe2d5]"></div>
      <h3 className="font-mincho font-bold text-[#3e3a36] mb-10 text-center tracking-[0.3em] text-lg border-b border-[#efe2d5] pb-4 w-full">{title}</h3>

      <div className="relative w-52 h-52 mb-10">
        <SvgPieChart
          scores={scores}
          total={total}
          primaryChar={primaryForPart}
          primaryColor={getPrimaryHexColor(primaryForPart)}
        />
      </div>

      <div className="w-full space-y-4">
        {elements.map(el => {
          const score = scores[el];
          const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
          const eConfig = ELEMENTS_CONFIG[el];
          return (
            <div key={el} className="flex items-center border-b border-[#f5f0eb] pb-2">
              <div className="flex items-center gap-3 w-1/2">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${eConfig.bgColor} border-2 ${eConfig.borderColor}`}></span>
                <span className={`text-sm font-mincho font-bold ${score > 0 ? eConfig.textColor : 'text-[#a09388]'}`}>{el}のエレメント</span>
              </div>
              <div className="w-1/4 text-right">
                <span className={`text-sm font-mono font-bold ${score > 0 ? eConfig.textColor : 'text-[#dcd3cb]'}`}>
                  {percentage}%
                </span>
              </div>
              <div className="w-1/4 text-right">
                <span className="text-xs font-mono text-[#a09388]">{score} pt</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-double border-[#efe2d5] flex justify-between items-center w-full px-1">
        <span className="text-[10px] font-serif text-[#a09388] tracking-[0.4em] uppercase">エレメント合計</span>
        <span className="text-2xl font-mono font-bold text-[#3e3a36]">{total} <span className="text-xs font-normal opacity-60">Total</span></span>
      </div>
    </div>
  );
};

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  const config = ELEMENTS_CONFIG[result.primaryElement];
  const [isDownloading, setIsDownloading] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // 1) フォントの読み込み待ち
      if (document.fonts) {
        // 特定のWebフォントが読み込まれるまで明示的に待機
        try {
          await Promise.all([
            document.fonts.load('1em "Noto Serif JP"'),
            document.fonts.load('700 1em "Noto Serif JP"'),
            document.fonts.load('900 1em "Noto Serif JP"'),
            document.fonts.load('1em "Noto Sans JP"'),
            document.fonts.load('700 1em "Noto Sans JP"')
          ]);
        } catch (e) {
          console.warn('Individual font loading failed, falling back to document.fonts.ready', e);
        }

        await Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 3000))
        ]);
      }

      // 2) 画像の読み込み待ち
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
        })
      );

      // 3) 短い待機
      await new Promise((r) => setTimeout(r, 500));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);

      const sections = document.querySelectorAll('.pdf-section');
      if (sections.length === 0) {
        throw new Error('No sections found');
      }

      let currentY = margin;

      const addBackground = (doc: jsPDF) => {
        doc.setFillColor(255, 252, 248);
        doc.rect(0, 0, pdfWidth, pdfHeight, 'F');
      };

      addBackground(pdf);

      for (let i = 0; i < sections.length; i++) {
        const el = sections[i] as HTMLElement;

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 1200,
          onclone: (clonedDoc) => {
            // PDF生成時のみ、日本語フォントの下振れを補正する
            const btnInners = clonedDoc.querySelectorAll('.explanation-btn-inner');
            btnInners.forEach(inner => {
              (inner as HTMLElement).style.transform = 'translateY(-6px)';
            });
          }
        });

        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const displayHeight = (imgProps.height * contentWidth) / imgProps.width;

        if (currentY + displayHeight > pdfHeight - margin) {
          pdf.addPage();
          addBackground(pdf);
          currentY = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, displayHeight);

        // セクション0（ヘッダー）の場合、解説ボタンのリンクをPDF上に生成する
        if (i === 0 && linkRef.current) {
          const sectionRect = el.getBoundingClientRect();
          const linkRect = linkRef.current.getBoundingClientRect();

          // html2canvasのwindowWidth(1200)と実際の表示幅の比率を考慮
          const scaleX = contentWidth / 1200;
          const scaleY = displayHeight / sectionRect.height;

          // リンクの位置を計算（簡易的な比率計算）
          const pdfLinkX = margin + ((linkRect.left - sectionRect.left) * (contentWidth / sectionRect.width));
          const pdfLinkY = currentY + ((linkRect.top - sectionRect.top) * (displayHeight / sectionRect.height));
          const pdfLinkW = linkRect.width * (contentWidth / sectionRect.width);
          const pdfLinkH = linkRect.height * (displayHeight / sectionRect.height);

          pdf.link(pdfLinkX, pdfLinkY, pdfLinkW, pdfLinkH, { url: EXPLANATION_URL });
        }

        currentY += displayHeight + 5;
      }

      pdf.save(`${result.lastName}${result.firstName}様の名前のエレメント鑑定書.pdf`);
    } catch (e) {
      console.error('PDF Generation Error:', e);
      alert('PDF作成中にエラーが発生しました。ブラウザの設定や通信環境を確認してください。');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up pb-24 px-4">
      <div id="kotodama-result-container" className="bg-[#fffcf8] shadow-2xl rounded-none md:rounded-[1rem] overflow-hidden border-8 border-[#efe2d5] relative">
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#d47255] opacity-40"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#d47255] opacity-40"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#d47255] opacity-40"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#d47255] opacity-40"></div>

        <div className="p-8 md:p-16">
          <header className="text-center mb-20 pdf-section bg-white border-b-4 border-double border-[#efe2d5] py-16 flex flex-col items-center" data-idx="0">
            {/* 解説ボタン：高コントラストかつ太字で視認性を調整 */}
            <div className="mb-14">
              <a
                ref={linkRef}
                href={EXPLANATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#b44c2c] text-white rounded-full hover:bg-[#8e3a21] transition-all font-mincho font-extrabold text-lg md:text-xl shadow-[0_10px_20px_-5px_rgba(180,76,44,0.4)] group transform hover:-translate-y-1 ring-4 ring-[#b44c2c]/10 h-[72px] px-12 leading-none"
              >
                <div className="flex items-center justify-center explanation-btn-inner">
                  <span className="leading-none">【解説】 エレメント鑑定書の見方</span>
                </div>
              </a>
              <p className="mt-4 text-xs text-[#a09388] font-bold font-serif tracking-widest animate-pulse uppercase">
                Guide to Reading Your Element Reading
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-mincho font-bold text-[#3e3a36] leading-tight mb-4">
              {result.lastName} {result.firstName} <span className="text-2xl font-normal text-[#6d645e]">様の診断結果</span>
            </h1>
          </header>

          <section className="mb-24 pdf-section" data-idx="1">
            <h2 className="text-2xl font-mincho font-bold text-[#3e3a36] mb-12 flex items-center justify-center tracking-[0.4em]">
              <span className="w-16 h-[1px] bg-[#d47255]/30 mr-6"></span>
              五大エレメント表
              <span className="w-16 h-[1px] bg-[#d47255]/30 ml-6"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ElementPieChart scores={result.lastNameScores} title="姓のエレメント" />
              <ElementPieChart scores={result.firstNameScores} title="名のエレメント" />
            </div>
          </section>

          <section className="mb-20">
            <div className="pdf-section mb-12 text-center" data-idx="2">
              <h2 className="text-3xl font-mincho font-bold text-[#3e3a36] inline-block border-b-2 border-[#d47255] pb-2 tracking-[0.2em]">
                各ひらがなの解説
              </h2>
            </div>

            <div className="space-y-20">
              {result.reading.characterAnalyses.map((analysis, idx) => {
                const detail = result.details.find(d => d.char === analysis.char);
                const charConfig = detail ? ELEMENTS_CONFIG[detail.element] : config;

                return (
                  <div key={idx} className="bg-white border-2 border-[#efe2d5] pdf-section overflow-hidden" data-idx={3 + idx}>
                    <div className={`p-8 md:p-12 ${charConfig.bgColor} border-b-2 ${charConfig.borderColor} flex flex-col md:flex-row items-center gap-8 md:gap-16 min-h-[280px] md:min-h-[320px]`}>

                      <div className="flex-shrink-0 flex items-center justify-center w-[160px] h-[160px] md:w-[220px] md:h-[220px]">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" overflow="visible">
                          <text
                            x="50"
                            y="50"
                            fill={charConfig.hexColor}
                            fontSize="80"
                            fontWeight="bold"
                            fontFamily="'Noto Serif JP', 'Yu Mincho', 'YuMincho', 'Hiragino Mincho ProN', 'MS Mincho', serif"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ userSelect: 'none', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                          >
                            {analysis.char}
                          </text>
                        </svg>
                      </div>

                      <div className="flex flex-col gap-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start">
                          <span className={`font-bold text-sm tracking-[0.4em] ${charConfig.textColor} uppercase`}>
                            ● {detail?.element}のエレメント
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold text-[#3e3a36] font-mincho tracking-wider leading-tight">
                          {analysis.symbol}
                        </h3>
                      </div>
                    </div>

                    <div className="p-10 md:p-16 space-y-12 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-3">
                          <dt className={`font-bold text-xs ${charConfig.textColor} font-serif tracking-[0.4em] uppercase border-l-4 border-current pl-4`}>
                            Nature<br />性質
                          </dt>
                        </div>
                        <div className="md:col-span-9">
                          <dd className="text-[#3e3a36] text-lg md:text-xl leading-[2] font-mincho">
                            {analysis.nature}
                          </dd>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-3">
                          <dt className={`font-bold text-xs ${charConfig.textColor} font-serif tracking-[0.4em] uppercase border-l-4 border-current pl-4`}>
                            Talent<br />才能
                          </dt>
                        </div>
                        <div className="md:col-span-9">
                          <dd className="text-[#6d645e] text-lg md:text-xl leading-[2]">
                            {analysis.talent}
                          </dd>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-3">
                          <dt className={`font-bold text-xs ${charConfig.textColor} font-serif tracking-[0.4em] uppercase border-l-4 border-current pl-4`}>
                            Caution<br />戒め
                          </dt>
                        </div>
                        <div className="md:col-span-9">
                          <dd className="text-[#6d645e] text-lg md:text-xl leading-[2]">
                            {analysis.caution}
                          </dd>
                        </div>
                      </div>

                      <div className="mt-12 p-1 bg-[#fffcf5] border border-[#efe2d5]">
                        <div className="border-2 border-double border-[#d47255]/40 p-10 bg-white">
                          <dt className="font-bold text-xl mb-6 text-[#b44c2c] flex items-center justify-center font-mincho tracking-[0.3em]">
                            <span className="w-8 h-[1px] bg-[#b44c2c]/30 mr-4"></span>
                            開運之導
                            <span className="w-8 h-[1px] bg-[#b44c2c]/30 ml-4"></span>
                          </dt>
                          <dd className="text-[#3e3a36] text-xl md:text-2xl leading-relaxed font-mincho italic text-center px-4">
                            {analysis.luckTip}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="pdf-section mt-32" data-idx={3 + result.reading.characterAnalyses.length}>
            <div className="bg-white border-t-8 border-[#3e3a36] p-12 md:p-24 relative shadow-inner">
              <div className="absolute top-0 right-10 w-24 h-24 border-r-2 border-b-2 border-[#d47255]/20"></div>
              <div className="mb-12">
                <span className="text-[#b44c2c] font-bold text-sm tracking-[0.5em] block mb-4">— 結び —</span>
                <h3 className={`text-2xl md:text-4xl font-bold font-mincho ${config.textColor} tracking-widest leading-tight`}>
                  {result.reading.summaryTitle}
                </h3>
              </div>
              <p className="text-[#3e3a36] leading-relaxed font-mincho text-justify text-base md:text-lg border-l-4 border-[#efe2d5] pl-6 md:pl-10">
                {result.reading.summaryText}
              </p>
              <div className="mt-20 text-right">
                <div className="inline-block p-4 border-4 border-double border-[#b44c2c] text-[#b44c2c] font-mincho font-bold text-2xl rotate-[-5deg]">
                  名前のエレメント鑑定書
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center gap-10 no-print">
        <div className="w-full max-w-md flex flex-col gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-full flex flex-col items-center gap-2 px-10 py-8 font-mincho font-bold text-white shadow-2xl transition-all duration-500 rounded-lg ${isDownloading ? 'bg-[#dcd3cb] cursor-wait' : 'bg-[#3e3a36] hover:bg-[#1a1816] hover:-translate-y-2'
              }`}
          >
            <span className="text-2xl tracking-[0.2em]">{isDownloading ? '鑑定書作成中...' : '鑑定書を保存する'}</span>
            <span className="text-xs font-serif font-normal opacity-70">Save your destiny as PDF</span>
          </button>

          {navigator.share && (
            <button
              onClick={() => {
                navigator.share({
                  title: '名前のエレメント診断',
                  text: `${result.lastName}${result.firstName}様の名前のエレメント診断結果です。`,
                  url: window.location.href,
                }).catch(console.error);
              }}
              className="w-full py-4 font-mincho font-bold text-[#3e3a36] border-2 border-[#3e3a36] rounded-lg hover:bg-[#3e3a36] hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              結果をシェアする
            </button>
          )}
        </div>

        <button
          onClick={onReset}
          className="text-[#a09388] hover:text-[#b44c2c] font-serif text-base border-b border-[#efe2d5] transition-colors"
        >
          他のお名前を占う
        </button>
      </div>
    </div>
  );
};
