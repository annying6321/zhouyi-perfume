"use client";

import { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";

// 先天八卦数字对应：乾1 兑2 离3 震4 巽5 坎6 艮7 坤8
const TRIGRAM_NAMES = ["", "乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];

// 爻位名称（从下往上）
const YAO_POSITIONS = ["初", "二", "三", "四", "五", "上"];

export default function Home() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [calcResult, setCalcResult] = useState(null);
  const [hexagramsData, setHexagramsData] = useState(null);
  const [colorSchemes, setColorSchemes] = useState([]);
  const [activeScheme, setActiveScheme] = useState(null);

  // 加载数据
  useEffect(() => {
    fetch("/hexagrams.json")
      .then((r) => r.json())
      .then((data) => setHexagramsData(data));
    fetch("/colorSchemes.json")
      .then((r) => r.json())
      .then((data) => setColorSchemes(data));
  }, []);

  // 数字卦计算
  function calculateGua(n1, n2, n3) {
    const upper = n1 % 8 || 8;   // 第一组 → 上卦（1-8）
    const lower = n2 % 8 || 8;   // 第二组 → 下卦（1-8）
    const changing = n3 % 6 || 6; // 第三组 → 变爻（1-6）

    // 先天八卦矩阵（按上卦×下卦排列：乾1兑2离3震4巽5坎6艮7坤8）
    const guaNames = [
      // 上乾(1)
      "乾为天", "泽天夬", "火天大有", "雷天大壮", "风天小畜", "水天需", "山天大畜", "地天泰",
      // 上兑(2)
      "天泽履", "兑为泽", "火泽睽", "雷泽归妹", "风泽中孚", "水泽节", "山泽损", "地泽临",
      // 上离(3)
      "天火同人", "泽火革", "离为火", "雷火丰", "风火家人", "水火既济", "山火贲", "地火明夷",
      // 上震(4)
      "天雷无妄", "泽雷随", "火雷噬嗑", "震为雷", "风雷益", "水雷屯", "山雷颐", "地雷复",
      // 上巽(5)
      "天风姤", "泽风大过", "火风鼎", "雷风恒", "巽为风", "水风井", "山风蛊", "地风升",
      // 上坎(6)
      "天水讼", "泽水困", "火水未济", "雷水解", "风水涣", "坎为水", "水山蹇", "地水师",
      // 上艮(7)
      "天山遁", "泽山咸", "火山旅", "雷山小过", "风山渐", "山水蒙", "艮为山", "地山谦",
      // 上坤(8)
      "天地否", "泽地萃", "火地晋", "雷地豫", "风地观", "水地比", "山地剥", "坤为地",
    ];

    const guaIndex = (lower - 1) * 8 + (upper - 1);
    const hexagram = guaNames[guaIndex];

    // 查找该爻的准确名称（如"初九""六二"）
    let yaoName = YAO_POSITIONS[changing - 1];
    if (hexagramsData) {
      const gua = hexagramsData.hexagrams.find((h) => h.name === hexagram);
      if (gua) {
        const yao = gua.yaos[changing - 1];
        if (yao) yaoName = yao.position;
      }
    }

    return {
      hexagram,
      yao: yaoName,
      upperName: TRIGRAM_NAMES[upper],
      lowerName: TRIGRAM_NAMES[lower],
      changing,
    };
  }

  // 获取简称
  function getShortName(fullName) {
    // 乾为天 → 乾, 水雷屯 → 屯, 坎为水 → 坎, 山水蒙 → 蒙
    if (fullName.includes("为")) return fullName.split("为")[0];
    // 取最后一个字作为简称（排除"为"的情况）
    return fullName.slice(-1);
  }

  // 限制输入为三位数（100-999）
  function handleNumberInput(value, setter) {
    const cleaned = value.replace(/\D/g, ""); // 只保留数字
    if (cleaned === "" || cleaned === "0") {
      setter("");
      return;
    }
    const num = parseInt(cleaned);
    if (num > 999) {
      setter("999");
    } else {
      setter(cleaned);
    }
  }

  async function doDivination() {
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);
    const n3 = parseInt(num3);
    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) return;
    if (n1 < 100 || n1 > 999 || n2 < 100 || n2 > 999 || n3 < 100 || n3 > 999) return;

    setLoading(true);
    setResult("");
    setCalcResult(null);
    setActiveScheme(null);

    const calced = calculateGua(n1, n2, n3);
    setCalcResult(calced);

    try {
      const response = await fetch("/api/divine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hexagram: calced.hexagram,
          yao: calced.yao,
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error(`服务器响应异常 (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const cleaned = chunk
          .split("\n")
          .filter((line) => line.startsWith("data: "))
          .map((line) => {
            try {
              const json = JSON.parse(line.replace("data: ", ""));
              return json.choices?.[0]?.delta?.content || "";
            } catch {
              return "";
            }
          })
          .join("");
        setResult((prev) => prev + cleaned);
      }
    } catch (err) {
      setResult("占卜暂时中断，请稍后再试：" + err.message);
    }

    setLoading(false);
  }

  // 当 result 变化时，提取配色方案
  useEffect(() => {
    if (!result) return;
    const schemeMatch = result.match(/【配色：(.+?)】/);
    if (schemeMatch) {
      const name = schemeMatch[1].trim();
      const found = colorSchemes.find(s => s.name === name);
      if (found) setActiveScheme(found);
    }
  }, [result, colorSchemes]);

  function resetAll() {
    setNum1(""); setNum2(""); setNum3("");
    setQuestion(""); setResult("");
    setCalcResult(null);
    setActiveScheme(null);
  }

  // 解析AI结果为板块，并提取配色方案
  function parseResult(text) {
    if (!text) return { keyword: "", scentMetaphor: "", fortune: "", ingredients: "", perfume: "", scheme: null };

    // 提取配色标签
    const schemeMatch = text.match(/【配色：?(.+?)】/);
    const schemeName = schemeMatch ? schemeMatch[1].trim() : null;
    const scheme = schemeName ? colorSchemes.find(s => s.name === schemeName) || null : null;

    // 移除配色标签
    const cleanText = text.replace(/【配色：?.+?】\s*$/, "").trim();

    // 香气关键词 — 兼容中英文冒号
    const keywordMatch = cleanText.match(/香气关键词[：:]([\s\S]*?)(?=\n\n|$)/);
    const keyword = keywordMatch ? keywordMatch[1].trim() : "";

    // 提取关键词与核心原料之间的文本
    const bodyMatch = cleanText.match(/(?:香气关键词[：:].*?\n\n?)([\s\S]*?)(?:\n*核心原料|$)/);
    const bodyText = bodyMatch ? bodyMatch[1].trim() : "";

    // 按双换行分隔段落：第一段=香气隐喻，剩余=运势解析
    const paragraphs = bodyText.split(/\n\n+/).filter(p => p.trim());
    const scentMetaphor = paragraphs.length > 0 ? paragraphs[0].trim() : "";
    const fortune = paragraphs.length > 1 ? paragraphs.slice(1).join("\n\n").trim() : "";

    // 核心原料
    const ingredMatch = cleanText.match(/核心原料[：:]?([\s\S]*?)(?=\n*香水推荐|$)/);
    const ingredients = ingredMatch ? ingredMatch[1].trim() : "";

    // 香水推荐
    const perfumeMatch = cleanText.match(/香水推荐[：:]?([\s\S]*$)/);
    const perfume = perfumeMatch ? perfumeMatch[1].trim() : "";

    return { keyword, scentMetaphor, fortune, ingredients, perfume, scheme };
  }

  const shareRef = useRef(null);

  // 生成分享图
  async function downloadShareImage() {
    if (!shareRef.current) return;
    const el = shareRef.current;

    try {
      const dataUrl = await toPng(el, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `未闻_${getShortName(calcResult.hexagram)}卦_${calcResult.yao}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("生成分享图失败", err);
    }
  }

  return (
    <>
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes popIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `}</style>
    <div 
      className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 min-h-screen transition-colors duration-700"
      style={{
        background: `${activeScheme ? activeScheme.bg : "#faf8f5"} repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,0,0,0.015) 1px,rgba(0,0,0,0.015) 2px),repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(0,0,0,0.01) 2px,rgba(0,0,0,0.01) 3px)`,
        color: activeScheme ? activeScheme.text : "#2d2d2d",
      }}
    >
      {/* 标题区 */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl mb-3 tracking-widest" style={{color: "#444"}}>未闻</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 sm:mb-10">命运不可见，但可以闻见</p>
      </div>

      {!calcResult ? (
        <>
          {/* 数字输入 */}
          <p className="text-sm text-gray-400 mb-4 sm:mb-6 text-center leading-relaxed max-w-md mx-auto">
            请输入三个随机的三位数，无需过度思考，凭借直觉做出你的选择
          </p>
          <div className="flex flex-col items-center gap-3 mb-10 sm:mb-12">
            <input
              type="number" min="100" max="999" placeholder="第一个"
              value={num1} onChange={(e) => handleNumberInput(e.target.value, setNum1)}
              className="w-48 max-w-[80vw] p-3 text-center text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
            <input
              type="number" min="100" max="999" placeholder="第二个"
              value={num2} onChange={(e) => handleNumberInput(e.target.value, setNum2)}
              className="w-48 max-w-[80vw] p-3 text-center text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
            <input
              type="number" min="100" max="999" placeholder="第三个"
              value={num3} onChange={(e) => handleNumberInput(e.target.value, setNum3)}
              className="w-48 max-w-[80vw] p-3 text-center text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* 问题输入 */}
          <div className="flex justify-center px-0 sm:px-8">
            <textarea
              className="w-full sm:w-4/5 h-20 p-4 text-base border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-gray-400"
              placeholder="在心里默念你的问题，然后写在这里..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={doDivination}
              disabled={loading || !num1 || !num2 || !num3}
              className={`mt-4 px-8 py-3 text-base rounded-lg transition-colors ${
                loading || !num1 || !num2 || !num3
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
          >
            {loading ? "占卜中..." : "起卦寻香"}
          </button>
          </div>
        </>
      ) : (
        <>
          {/* 计算结果 */}
          <div className="mb-8 p-6 sm:p-8 rounded-xl text-center transition-colors duration-500" style={{background: activeScheme ? activeScheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)", animation: "fadeIn 0.7s ease-out"}}>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-wider mb-2" style={{color: activeScheme ? activeScheme.text : "#1f2937"}}>
              {getShortName(calcResult.hexagram)}卦 · {calcResult.yao}
            </h2>
            {loading && (
              <div className="mt-4 text-sm animate-pulse" style={{color: activeScheme ? activeScheme.text : "#9ca3af", opacity: 0.7}}>
                正在解读中...
              </div>
            )}
          </div>

          {/* AI结果 - 分板块显示 */}
          {result && (() => {
            const parsed = parseResult(result);
            return (
              <div className="space-y-4 mb-6" style={{animation: "fadeIn 0.6s ease-out 0.3s both"}}>
                {/* 板块1：香气关键词 */}
                {parsed.keyword && (
                  <div className="p-4 sm:p-6 rounded-xl" style={{background: parsed.scheme ? parsed.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)", animation: "fadeIn 0.5s ease-out 0.4s both"}}>
                    <h3 className="text-base font-bold mb-3" style={{color: parsed.scheme ? parsed.scheme.text : "#1f2937"}}>香气关键词</h3>
                    <div style={{display: "flex", gap: "10px", flexWrap: "wrap"}}>
                      {parsed.keyword.split("·").map((kw, i) => (
                        <div key={i} style={{
                          padding: "6px 14px",
                          border: "1px solid",
                          borderColor: parsed.scheme ? parsed.scheme.text : "#999",
                          fontSize: "14px",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          color: parsed.scheme ? parsed.scheme.text : "#374151",
                          animation: `popIn 0.4s ease-out ${0.5 + i * 0.15}s both`,
                        }}>
                          {kw.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 板块2：香气隐喻 */}
                {parsed.scentMetaphor && (
                  <div className="p-4 sm:p-6 rounded-xl" style={{background: parsed.scheme ? parsed.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)", animation: "fadeIn 0.5s ease-out 0.6s both"}}>
                    <h3 className="text-base font-bold mb-3" style={{color: parsed.scheme ? parsed.scheme.text : "#1f2937"}}>香气隐喻</h3>
                    <div className="text-base leading-loose whitespace-pre-wrap" style={{color: parsed.scheme ? parsed.scheme.text : "#4b5563"}}>
                      {parsed.scentMetaphor.split("\n\n").map((p, i) => (
                        <div key={i} style={{textIndent: "2em"}}>{p.trim()}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 板块3：运势解析 */}
                {parsed.fortune && (
                  <div className="p-4 sm:p-6 rounded-xl" style={{background: parsed.scheme ? parsed.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)", animation: "fadeIn 0.5s ease-out 0.7s both"}}>
                    <h3 className="text-base font-bold mb-3" style={{color: parsed.scheme ? parsed.scheme.text : "#1f2937"}}>运势解析</h3>
                    <div className="text-base leading-loose whitespace-pre-wrap" style={{color: parsed.scheme ? parsed.scheme.text : "#4b5563"}}>
                      {parsed.fortune.split("\n\n").map((p, i) => (
                        <div key={i} style={{textIndent: "2em"}}>{p.trim()}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 板块4：核心原料 */}
                {parsed.ingredients && (
                  <div className="p-4 sm:p-6 rounded-xl" style={{background: parsed.scheme ? parsed.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)", animation: "fadeIn 0.5s ease-out 0.8s both"}}>
                    <h3 className="text-base font-bold mb-3" style={{color: parsed.scheme ? parsed.scheme.text : "#1f2937"}}>核心原料</h3>
                    <div className="text-base leading-relaxed whitespace-pre-wrap" style={{color: parsed.scheme ? parsed.scheme.text : "#4b5563"}}>
                      {parsed.ingredients}
                    </div>
                  </div>
                )}

                {/* 板块5：香水推荐 */}
                {parsed.perfume && (
                  <div className="p-4 sm:p-6 rounded-xl" style={{background: parsed.scheme ? parsed.scheme.card : "#fff", border: "0.5px solid rgba(0,0,0,0.08)", animation: "fadeIn 0.5s ease-out 1s both"}}>
                    <h3 className="text-base font-bold mb-3" style={{color: parsed.scheme ? parsed.scheme.text : "#1f2937"}}>香水推荐</h3>
                    <div className="text-base leading-relaxed whitespace-pre-wrap" style={{color: parsed.scheme ? parsed.scheme.text : "#4b5563"}}>
                      {parsed.perfume}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {result && !loading && (
            <div className="flex gap-3 justify-center">
              <button
                onClick={downloadShareImage}
                className="px-6 py-3 text-sm rounded-lg border transition-colors"
                style={{borderColor: activeScheme ? activeScheme.text : "#d1d5db", color: activeScheme ? activeScheme.text : "#374151"}}
              >
                生成分享图
              </button>
              <button
                onClick={resetAll}
                className="px-6 py-3 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                再测一次
              </button>
            </div>
          )}

          {/* 隐藏的分享卡片（用于截图 - 定位在页面内但不可见） */}
          {result && calcResult && (() => {
            const p = parseResult(result);
            const cardStyle = {
              width: "600px", minHeight: "800px", padding: "48px",
              background: p.scheme ? p.scheme.card : "#faf8f5",
              color: p.scheme ? p.scheme.text : "#2d2d2d",
              fontFamily: '"Noto Serif SC", "SimSun", serif',
              display: "flex", flexDirection: "column",
              boxSizing: "border-box",
            };
            return (
              <div style={{position: "absolute", top: "-9999px", left: 0, width: "600px"}}>
                <div ref={shareRef} style={cardStyle}>
                {/* 测试名 */}
                <div style={{fontSize: "13px", opacity: 0.6, letterSpacing: "3px", marginBottom: "32px", textAlign: "center"}}>未闻</div>

                {/* 卦名+爻名 */}
                <div style={{fontSize: "40px", fontWeight: 700, letterSpacing: "2px", marginBottom: "40px", textAlign: "center"}}>
                  {getShortName(calcResult.hexagram)}卦 · {calcResult.yao}
                </div>

                {/* 分隔线 */}
                <div style={{width: "40px", height: "1px", background: p.scheme ? p.scheme.text : "#999", opacity: 0.4, marginBottom: "32px", alignSelf: "center"}} />

                {/* 香气关键词 */}
                {p.keyword && (
                  <>
                    <div style={{fontSize: "12px", fontWeight: 600, letterSpacing: "2px", marginBottom: "10px", textAlign: "center"}}>香气关键词</div>
                    <div style={{display: "flex", gap: "12px", justifyContent: "center", marginBottom: "32px", flexWrap: "nowrap"}}>
                    {p.keyword.split("·").map((kw, i) => (
                      <div key={i} style={{
                        padding: "8px 16px",
                        border: "1px solid",
                        borderColor: p.scheme ? p.scheme.text : "#999",
                        fontSize: "13px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        flex: "0 0 auto",
                      }}>
                        {kw.trim()}
                      </div>
                    ))}
                  </div>
                  </>
                )}

                {/* 香气隐喻 - 开头空两字符 */}
                {(p.scentMetaphor || p.fortune) && (
                  <div style={{fontSize: "16px", lineHeight: 1.8, marginBottom: "32px", whiteSpace: "pre-wrap", textIndent: "2em"}}>
                    {(p.scentMetaphor || p.fortune).split("\n\n")[0].substring(0, 200)}
                  </div>
                )}

                {/* 核心原料 */}
                {p.ingredients && (
                  <>
                    <div style={{fontSize: "12px", fontWeight: 600, letterSpacing: "2px", marginBottom: "10px", textAlign: "center"}}>核心原料</div>
                    <div style={{fontSize: "16px", lineHeight: 1.7, whiteSpace: "pre-wrap"}}
                      dangerouslySetInnerHTML={{
                        __html: p.ingredients
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line) => {
                            const match = line.match(/^(.+?)（(.+?)）$/);
                            if (match) {
                              return `<strong>${match[1]}</strong>（${match[2]}）`;
                            }
                            return line;
                          })
                          .join("<br>"),
                      }}
                    />
                  </>
                )}

                {/* 底部留白 */}
                <div style={{flex: 1}} />

                {/* 底部水印 */}
                <div style={{fontSize: "11px", opacity: 0.5, letterSpacing: "3px", textAlign: "center", marginTop: "24px", borderTop: "0.5px solid", borderColor: p.scheme ? p.scheme.text : "#999", paddingTop: "16px"}}>
                  命运不可见，但可以闻见
                </div>
              </div>
              </div>
            );
          })()}
        </>
      )}
    </div>
    </>
  );
}
