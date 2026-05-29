// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";

function getShortName(fullName) {
  if (fullName.includes("为")) return fullName.split("为")[0];
  return fullName.slice(2);
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Result() {
  const [data, setData] = useState(null);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [activeScheme, setActiveScheme] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const shareRef = useRef(null);

  useEffect(() => {
    fetch("/colorSchemes.json")
      .then((r) => r.json())
      .then((data) => setColorSchemes(data));

    // 先检查是否有完整的结果（从了解更多页返回）
    const saved = sessionStorage.getItem("divinationResult");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setData(d);
        extractScheme(d.result);
        sessionStorage.removeItem("divinationResult");
        return;
      } catch(e) {}
    }

    // 检查是否有待处理的占卜（刚点击起卦）
    const pending = sessionStorage.getItem("divinationPending");
    if (pending) {
      try {
        const p = JSON.parse(pending);
        sessionStorage.removeItem("divinationPending");
        // 设置初始数据（显示卦名+加载中）
        setData({ calcResult: p.calcResult, question: p.question, result: "" });
        setStreaming(true);
        // 调用 API 流式加载
        doStreamDivination(p.calcResult, p.question);
      } catch(e) {}
    }
  }, []);

  function extractScheme(text) {
    const schemeMatch = text.match(/【配色：(.+?)】/);
    if (schemeMatch) {
      const name = schemeMatch[1].trim();
      fetch("/colorSchemes.json")
        .then((r) => r.json())
        .then((schemes) => {
          const found = schemes.find(s => s.name === name);
          if (found) setActiveScheme(found);
        });
    }
  }

  async function doStreamDivination(calcResult, question) {
    try {
      const response = await fetch("/api/divine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hexagram: calcResult.hexagram, yao: calcResult.yao, question }),
      });

      if (!response.ok) throw new Error(`服务器响应异常 (${response.status})`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResult = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const cleaned = chunk.split("\n").filter(l => l.startsWith("data: ")).map(l => {
          try { return JSON.parse(l.replace("data: ", "")).choices?.[0]?.delta?.content || ""; }
          catch { return ""; }
        }).join("");
        fullResult += cleaned;
        // 提取配色（不进入显示文本）
        const schemeMatch = fullResult.match(/【配色：(.+?)】/);
        if (schemeMatch) {
          const name = schemeMatch[1].trim();
          const found = colorSchemes.find(s => s.name === name);
          if (found) setActiveScheme(found);
        }
        // 剥离配色标签后更新显示文本
        const displayResult = fullResult.replace(/【配色：?.+?】\s*$/m, "").trim();
        setData(prev => ({ ...prev, result: displayResult }));
      }

      // 流结束，确保最终文本不含配色标签
      const finalResult = fullResult.replace(/【配色：?.+?】\s*$/m, "").trim();
      setData(prev => ({ ...prev, result: finalResult }));
      extractScheme(fullResult);
    } catch (err) {
      setData(prev => ({ ...prev, result: "占卜暂时中断，请稍后再试：" + err.message }));
    }
    setStreaming(false);
  }

  function parseResult(text) {
    if (!text) return { keyword: "", scentMetaphor: "", fortune: "", ingredients: "", perfume: "", scheme: null };
    const schemeMatch = text.match(/【配色：?(.+?)】/);
    const schemeName = schemeMatch ? schemeMatch[1].trim() : null;
    const scheme = schemeName ? colorSchemes.find(s => s.name === schemeName) || null : null;
    const cleanText = text.replace(/【配色：?.+?】\s*$/, "").trim();
    const keywordMatch = cleanText.match(/香气关键词[：:]([\s\S]*?)(?=\n\n|$)/);
    const keyword = keywordMatch ? keywordMatch[1].trim() : "";
    const bodyMatch = cleanText.match(/(?:香气关键词[：:].*?\n\n?)([\s\S]*?)(?:\n*核心原料|$)/);
    const bodyText = bodyMatch ? bodyMatch[1].trim() : "";
    const paragraphs = bodyText.split(/\n\n+/).filter(p => p.trim());
    const scentMetaphor = paragraphs.length > 0 ? paragraphs[0].trim() : "";
    const fortune = paragraphs.length > 1 ? paragraphs.slice(1).join("\n\n").trim() : "";
    const ingredMatch = cleanText.match(/核心原料[：:]?([\s\S]*?)(?=\n*香水推荐|$)/);
    const ingredients = ingredMatch ? ingredMatch[1].trim() : "";
    const perfumeMatch = cleanText.match(/香水推荐[：:]?([\s\S]*$)/);
    const perfume = perfumeMatch ? perfumeMatch[1].trim() : "";
    return { keyword, scentMetaphor, fortune, ingredients, perfume, scheme };
  }

  // 生成分享图
  async function downloadShareImage() {
    if (!shareRef.current) return;
    const el = shareRef.current;
    try {
      const dataUrl = await toPng(el, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `未闻_${getShortName(data.calcResult.hexagram)}卦_${data.calcResult.yao}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("生成分享图失败", err);
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "url('/paper-texture.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
        <p className="text-gray-400">没有占卜结果，请先起卦</p>
        <a href="/divine" className="ml-3 px-4 py-2 text-sm rounded-lg bg-gray-800 text-white">去占卜</a>
      </div>
    );
  }

  const p = parseResult(data.result);

  // 流式加载中 - 显示卦名和加载动画
  if (streaming && !data.result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "url('/paper-texture.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}>
        <div className="text-center mb-6">
          <div className="mt-6 text-sm animate-pulse" style={{color: "#9ca3af", opacity: 0.7}}>
            正在解读中...
          </div>
        </div>
      </div>
    );
  }

    const bgColor = activeScheme ? activeScheme.bg : '#faf8f5';
    const mainBg = {
      backgroundImage: `linear-gradient(${hexToRgba(bgColor, 0.5)}, ${hexToRgba(bgColor, 0.5)}), url('/paper-texture.png')`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };

    return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `}</style>
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-20 min-h-screen transition-colors duration-700"
      style={{
        ...mainBg,
        color: activeScheme ? activeScheme.text : "#2d2d2d",
        paddingTop: "max(3rem, env(safe-area-inset-top))",
        paddingBottom: "max(3rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {/* 标题区 */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl mb-3" style={{color: "#444", letterSpacing: "0.5em", fontFamily: "'Ma Shan Zheng', cursive"}}>未闻</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10">命运不可见，但可以闻见</p>
      </div>

      {/* 卡片窄容器 */}
      <div className="max-w-xl mx-auto w-full">

      {/* 计算结果 */}
      <div className="mb-8 p-6 sm:p-8 rounded-xl text-center transition-colors duration-500"
        style={{background: activeScheme ? activeScheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)", animation: "fadeIn 0.7s ease-out"}}>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-wider mb-2" style={{color: activeScheme ? activeScheme.text : "#1f2937"}}>
          {getShortName(data.calcResult.hexagram)}卦 · {data.calcResult.yao}
        </h2>
      </div>

      {/* AI结果 */}
      <div className="space-y-6 mb-8" style={{animation: "fadeIn 0.6s ease-out 0.3s both"}}>
        {p.keyword && (
          <div className="p-4 sm:p-5 rounded-xl" style={{background: p.scheme ? p.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)"}}>
            <h3 className="text-base font-bold mb-3" style={{color: p.scheme ? p.scheme.text : "#1f2937"}}>香气关键词</h3>
            <div style={{display: "flex", gap: "10px", flexWrap: "wrap"}}>
              {p.keyword.split("·").map((kw, i) => (
                <div key={i} style={{padding: "6px 14px", border: "1px solid", borderColor: p.scheme ? p.scheme.text : "#999", fontSize: "14px", fontWeight: 500, whiteSpace: "nowrap", color: p.scheme ? p.scheme.text : "#374151", animation: `popIn 0.4s ease-out ${0.5 + i * 0.15}s both`}}>
                  {kw.trim()}
                </div>
              ))}
            </div>
          </div>
        )}

        {p.scentMetaphor && (
          <div className="p-4 sm:p-5 rounded-xl" style={{background: p.scheme ? p.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)"}}>
            <h3 className="text-base font-bold mb-3" style={{color: p.scheme ? p.scheme.text : "#1f2937"}}>香气隐喻</h3>
            <div className="text-base leading-loose whitespace-pre-wrap" style={{color: p.scheme ? p.scheme.text : "#4b5563"}}>
              {p.scentMetaphor.split("\n\n").map((para, i) => (<div key={i} style={{textIndent: "2em"}}>{para.trim()}</div>))}
            </div>
          </div>
        )}

        {p.fortune && (
          <div className="p-4 sm:p-5 rounded-xl" style={{background: p.scheme ? p.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)"}}>
            <h3 className="text-base font-bold mb-3" style={{color: p.scheme ? p.scheme.text : "#1f2937"}}>运势解析</h3>
            <div className="text-base leading-loose whitespace-pre-wrap" style={{color: p.scheme ? p.scheme.text : "#4b5563"}}>
              {p.fortune.split("\n\n").map((para, i) => (<div key={i} style={{textIndent: "2em"}}>{para.trim()}</div>))}
            </div>
          </div>
        )}

        {p.ingredients && (
          <div className="p-4 sm:p-5 rounded-xl" style={{background: p.scheme ? p.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)"}}>
            <h3 className="text-base font-bold mb-3" style={{color: p.scheme ? p.scheme.text : "#1f2937"}}>核心原料</h3>
            <div className="text-base leading-relaxed whitespace-pre-wrap" style={{color: p.scheme ? p.scheme.text : "#4b5563"}}>{p.ingredients}</div>
          </div>
        )}

        {p.perfume && (
          <div className="p-4 sm:p-5 rounded-xl" style={{background: p.scheme ? p.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)"}}>
            <h3 className="text-base font-bold mb-3" style={{color: p.scheme ? p.scheme.text : "#1f2937"}}>香水推荐</h3>
            <div className="text-base leading-relaxed whitespace-pre-wrap" style={{color: p.scheme ? p.scheme.text : "#4b5563"}}>{p.perfume}</div>
          </div>
        )}
      </div>

      {/* 按钮区 */}
      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={downloadShareImage}
          className="px-6 py-3 text-sm rounded-lg border transition-colors"
          style={{borderColor: activeScheme ? activeScheme.text : "#d1d5db", color: activeScheme ? activeScheme.text : "#374151"}}>
          生成分享图
        </button>
        <a href="/divine"
          className="inline-block px-6 py-3 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors">
          再测一次
        </a>
      </div>

      {/* 了解更多板块 */}
      <div className="mt-10">
        <h3 className="text-xs font-semibold mb-4 tracking-[0.25em]" style={{color: activeScheme ? activeScheme.text : "#8B8177", opacity: 0.6}}>
          了解更多
        </h3>
        <div className="space-y-3">
          <a href="/learn-more/divination"
            className="block transition-all duration-200"
            style={{color: activeScheme ? activeScheme.text : "#5C534A", fontSize: "16px", fontWeight: 700, lineHeight: 1.7}}
            onMouseOver={e => e.target.style.opacity = 0.7}
            onMouseOut={e => e.target.style.opacity = 1}
            onClick={() => sessionStorage.setItem("divinationResult", JSON.stringify(data))}>
            <span style={{opacity: 0.5, marginRight: 8}}>→</span>
            想知道怎样用三个三位数算出一卦？
          </a>
          <a href="/learn-more/perfume"
            className="block transition-all duration-200"
            style={{color: activeScheme ? activeScheme.text : "#5C534A", fontSize: "16px", fontWeight: 700, lineHeight: 1.7}}
            onMouseOver={e => e.target.style.opacity = 0.7}
            onMouseOut={e => e.target.style.opacity = 1}
            onClick={() => sessionStorage.setItem("divinationResult", JSON.stringify(data))}>
            <span style={{opacity: 0.5, marginRight: 8}}>→</span>
            想制作专属于你的周易卦象香水？
          </a>
        </div>
      </div>
      </div>

      {/* 隐藏的分享卡片 */}
      {(() => {
        const cardBgColor = p.scheme ? p.scheme.card : "#faf8f5";
        const cardStyle = {
          width: "600px", minHeight: "800px", padding: "48px",
          backgroundImage: `linear-gradient(${hexToRgba(cardBgColor, 0.5)}, ${hexToRgba(cardBgColor, 0.5)}), url('/paper-texture.png')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          color: p.scheme ? p.scheme.text : "#2d2d2d",
          fontFamily: '"Noto Serif SC", "SimSun", serif',
          display: "flex", flexDirection: "column", boxSizing: "border-box",
        };
        return (
          <div style={{position: "absolute", top: "-9999px", left: 0, width: "600px"}}>
            <div ref={shareRef} style={cardStyle}>
              <div style={{fontSize: "13px", opacity: 0.6, letterSpacing: "3px", marginBottom: "32px", textAlign: "center"}}>未闻</div>
              <div style={{fontSize: "40px", fontWeight: 700, letterSpacing: "2px", marginBottom: "40px", textAlign: "center"}}>
                {getShortName(data.calcResult.hexagram)}卦 · {data.calcResult.yao}
              </div>
              <div style={{width: "40px", height: "1px", background: p.scheme ? p.scheme.text : "#999", opacity: 0.4, marginBottom: "32px", alignSelf: "center"}} />
              {p.keyword && (
                <>
                  <div style={{fontSize: "12px", fontWeight: 600, letterSpacing: "2px", marginBottom: "10px", textAlign: "center"}}>香气关键词</div>
                  <div style={{display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px", flexWrap: "nowrap"}}>
                    {p.keyword.split("·").map((kw, i) => (
                      <div key={i} style={{padding: "8px 16px", border: "1px solid", borderColor: p.scheme ? p.scheme.text : "#999", fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", flex: "0 0 auto"}}>
                        {kw.trim()}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {(p.scentMetaphor || p.fortune) && (
                <div style={{fontSize: "16px", lineHeight: 1.8, marginBottom: "32px", whiteSpace: "pre-wrap", textIndent: "2em"}}>
                  {(p.scentMetaphor || p.fortune).split("\n\n")[0].substring(0, 200)}
                </div>
              )}
              {p.ingredients && (
                <>
                  <div style={{fontSize: "12px", fontWeight: 600, letterSpacing: "2px", marginBottom: "10px", textAlign: "center"}}>核心原料</div>
                  <div style={{fontSize: "16px", lineHeight: 1.7, whiteSpace: "pre-wrap"}}
                    dangerouslySetInnerHTML={{
                      __html: p.ingredients.split("\n").filter(l => l.trim()).map(line => {
                        const m = line.match(/^(.+?)（(.+?)）$/);
                        return m ? `<strong>${m[1]}</strong>（${m[2]}）` : line;
                      }).join("<br>"),
                    }}
                  />
                </>
              )}
              <div style={{flex: 1}} />
              <div style={{fontSize: "11px", opacity: 0.5, letterSpacing: "3px", textAlign: "center", marginTop: "24px", borderTop: "0.5px solid", borderColor: p.scheme ? p.scheme.text : "#999", paddingTop: "16px"}}>
                命运不可见，但可以闻见
              </div>
            </div>
          </div>
        );
      })()}

      {/* 底部版权 */}
      <div className="text-center mt-16 mb-8">
        <div style={{fontSize: "11px", opacity: 0.4, letterSpacing: "1px", lineHeight: "2", color: "#8B8177"}}>
          <p>这里的答案更像一缕香气，飘过即可，不必当作命运的说明书。</p>
          <p>© 2026 I Ching × Perfume Mapping · Created by Bastet</p>
          <p>原创作品 · 抄袭必究</p>
        </div>
      </div>
    </div>
    </>
  );
}
