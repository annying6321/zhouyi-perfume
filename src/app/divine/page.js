// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

import { useState, useEffect } from "react";

// 先天八卦数字对应：乾1 兑2 离3 震4 巽5 坎6 艮7 坤8
const TRIGRAM_NAMES = ["", "乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];
const YAO_POSITIONS = ["初", "二", "三", "四", "五", "上"];

export default function Divine() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [hexagramsData, setHexagramsData] = useState(null);

  useEffect(() => {
    fetch("/hexagrams.json")
      .then((r) => r.json())
      .then((data) => setHexagramsData(data));
  }, []);

  function calculateGua(n1, n2, n3) {
    const lower = n1 % 8 || 8;  // 第一个数→下卦
    const upper = n2 % 8 || 8;  // 第二个数→上卦
    const changing = n3 % 6 || 6;
    const guaNames = [
      "乾为天","泽天夬","火天大有","雷天大壮","风天小畜","水天需","山天大畜","地天泰",
      "天泽履","兑为泽","火泽睽","雷泽归妹","风泽中孚","水泽节","山泽损","地泽临",
      "天火同人","泽火革","离为火","雷火丰","风火家人","水火既济","山火贲","地火明夷",
      "天雷无妄","泽雷随","火雷噬嗑","震为雷","风雷益","水雷屯","山雷颐","地雷复",
      "天风姤","泽风大过","火风鼎","雷风恒","巽为风","水风井","山风蛊","地风升",
      "天水讼","泽水困","火水未济","雷水解","风水涣","坎为水","水山蹇","地水师",
      "天山遁","泽山咸","火山旅","雷山小过","风山渐","山水蒙","艮为山","地山谦",
      "天地否","泽地萃","火地晋","雷地豫","风地观","水地比","山地剥","坤为地",
    ];
    const guaIndex = (lower - 1) * 8 + (upper - 1);
    const hexagram = guaNames[guaIndex];
    let yaoName = YAO_POSITIONS[changing - 1];
    if (hexagramsData) {
      const gua = hexagramsData.hexagrams.find((h) => h.name === hexagram);
      if (gua) {
        const yao = gua.yaos[changing - 1];
        if (yao) yaoName = yao.position;
      }
    }
    return { hexagram, yao: yaoName, upperName: TRIGRAM_NAMES[upper], lowerName: TRIGRAM_NAMES[lower], changing };
  }

  function handleNumberInput(value, setter) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned === "" || cleaned === "0") { setter(""); return; }
    const num = parseInt(cleaned);
    setter(num > 999 ? "999" : cleaned);
  }

  async function doDivination() {
    const n1 = parseInt(num1);
    const n2 = parseInt(num2);
    const n3 = parseInt(num3);
    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) return;
    if (n1 < 100 || n1 > 999 || n2 < 100 || n2 > 999 || n3 < 100 || n3 > 999) return;

    setLoading(true);

    const calced = calculateGua(n1, n2, n3);

    // 立刻保存卦象并跳转到结果页，在结果页完成流式加载
    sessionStorage.setItem("divinationPending", JSON.stringify({
      num1, num2, num3, question, calcResult: calced,
      timestamp: Date.now(),
    }));
    window.location.href = "/result";
  }

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      input, textarea, button { font-size: 16px !important; }
      input, button { min-height: 44px; }
      textarea { min-height: 88px; }
      * { -webkit-tap-highlight-color: transparent; }
    `}</style>
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-12 sm:py-16 min-h-screen transition-colors duration-700"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "url('/paper-texture.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: "#2d2d2d",
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

      {/* 数字输入 */}
      <p className="text-base text-gray-400 mb-4 sm:mb-6 text-center leading-relaxed max-w-md mx-auto">
        请输入三个随机的<strong>三位数</strong><br />无需过度思考，凭借直觉做出你的选择
      </p>
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
        <input type="number" min="100" max="999" placeholder="第一个" value={num1}
          onChange={(e) => handleNumberInput(e.target.value, setNum1)}
          className="w-28 sm:w-32 p-2 sm:p-3 text-center text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
        <input type="number" min="100" max="999" placeholder="第二个" value={num2}
          onChange={(e) => handleNumberInput(e.target.value, setNum2)}
          className="w-28 sm:w-32 p-2 sm:p-3 text-center text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
        <input type="number" min="100" max="999" placeholder="第三个" value={num3}
          onChange={(e) => handleNumberInput(e.target.value, setNum3)}
          className="w-28 sm:w-32 p-2 sm:p-3 text-center text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400" />
      </div>

      {/* 问题输入 */}
      <div className="flex flex-col items-center px-0 sm:px-8">
        <p className="text-base text-gray-400 mb-2 text-center leading-relaxed">
          请输入你的问题。记住：不诚不占、不义不占、不疑不占。
        </p>
        <textarea className="w-full sm:w-4/5 h-20 p-4 text-base border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-gray-400"
          placeholder="在心里默念你的问题，然后写在这里..." value={question}
          onChange={(e) => setQuestion(e.target.value)} />
      </div>

      <div className="flex justify-center">
        <button onClick={doDivination} disabled={loading || !num1 || !num2 || !num3}
          className={`mt-4 px-8 py-3 text-base rounded-lg transition-colors ${
            loading || !num1 || !num2 || !num3
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}>
          {loading ? "占卜中..." : "起卦寻香"}
        </button>
      </div>

      {/* 底部版权信息 */}
      <div className="text-center mt-20 mb-8">
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
