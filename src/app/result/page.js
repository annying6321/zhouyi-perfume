// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

import { useState, useEffect } from "react";
import ErrorBoundary from "../components/ErrorBoundary";

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

// 模块级配色方案缓存（避免依赖 React 异步状态）
let schemesCache = null;
async function getSchemes() {
  if (schemesCache) return schemesCache;
  const res = await fetch("/colorSchemes.json");
  schemesCache = await res.json();
  return schemesCache;
}
// 立即开始加载
getSchemes();

export default function Result() {
  const [data, setData] = useState(null);
  const [activeScheme, setActiveScheme] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // Toast 自动消失
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    // 检查是否有完整的结果（从了解更多页返回）
    const saved = sessionStorage.getItem("divinationResult");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setData(d.data);
        // 直接恢复配色对象（不依赖 schemesCache）
        if (d.scheme) setActiveScheme(d.scheme);
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
      const found = (schemesCache || []).find(s => s.name === name);
      if (found) setActiveScheme(found);
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
        // 提取配色（中间不更新显示文本，只提取配色切换背景）
        const schemeMatch = fullResult.match(/【配色：(.+?)】/);
        if (schemeMatch) {
          const name = schemeMatch[1].trim();
          const found = (schemesCache || []).find(s => s.name === name);
          if (found) setActiveScheme(found);
        }
      }

      // 流结束，剥离配色标签后一次性设置结果
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
    const scheme = schemeName ? (schemesCache || []).find(s => s.name === schemeName) || null : null;
    const cleanText = text.replace(/【配色：?.+?】\s*$/, "").trim();
    const keywordMatch = cleanText.match(/香气关键词[：:]([\s\S]*?)(?=\n\n|$)/);
    const keyword = keywordMatch ? keywordMatch[1].trim() : "";
    const bodyMatch = cleanText.match(/(?:香气关键词[：:].*?\n\n?)([\s\S]*?)(?:\n*核心原料|$)/);
    const bodyText = bodyMatch ? bodyMatch[1].trim() : "";
    const paragraphs = bodyText.split(/\n\n+/).filter(p => p.trim());
    // 去掉可能的前缀标题
    const scentMetaphorRaw = paragraphs.length > 0 ? paragraphs[0].trim() : "";
    const scentMetaphor = scentMetaphorRaw.replace(/^香气隐喻[：:]\s*/, "").trim();
    const fortuneRaw = paragraphs.length > 1 ? paragraphs.slice(1).join("\n\n").trim() : "";
    const fortune = fortuneRaw.replace(/^运势解析[：:]\s*/, "").trim();
    const ingredMatch = cleanText.match(/核心原料[：:]?([\s\S]*?)(?=\n*香水推荐|$)/);
    const ingredientsRaw = ingredMatch ? ingredMatch[1].trim() : "";
    const ingredients = ingredientsRaw.replace(/^核心原料[：:]\s*/, "").trim();
    const perfumeMatch = cleanText.match(/香水推荐[：:]?([\s\S]*$)/);
    const perfumeRaw = perfumeMatch ? perfumeMatch[1].trim() : "";
    const perfume = perfumeRaw.replace(/^香水推荐[：:]\s*/, "").trim();
    return { keyword, scentMetaphor, fortune, ingredients, perfume, scheme };
  }

// ===== Canvas 分享图生成（pixelRatio = 1.5 优化版） =====
const CANVAS_SCALE = 1.5;

// 在 Canvas 上模拟 letter-spacing（逐字符绘制，支持 textAlign: center）
function fillTextWithSpacing(ctx, text, x, y, spacing) {
  if (!spacing || spacing <= 0) {
    ctx.fillText(text, x, y);
    return;
  }
  // 计算总宽度，用于居中修正
  let totalW = 0;
  for (const char of text) {
    totalW += ctx.measureText(char).width + spacing;
  }
  totalW -= spacing;
  let curX = ctx.textAlign === 'center' ? x - totalW / 2 : x;
  ctx.save();
  ctx.textAlign = 'left';
  for (const char of text) {
    ctx.fillText(char, curX, y);
    curX += ctx.measureText(char).width + spacing;
  }
  ctx.restore();
}

