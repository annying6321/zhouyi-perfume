// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

export default function Divination() {
  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .div-body { line-height: 1.5; }
      .div-body p { margin: 0; }
    `}</style>
    <div className="max-w-2xl mx-auto px-6 sm:px-10 py-12 sm:py-16 min-h-screen"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "url('/paper-texture.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: "#2d2d2d",
      }}
    >
      {/* 返回链接 — 保留导航 */}
      <div className="mb-8">
        <a href="/result"
          className="inline-block px-4 py-2 text-sm rounded-lg border transition-colors"
          style={{borderColor: "#d1d5db", color: "#374151"}}
          onClick={() => {
            const saved = sessionStorage.getItem("divinationResult");
            if (saved) window.location.href = "/result";
          }}
        >← 返回结果页</a>
        <a href="/divine" className="ml-3 inline-block px-4 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors">再测一次</a>
      </div>

      {/* ===== 正文开始 ===== */}
      <div className="div-body" style={{animation: "fadeIn 0.5s ease-out"}}>

        {/* [0] Heading 1 — 居中，行距1.5 */}
        <h1 style={{fontSize: "28px", fontWeight: 700, textAlign: "center", lineHeight: 1.5, letterSpacing: "0.08em", color: "#2C2C2C", margin: "0 0 4px"}}>
          数字卦占卜原理
        </h1>

        {/* [1] 副标题 — KaiTi，居中，行距1.5 */}
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif", fontSize: "16px", textAlign: "center", lineHeight: 1.5, color: "#6B7280", margin: "0 0 24px"}}>
          ——你随机输入的三个数是怎么算出一卦的？
        </p>

        {/* [2] 空行（分隔） */}

        {/* [3] 首段 — 首行缩进304800 EMU≈2字符，行距1.5 */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 12px", fontSize: "16px"}}>
          你在测试页上输了三个三位数，点击起卦，页面就告诉你：你占到了某卦某爻。你心想，这也太不靠谱了，不会是给我随机生成的吧？但其实原理并不"玄"，你占到的某卦某爻是通过<span style={{fontWeight: 700}}>数学运算</span>算出来的。
        </p>

        {/* [4] 空行（分隔） */}

        {/* [5] Heading 2 */}
        <h2 style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", letterSpacing: "0.05em", margin: "28px 0 12px"}}>
          基本概念
        </h2>

        {/* [6] 首行缩进266700 EMU≈2字符 */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          首先，我们要知道几个概念：六爻[yáo]、八卦（经卦）、六十四卦（重卦）。
        </p>

        {/* [7] */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          爻是卦的基本组成单位。阳爻为实（连着的），阴爻为虚（从中间断开的）。
        </p>

        {/* [8] 空行 → 图片1（阴阳爻） */}
        <div style={{textAlign: "center", margin: "12px 0"}}>
          <img src="/divination_img_1.png" alt="阴爻与阳爻示意" style={{maxWidth: "100%", height: "auto", borderRadius: "4px"}} />
        </div>

        {/* [9] */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          三爻排列，按照每一爻都有一阴一阳两种可能，三个爻有八种（2*2*2）可能的组合，形成了八卦。如下表。你需要做的是记住各个卦所对应的顺序和意象。
        </p>

        {/* 八卦表 — 2行×4列，文档中的表格1 */}
        <div style={{overflowX: "auto", margin: "12px 0"}}>
          <table style={{borderCollapse: "collapse", fontSize: "15px", width: "100%", textAlign: "center"}}>
            <tbody>
              <tr>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>1 ☰乾·天</td>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>2 ☱兑·泽</td>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>3 ☲离·火</td>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>4 ☳震·雷</td>
              </tr>
              <tr>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>5 ☴巽·风</td>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>6 ☵坎·水</td>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>7 ☶艮·山</td>
                <td style={{padding: "8px 10px", border: "1px solid #ccc", fontFamily: "'Times New Roman', serif"}}>8 ☷坤·地</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* [10] 宋体段落 — SimSun */}
        <p style={{fontFamily: "'SimSun', '宋体', serif", textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          《周易》的推演基础就建立于此八卦之上。古人将天地万象都归纳为这八种基本卦象，再将这原始的八卦两两上下组合，进而推演出六十四卦（8*8）。前人将<strong>三爻</strong>的八卦叫作"<strong>经卦</strong>"，而将<strong>六爻</strong>的六十四卦叫作"<strong>重卦</strong>"或"<strong>别卦</strong>"。
        </p>

        {/* [11-13] 空行 → 图片2（重卦结构） */}
        <div style={{textAlign: "center", margin: "12px 0"}}>
          <img src="/divination_img_2.png" alt="重卦结构：上卦与下卦示意" style={{maxWidth: "100%", height: "auto", borderRadius: "4px"}} />
        </div>

        {/* 分隔横线 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.1)", margin: "28px 0"}} />

        {/* [14] Heading 2 */}
        <h2 style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", letterSpacing: "0.05em", margin: "0 0 12px"}}>
          数字卦的原理
        </h2>

        {/* [15] 第一个数→下卦 */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          <strong>第一个数÷8</strong>，取余数所对应的卦，即为<strong>下卦</strong>。余0时则记为8（坤卦）。
        </p>

        {/* [16] 示例 Times New Roman */}
        <p style={{fontFamily: "'Times New Roman', serif", textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          例：357÷8=44余&nbsp;5&nbsp;→&nbsp;☴巽卦（风）
        </p>

        {/* [17] 空行 */}

        {/* [18] 第二个数→上卦 */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          <strong>第二个数÷8</strong>，取余数所对应的卦，即为<strong>上卦</strong>。余0时则记为8（坤卦）。
        </p>

        {/* [19] 示例 */}
        <p style={{fontFamily: "'Times New Roman', serif", textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          例：248÷8=31余&nbsp;0&nbsp;→&nbsp;8→☷坤卦（地）
        </p>

        {/* [20] 空行 */}

        {/* [21] 第三个数→动爻 */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          <strong>第三个数÷6</strong>，取余数即为对应的<strong>爻位</strong>（一卦六爻，<strong>从下往上</strong>数）。余0时记为6（上爻）。
        </p>

        {/* [22] 示例 */}
        <p style={{fontFamily: "'Times New Roman', serif", textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          例：669÷6=111余&nbsp;3&nbsp;→第三爻
        </p>

        {/* [23-24] 空行 */}

        {/* [25] 查找表格 */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          得出三个余数后，再在这张表中查出对应的卦。上卦是行、下卦是列。
        </p>

        {/* [26] 示例 */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          如：上卦巽(5)+下卦坤(8)&nbsp;→第5行第8列→&nbsp;「风地观」卦
        </p>

        {/* 算法总结表 — 文档中的表格2：4行×3列 */}
        <div style={{overflowX: "auto", margin: "20px 0"}}>
          <table style={{borderCollapse: "collapse", fontSize: "14px", width: "100%"}}>
            <thead>
              <tr style={{background: "#f0ece6"}}>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "left"}}>操作</th>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "center"}}>余数范围</th>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "center"}}>余0处理</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: "rgba(255,255,255,0.6)"}}>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5"}}>下卦=第一个数÷8</td>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5", textAlign: "center"}}>1-8</td>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5", textAlign: "center"}}>余0→8（坤卦）</td>
              </tr>
              <tr>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5"}}>上卦=第二个数÷8</td>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5", textAlign: "center"}}>1-8</td>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5", textAlign: "center"}}>余0→8（坤卦）</td>
              </tr>
              <tr style={{background: "rgba(255,255,255,0.6)"}}>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5"}}>动爻=第三个数÷6</td>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5", textAlign: "center"}}>1-6</td>
                <td style={{padding: "7px 12px", border: "1px solid #d1cdc5", textAlign: "center"}}>余0→6（上爻）</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 六十四卦查询表图 */}
        <div style={{textAlign: "center", margin: "16px 0"}}>
          <img src="/divination_img_3.png" alt="六十四卦查询表" style={{maxWidth: "100%", height: "auto", borderRadius: "4px"}} />
        </div>

        {/* [27] 空行 */}

        {/* 分隔横线 — 文档在"这真的灵吗"前有分隔 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.1)", margin: "28px 0"}} />

        {/* [28] 这真的灵吗？ */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          这真的灵吗？
        </p>

        {/* [29] */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          你「随手」输的每个数字，看起来是随机的，但按照玄学的看法：没有真正的偶然。&nbsp;<strong>你在那个时刻、那个心境下、带着那个问题摁下的数字，本身就是意义的载体。</strong>
        </p>

        {/* [30] */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          邵雍管它叫<strong>「触机」——心有所动，触机成卦</strong>。
        </p>

        {/* [31] */}
        <p style={{textIndent: "2em", lineHeight: 1.5, margin: "0 0 4px", fontSize: "16px"}}>
          就像你每天出门前随手选一瓶香水——今天为什么抓这瓶而不是那瓶？一定有你意识深处的原因，只是你未必觉察罢了。
        </p>

        {/* [32] 空行 */}

        {/* 分隔横线 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.1)", margin: "28px 0"}} />

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
    </>
  );
}
