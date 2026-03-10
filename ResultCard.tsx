
import React, { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { KotodamaResult, ElementType } from '../types';
import { ELEMENTS_CONFIG } from '../services/kotodamaLogic';

interface ResultCardProps {
  result: KotodamaResult;
  onReset: () => void;
}

const EXPLANATION_URL = "https://drive.google.com/file/d/1siZesMpNgiAztTo8m2gbkwrj5XrakhHo/view?usp=drive_link";

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
    <div className="bg-white p-5 md:p-10 rounded-2xl border-2 border-[#efe2d5] shadow-sm w-full relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#efe2d5]"></div>
      <h3 className="font-mincho font-bold text-[#3e3a36] mb-4 md:mb-10 text-center tracking-[0.3em] text-base md:text-lg border-b border-[#efe2d5] pb-4 w-full">{title}</h3>

      <div className="relative w-36 h-36 md:w-52 md:h-52 mb-4 md:mb-10">
        <SvgPieChart
          scores={scores}
          total={total}
          primaryChar={primaryForPart}
          primaryColor={getPrimaryHexColor(primaryForPart)}
        />
      </div>

      <div className="w-full space-y-3 md:space-y-4">
        {elements.map(el => {
          const score = scores[el];
          const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
          const eConfig = ELEMENTS_CONFIG[el];
          return (
            <div key={el} className="flex items-center border-b border-[#f5f0eb] pb-2 last:border-0">
              <div className="flex items-center gap-2 md:gap-3 w-1/2">
                <span className={`w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0 ${eConfig.bgColor} border-2 ${eConfig.borderColor}`}></span>
                <span className={`text-xs md:text-sm font-mincho font-bold ${score > 0 ? eConfig.textColor : 'text-[#a09388]'}`}>{el}のエレメント</span>
              </div>
              <div className="w-1/4 text-right">
                <span className={`text-xs md:text-sm font-mono font-bold ${score > 0 ? eConfig.textColor : 'text-[#dcd3cb]'}`}>
                  {percentage}%
                </span>
              </div>
              <div className="w-1/4 text-right">
                <span className="text-[10px] md:text-xs font-mono text-[#a09388]">{score} pt</span>
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

  // スマホかどうかを判定
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // PDFを生成して Blob で返す
  // forcePageBreakPerChar=true にするとひらがな各セクションで強制改ページする（スマホ向け）
  const generatePdfBlob = async (forcePageBreakPerChar = false): Promise<Blob> => {
    const imgs = Array.from(document.querySelectorAll('img'));
    await Promise.all(
      imgs.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((res) => { img.onload = res; img.onerror = res; });
      })
    );
    await new Promise((r) => setTimeout(r, 500));

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - (margin * 2);
    const sections = document.querySelectorAll('.pdf-section');
    if (sections.length === 0) throw new Error('No sections found');

    let currentY = margin;
    const addBackground = (doc: jsPDF) => {
      doc.setFillColor(255, 252, 248);
      doc.rect(0, 0, pdfWidth, pdfHeight, 'F');
    };
    addBackground(pdf);

    for (let i = 0; i < sections.length; i++) {
      const el = sections[i] as HTMLElement;
      const dataIdx = parseInt(el.getAttribute('data-idx') || '0', 10);

      // ひらがな各セクション（data-idx が 3 以上）の手前で強制改ページ
      if (forcePageBreakPerChar && dataIdx >= 3 && currentY > margin) {
        pdf.addPage();
        addBackground(pdf);
        currentY = margin;
      }

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        onclone: (clonedDoc) => {
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

      if (i === 0 && linkRef.current) {
        const sectionRect = el.getBoundingClientRect();
        const linkRect = linkRef.current.getBoundingClientRect();
        const pdfLinkX = margin + ((linkRect.left - sectionRect.left) * (contentWidth / sectionRect.width));
        const pdfLinkY = currentY + ((linkRect.top - sectionRect.top) * (displayHeight / sectionRect.height));
        const pdfLinkW = linkRect.width * (contentWidth / sectionRect.width);
        const pdfLinkH = linkRect.height * (displayHeight / sectionRect.height);
        pdf.link(pdfLinkX, pdfLinkY, pdfLinkW, pdfLinkH, { url: EXPLANATION_URL });
      }

      currentY += displayHeight + 5;
    }

    return pdf.output('blob');
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      // フォントの読み込みを待つ
      if (document.fonts) {
        try {
          await Promise.all([
            document.fonts.load('1em "Noto Serif JP"'),
            document.fonts.load('700 1em "Noto Serif JP"'),
          ]);
        } catch (e) { /* フォント読み込み失敗は無視して続行 */ }
        await Promise.race([
          document.fonts.ready,
          new Promise(resolve => setTimeout(resolve, 3000))
        ]);
      }

      const pdfFileName = `${result.lastName}${result.firstName}様の名前のエレメント鑑定書.pdf`;

      if (isMobile) {
        // ==============================
        // スマホ版: ひらがなごとに改ページするPDFを生成
        // ==============================
        const pdfBlob = await generatePdfBlob(true);

        // まず Web Share API でPDFファイルを共有シートに渡すことを試みる
        if (navigator.share && navigator.canShare) {
          const pdfFile = new File([pdfBlob], pdfFileName, { type: 'application/pdf' });
          if (navigator.canShare({ files: [pdfFile] })) {
            try {
              await navigator.share({ files: [pdfFile], title: '名前のエレメント診断結果' });
              return;
            } catch (e: any) {
              if (e?.name === 'AbortError') return;
              // 失敗した場合は下のフォールバックへ
            }
          }
        }

        // フォールバック: PDFをブラウザの新しいタブで開く
        // iOSなら画面右上の「共有」→「ファイルに保存」から保存できる
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 30000);

      } else {
        // ==============================
        // PC版: 従来通りPDFをダウンロード（変更なし）
        // ==============================
        const pdfBlob = await generatePdfBlob(false);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = pdfFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 2000);
      }

    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      console.error('Download Error:', e);
      alert('保存中にエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in-up pb-24 px-4 md:px-0">

      <div id="kotodama-result-container" className="bg-[#fffcf8] shadow-2xl rounded-3xl md:rounded-[1rem] overflow-hidden border-4 md:border-8 border-[#efe2d5] relative">
        <div className="absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 border-t-2 border-l-2 border-[#d47255] opacity-40"></div>
        <div className="absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-[#d47255] opacity-40"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-[#d47255] opacity-40"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 md:w-12 md:h-12 border-b-2 border-r-2 border-[#d47255] opacity-40"></div>

        <div className="p-3 md:p-16">
          <header className="text-center mb-8 md:mb-20 pdf-section bg-white border-b-4 border-double border-[#efe2d5] py-6 md:py-16 flex flex-col items-center" data-idx="0">
            {/* 解説ボタン：高コントラストかつ太字で視認性を調整 */}
            <div className="mb-4 md:mb-14">
              <a
                ref={linkRef}
                href={EXPLANATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#b44c2c] text-white rounded-full hover:bg-[#8e3a21] transition-all font-mincho font-extrabold text-sm md:text-xl shadow-[0_10px_20px_-5px_rgba(180,76,44,0.4)] group transform hover:-translate-y-1 ring-4 ring-[#b44c2c]/10 h-14 md:h-[72px] px-6 md:px-12 leading-none"
              >
                <div className="flex items-center justify-center explanation-btn-inner">
                  <span className="leading-none">【解説】 エレメント鑑定書の見方</span>
                </div>
              </a>
              <p className="mt-4 text-[10px] md:text-xs text-[#a09388] font-bold font-serif tracking-widest animate-pulse uppercase">
                Guide to Reading Your Element Reading
              </p>
            </div>

            <h1 className="text-2xl md:text-6xl font-mincho font-bold text-[#3e3a36] leading-tight mb-4 px-2">
              {result.lastName === result.firstName ? result.lastName : `${result.lastName} ${result.firstName}`} <span className="text-lg md:text-2xl font-normal text-[#6d645e]">様の診断結果</span>
            </h1>
          </header>

          <section className="mb-16 md:mb-24 pdf-section" data-idx="1">
            <h2 className="text-base md:text-2xl font-mincho font-bold text-[#3e3a36] mb-6 md:mb-12 flex items-center justify-center tracking-[0.2em] md:tracking-[0.4em]">
              <span className="w-8 md:w-16 h-[1px] bg-[#d47255]/30 mr-4 md:mr-6"></span>
              五大エレメント表
              <span className="w-8 md:w-16 h-[1px] bg-[#d47255]/30 ml-4 md:ml-6"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <ElementPieChart scores={result.lastNameScores} title="姓のエレメント" />
              <ElementPieChart scores={result.firstNameScores} title="名のエレメント" />
            </div>
          </section>

          <section className="mb-20">
            <div className="pdf-section mb-6 md:mb-12 text-center" data-idx="2">
              <h2 className="text-xl md:text-3xl font-mincho font-bold text-[#3e3a36] inline-block border-b-2 border-[#d47255] pb-2 tracking-[0.2em]">
                各ひらがなの解説
              </h2>
            </div>

            <div className="space-y-8 md:space-y-20">
              {result.reading.characterAnalyses.map((analysis, idx) => {
                const detail = result.details.find(d => d.char === analysis.char);
                const charConfig = detail ? ELEMENTS_CONFIG[detail.element] : config;

                return (
                  <div key={idx} className="bg-white border-2 border-[#efe2d5] pdf-section overflow-hidden rounded-2xl md:rounded-none" data-idx={3 + idx}>
                    <div className={`p-4 md:p-12 ${charConfig.bgColor} border-b-2 ${charConfig.borderColor} flex flex-col md:flex-row items-center gap-3 md:gap-16`}>

                      <div className="flex-shrink-0 flex items-center justify-center w-[80px] h-[80px] md:w-[220px] md:h-[220px]">
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

                      <div className="flex flex-col gap-2 md:gap-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start">
                          <span className={`font-bold text-[10px] md:text-sm tracking-[0.2em] md:tracking-[0.4em] ${charConfig.textColor} uppercase`}>
                            ● {detail?.element}のエレメント
                          </span>
                        </div>
                        <h3 className="text-lg md:text-5xl font-bold text-[#3e3a36] font-mincho tracking-wider leading-tight">
                          {analysis.symbol}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 md:p-16 space-y-6 md:space-y-12 bg-white">
                      <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-8">
                        <div className="md:col-span-3">
                          <dt className={`font-bold text-[10px] md:text-xs ${charConfig.textColor} font-serif tracking-[0.2em] md:tracking-[0.4em] uppercase border-l-4 border-current pl-3 md:pl-4`}>
                            Nature<br className="hidden md:block" /><span className="md:hidden"> </span>性質
                          </dt>
                        </div>
                        <div className="md:col-span-9">
                          <dd className="text-[#3e3a36] text-sm md:text-xl leading-[1.7] md:leading-[2] font-mincho">
                            {analysis.nature}
                          </dd>
                        </div>
                      </div>

                      <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-8">
                        <div className="md:col-span-3">
                          <dt className={`font-bold text-[10px] md:text-xs ${charConfig.textColor} font-serif tracking-[0.2em] md:tracking-[0.4em] uppercase border-l-4 border-current pl-3 md:pl-4`}>
                            Talent<br className="hidden md:block" /><span className="md:hidden"> </span>才能
                          </dt>
                        </div>
                        <div className="md:col-span-9">
                          <dd className="text-[#6d645e] text-sm md:text-xl leading-[1.7] md:leading-[2]">
                            {analysis.talent}
                          </dd>
                        </div>
                      </div>

                      <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-8">
                        <div className="md:col-span-3">
                          <dt className={`font-bold text-[10px] md:text-xs ${charConfig.textColor} font-serif tracking-[0.2em] md:tracking-[0.4em] uppercase border-l-4 border-current pl-3 md:pl-4`}>
                            Caution<br className="hidden md:block" /><span className="md:hidden"> </span>戒め
                          </dt>
                        </div>
                        <div className="md:col-span-9">
                          <dd className="text-[#6d645e] text-sm md:text-xl leading-[1.7] md:leading-[2]">
                            {analysis.caution}
                          </dd>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-12 p-1 bg-[#fffcf5] border border-[#efe2d5]">
                        <div className="border-2 border-double border-[#d47255]/40 p-5 md:p-10 bg-white text-center">
                          <dt className="font-bold text-sm md:text-xl mb-3 md:mb-6 text-[#b44c2c] flex items-center justify-center font-mincho tracking-[0.1em] md:tracking-[0.3em]">
                            <span className="w-4 md:w-8 h-[1px] bg-[#b44c2c]/30 mr-3 md:mr-4"></span>
                            開運之導
                            <span className="w-4 md:w-8 h-[1px] bg-[#b44c2c]/30 ml-3 md:ml-4"></span>
                          </dt>
                          <dd className="text-[#3e3a36] text-sm md:text-2xl leading-relaxed font-mincho italic px-1 md:px-4">
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

          <section className="pdf-section mt-6 md:mt-32" data-idx={3 + result.reading.characterAnalyses.length}>
            <div className="bg-white border-t-8 border-[#3e3a36] p-4 md:p-24 relative shadow-inner rounded-b-2xl md:rounded-b-none">
              <div className="absolute top-0 right-6 md:right-10 w-12 h-12 md:w-24 md:h-24 border-r-2 border-b-2 border-[#d47255]/20"></div>
              <div className="mb-6 md:mb-12">
                <span className="text-[#b44c2c] font-bold text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.5em] block mb-2 md:mb-4">— 結び —</span>
                <h3 className={`text-base md:text-4xl font-bold font-mincho ${config.textColor} tracking-widest leading-tight`}>
                  {result.reading.summaryTitle}
                </h3>
              </div>
              <p className="text-[#3e3a36] leading-relaxed font-mincho text-justify text-sm md:text-lg border-l-4 border-[#efe2d5] pl-4 md:pl-10">
                {result.reading.summaryText}
              </p>
              <div className="mt-8 md:mt-20 text-right">
                <div className="inline-block p-2 md:p-4 border-4 border-double border-[#b44c2c] text-[#b44c2c] font-mincho font-bold text-sm md:text-2xl rotate-[-5deg]">
                  名前のエレメント鑑定書
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-12 md:mt-20 flex flex-col items-center gap-6 md:gap-10 no-print">
        <div className="w-full max-w-md flex flex-col gap-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`w-full flex flex-col items-center gap-2 px-6 py-5 md:px-10 md:py-8 font-mincho font-bold text-white shadow-2xl transition-all duration-500 rounded-xl ${isDownloading ? 'bg-[#dcd3cb] cursor-wait' : 'bg-[#3e3a36] hover:bg-[#1a1816] hover:-translate-y-2'
              }`}
          >
            <span className="text-base md:text-2xl tracking-[0.1em] md:tracking-[0.2em]">
              {isDownloading
                ? '鑑定書作成中...'
                : (isMobile ? '鑑定書をPDFで保存' : '鑑定書を保存する')}
            </span>
            <span className="text-[10px] md:text-xs font-serif font-normal opacity-70">
              Save your destiny as PDF
            </span>
          </button>
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