// 自动换行 + 首行缩进
function wrapText(ctx, text, maxWidth) {
  const paragraphs = text.split('\n');
  const lines = [];
  for (const para of paragraphs) {
    let line = '';
    for (const char of para) {
      const testLine = line + char;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        lines.push(line);
        line = char;
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
    lines.push('');
  }
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

// 绘制香气关键词标签（带边框）
function drawTags(ctx, tags, cx, y, tagColor, fontSize) {
  const gap = 12, padX = 16, tagHeight = 30;
  ctx.font = `${fontSize}px "Noto Serif SC", "SimSun", serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const widths = tags.map(t => ctx.measureText(t.trim()).width);
  let totalW = widths.reduce((s, w) => s + w + padX * 2 + gap, 0) - gap;
  let x = cx - totalW / 2;
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i].trim();
    const bw = widths[i] + padX * 2;
    ctx.strokeStyle = tagColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y - tagHeight / 2, bw, tagHeight);
    ctx.fillStyle = tagColor;
    ctx.fillText(tag, x + padX, y);
    x += bw + gap;
  }
}

// 绘制原料行（同时支持新格式【原料名】解释 和 旧格式 原料名（解释））
function drawIngredients(ctx, lines, x, y, color, maxWidth, lineHeight) {
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  let curY = y;
  for (const line of lines) {
    const newMatch = line.match(/^【(.+?)】(.+)$/);
    const oldMatch = line.match(/^(.+?)（(.+?)）$/);
    if (newMatch) {
      const name = `【${newMatch[1]}】`;
      const desc = newMatch[2].trim();
      ctx.font = `bold 20px "Noto Serif SC", "SimSun", serif`;
      const nameW = ctx.measureText(name).width;
      ctx.fillStyle = color;
      ctx.fillText(name, x, curY);
      ctx.font = `16px "Noto Serif SC", "SimSun", serif`;
      ctx.fillText(desc, x + nameW + 6, curY);
    } else if (oldMatch) {
      const nameStr = oldMatch[1].trim() + '（';
      const descStr = oldMatch[2] + '）';
      ctx.font = `bold 20px "Noto Serif SC", "SimSun", serif`;
      const nameW = ctx.measureText(nameStr).width;
      ctx.fillStyle = color;
      ctx.fillText(nameStr, x, curY);
      ctx.font = `16px "Noto Serif SC", "SimSun", serif`;
      ctx.fillText(descStr, x + nameW + 6, curY);
    } else {
      ctx.font = `16px "Noto Serif SC", "SimSun", serif`;
      ctx.fillStyle = color;
      ctx.fillText(line.trim(), x, curY);
    }
    curY += lineHeight;
    if (curY > 720) break;
  }
  return curY;
}

// 主绘制函数
async function drawShareCard(data, p, scheme) {
  const LOGICAL_W = 600, LOGICAL_H = 800;
  const margin = 48;
  const textColor = scheme ? scheme.text : '#2d2d2d';
  const cardBg = scheme ? scheme.card : '#faf8f5';
  const contentWidth = LOGICAL_W - margin * 2;
  const fontFamily = '"Noto Serif SC", "SimSun", serif';

  const canvas = document.createElement('canvas');
  canvas.width = LOGICAL_W * CANVAS_SCALE;
  canvas.height = LOGICAL_H * CANVAS_SCALE;
  const ctx = canvas.getContext('2d');
  ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

  // 背景色
  ctx.fillStyle = cardBg;
  ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

  // 叠加纸张纹理
  try {
    const img = new Image();
    await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; img.src = '/paper-texture.png'; });
    if (img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.drawImage(img, 0, 0, LOGICAL_W, LOGICAL_H);
      ctx.restore();
    }
  } catch (e) { /* 忽略 */ }

  let curY = margin;

  // "未闻" — 13px, opacity 0.6, letterSpacing 2px
  ctx.font = `13px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = textColor;
  ctx.save();
  ctx.globalAlpha = 0.6;
  fillTextWithSpacing(ctx, '未闻', LOGICAL_W / 2, curY, 2);
  ctx.restore();
  curY += 13 + 32;

  // 卦名 · 爻位 — 40px, bold, letterSpacing 2px
  ctx.font = `bold 40px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = textColor;
  const titleText = `${getShortName(data.calcResult.hexagram)}卦 · ${data.calcResult.yao}`;
  fillTextWithSpacing(ctx, titleText, LOGICAL_W / 2, curY, 1);
  curY += 40 + 40;

  // 分割线 — 40px宽, 1px高
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(LOGICAL_W / 2 - 20, curY);
  ctx.lineTo(LOGICAL_W / 2 + 20, curY);
  ctx.stroke();
  ctx.restore();
  curY += 1 + 32;

  // 香气关键词标题 + 标签组
  if (p.keyword) {
    ctx.font = '12px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    fillTextWithSpacing(ctx, '香气关键词', LOGICAL_W / 2, curY, 1.5);
    curY += 12 + 48;
    const tags = p.keyword.split('·').filter(t => t.trim());
    drawTags(ctx, tags, LOGICAL_W / 2, curY, textColor, 13);
    curY += 30 + 60;
  }

  // 正文 — 16px, lineHeight 1.8, 首行缩进2em, 最多200字
  const bodyText = (p.scentMetaphor || p.fortune || '').split('\n\n')[0].substring(0, 200);
  if (bodyText) {
    ctx.font = `16px ${fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = textColor;
    const indentWidth = 32;
    const lines = wrapText(ctx, bodyText, contentWidth - indentWidth);
    const lineHeight = 29;
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i]) { curY += lineHeight * 0.5; continue; }
      if (curY > 700) break;
      ctx.fillText(lines[i], margin + (i === 0 ? indentWidth : 0), curY);
      curY += lineHeight;
    }
    curY += 32;
  }

  // 核心原料（下移两行）
  if (p.ingredients) {
    curY += 54;
    const ingredLines = p.ingredients.split('\n').filter(l => l.trim());
    if (ingredLines.length > 0) {
      ctx.font = '12px "Noto Serif SC", "SimSun", serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      fillTextWithSpacing(ctx, '核心原料', LOGICAL_W / 2, curY, 1.5);
      curY += 12 + 24;
      curY = drawIngredients(ctx, ingredLines, margin, curY, textColor, contentWidth, 27);
    }
  }

  // 底部标语 + border-top
  curY = LOGICAL_H - 16 - 11 - 24;
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = textColor;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(margin, curY);
  ctx.lineTo(LOGICAL_W - margin, curY);
  ctx.stroke();
  ctx.restore();
  curY += 16;

  ctx.font = `11px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = textColor;
  ctx.save();
  ctx.globalAlpha = 0.5;
  fillTextWithSpacing(ctx, '命运不可见，但可以闻见', LOGICAL_W / 2, curY, 2);
  ctx.restore();

  return canvas;
}

// 下载分享图
async function downloadShareImage() {
  if (!data || !data.result || sharing) return;
  setSharing(true);
  setToast({ message: '正在生成分享图...', type: 'info' });

  try {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    try {
      await Promise.race([
        document.fonts.load('16px "Noto Serif SC"'),
        document.fonts.load('40px "Noto Serif SC"'),
        new Promise(resolve => setTimeout(resolve, isMobile ? 500 : 2000)),
      ]);
    } catch (e) { /* 字体加载超时，使用回退字体 */ }

    const canvas = await drawShareCard(data, p, activeScheme);

    if (isMobile) {
      const dataUrl = canvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`<img src="${dataUrl}" style="max-width:100%" /><p>长按图片保存</p>`);
      } else {
        window.location.href = dataUrl;
      }
      setToast({ message: '分享图已生成，请长按保存', type: 'success' });
    } else {
      canvas.toBlob(blob => {
        if (!blob) {
          setToast({ message: '分享图生成失败，请尝试截图', type: 'error' });
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `未闻_${getShortName(data.calcResult.hexagram)}卦_${data.calcResult.yao}.png`;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        setToast({ message: '分享图已保存', type: 'success' });
      }, 'image/png', 0.95);
    }
  } catch (err) {
    console.error('生成分享图失败', err);
    setToast({ message: '分享图生成失败，请尝试截图', type: 'error' });
  }
  setSharing(false);
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

  // 流式加载中 - 只显示脉冲文字"正在解读中..."，配色获取后切换背景
  if (streaming) {
    const bgColor = activeScheme ? activeScheme.bg : '#faf8f5';
    return (
      <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-6 sm:px-10 py-16 sm:py-20 min-h-screen flex items-start justify-center"
        style={{
          backgroundImage: `linear-gradient(${hexToRgba(bgColor, 0.5)}, ${hexToRgba(bgColor, 0.5)}), url('/paper-texture.png')`,
          backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
          color: activeScheme ? activeScheme.text : "#2d2d2d",
        }}>
        <div className="text-center" style={{marginTop: "20vh"}}>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wider mb-6">
            {getShortName(data.calcResult.hexagram)}卦 · {data.calcResult.yao}
          </h2>
          <div className="text-sm animate-pulse" style={{color: "#9ca3af", opacity: 0.7}}>
            正在解读中...
          </div>
        </div>
      </div>
      </ErrorBoundary>
    );
  }

  // 流式加载完成 - 分段解析展示
  const bgColor = activeScheme ? activeScheme.bg : '#faf8f5';
  const mainBg = {
    backgroundImage: `linear-gradient(${hexToRgba(bgColor, 0.5)}, ${hexToRgba(bgColor, 0.5)}), url('/paper-texture.png')`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

    return (
    <ErrorBoundary>
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
        <button onClick={downloadShareImage} disabled={sharing}
          className="px-6 py-3 text-sm rounded-lg border transition-colors"
          style={{borderColor: activeScheme ? activeScheme.text : "#d1d5db", color: sharing ? "#9ca3af" : (activeScheme ? activeScheme.text : "#374151"), cursor: sharing ? "not-allowed" : "pointer", opacity: sharing ? 0.6 : 1}}>
          {sharing ? "生成中..." : "生成分享图"}
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
            onClick={() => sessionStorage.setItem("divinationResult", JSON.stringify({ data, scheme: activeScheme }))}>
            <span style={{opacity: 0.5, marginRight: 8}}>→</span>
            想知道怎样用三个三位数算出一卦？
          </a>
          <a href="/learn-more/perfume"
            className="block transition-all duration-200"
            style={{color: activeScheme ? activeScheme.text : "#5C534A", fontSize: "16px", fontWeight: 700, lineHeight: 1.7}}
            onMouseOver={e => e.target.style.opacity = 0.7}
            onMouseOut={e => e.target.style.opacity = 1}
            onClick={() => sessionStorage.setItem("divinationResult", JSON.stringify({ data, scheme: activeScheme }))}>
            <span style={{opacity: 0.5, marginRight: 8}}>→</span>
            想制作专属于你的周易卦象香水？
          </a>
        </div>
      </div>
      </div>

      {/* 底部版权 */}
      <div className="text-center mt-16 mb-8">
        <div style={{fontSize: "11px", opacity: 0.4, letterSpacing: "1px", lineHeight: "2", color: "#8B8177"}}>
          <p>这里的答案更像一缕香气，飘过即可，不必当作命运的说明书。</p>
          <p>© 2026 I Ching × Perfume Mapping · Created by Bastet</p>
          <p>原创作品 · 抄袭必究</p>
        </div>
      </div>
    </div>

      {/* Toast 通知 */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 24px",
            borderRadius: "10px",
            fontSize: "14px",
            color: "#fff",
            background: toast.type === "success" ? "rgba(22,163,74,0.92)" : toast.type === "error" ? "rgba(220,38,38,0.92)" : "rgba(107,114,128,0.92)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            zIndex: 999,
            animation: "fadeIn 0.3s ease-out",
            backdropFilter: "blur(8px)",
            letterSpacing: "0.5px",
          }}
          onClick={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}
    </>
    </ErrorBoundary>
  );
}
