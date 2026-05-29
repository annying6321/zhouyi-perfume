// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

export default function Perfume() {
  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .perfume-body p { text-indent: 2em; }
      .perfume-body h2,
      .perfume-body h3,
      .perfume-body h4,
      .perfume-body p[style*="Times New Roman"],
      .perfume-body p[style*="textAlign"],
      .perfume-body p[style*="SimSun"] { text-indent: 0; }
      .faq-section p { text-indent: 0 !important; }
      html { scroll-behavior: smooth; scroll-padding-top: 110px; }
      .toc-link { transition: opacity 0.2s; white-space: nowrap; padding: 6px 14px; border-radius: 9999px; font-size: 13px; color: #5C534A; text-decoration: none; border: 0.5px solid rgba(0,0,0,0.08); }
      .toc-link:hover { opacity: 0.6; background: rgba(255,255,255,0.8); }
      .sticky-nav { position: sticky; top: 0; z-index: 10; margin: 0 -1.5rem; padding: 0 1.5rem; background: rgba(250,248,245,0.92); backdrop-filter: blur(8px); }
      @media (min-width: 640px) { .sticky-nav { margin: 0 -2.5rem; padding: 0 2.5rem; } }
      .toc-scroll { display: flex; gap: 6px; overflow-x: auto; padding: 8px 0 10px; scrollbar-width: none; -ms-overflow-style: none; }
      .toc-scroll::-webkit-scrollbar { display: none; }
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
      {/* 切换 sticky 导航栏 */}
      <div className="sticky-nav" style={{borderBottom: "0.5px solid rgba(0,0,0,0.06)"}}>
        <div className="flex items-center gap-2 py-3" style={{flexWrap: "wrap"}}>
          <a href="/result"
            className="inline-block px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap"
            style={{borderColor: "#d1d5db", color: "#374151"}}
            onClick={() => {
              const saved = sessionStorage.getItem("divinationResult");
              if (saved) window.location.href = "/result";
            }}
          >← 返回</a>
          <a href="/divine" className="inline-block px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors whitespace-nowrap">再测</a>
        </div>
        <div className="toc-scroll">
          <a href="#ch-prepare" className="toc-link">准备</a>
          <a href="#ch-step1" className="toc-link">第一步</a>
          <a href="#ch-step2" className="toc-link">第二步</a>
          <a href="#ch-step3" className="toc-link">第三步</a>
          <a href="#ch-step4" className="toc-link">第四步</a>
          <a href="#ch-step5" className="toc-link">第五步</a>
          <a href="#ch-faq" className="toc-link">常见问题</a>
          <a href="#ch-ending" className="toc-link">尾声</a>
        </div>
      </div>

      {/* 标题 */}
      <div style={{animation: "fadeIn 0.5s ease-out", paddingTop: "24px"}}>
        {/* Heading 1, Center */}
        <h1 className="text-3xl sm:text-4xl" style={{fontWeight: 700, textAlign: "center", letterSpacing: "0.08em", color: "#2C2C2C", marginBottom: 0}}>
          未闻·从卦象到香气
        </h1>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif", fontSize: "16px", textAlign: "center", color: "#6B7280", marginTop: "12px", marginBottom: 0}}>
          一份给香水小白的调香手记
        </p>
      </div>

      {/* 正文 */}
      <div className="space-y-4 perfume-body" style={{animation: "fadeIn 0.5s ease-out 0.2s both", fontSize: "16px", lineHeight: 1.7}}>

        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>
          命运不可见，但可以闻见。
        </p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>
          当你在「未闻」中占得一卦，AI调香师根据你的卦象、爻位与心中所问，为你生成了几味核心原料。
          这些原料都是<strong style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>真实存在于调香工业中的香材</strong>，是你<strong style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>此刻命运气味的具象化</strong>。
        </p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>
          这份手记，就是教你如何用这几味原料，亲手调出一瓶属于你的卦象香水。
        </p>

        {/* Heading 2 — 准备 */}
        <h2 id="ch-prepare" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          在开始之前，你需要准备什么
        </h2>

        <p style={{fontFamily: "'SimSun', '宋体', serif", textIndent: "2em"}}>
          调香的门槛比你想的要低。你不需要实验室——只需要一个下午、几样小东西，和一份好奇心。
        </p>

        <h3 style={{fontSize: "18px", fontWeight: 700, color: "#374151", marginBottom: 0}}>
          必备物品：
        </h3>
        <div style={{overflowX: "auto", margin: "12px 0"}}>
          <table className="w-full" style={{borderCollapse: "collapse", fontSize: "14px", lineHeight: 1.6, border: "none"}}>
            <thead>
              <tr style={{background: "#f0ece6"}}>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap"}}>物品</th>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "left"}}>说明</th>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap"}}>去哪买</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>一瓶无水酒精</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>95%浓度的食用/医用酒精，作为香水的基底溶剂</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>药店或化工原料店，约15元/500ml</td></tr>
              <tr><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>几个深色玻璃瓶</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>10ml或30ml的避光玻璃瓶（最好是琥珀色或蓝色），用来储存你的作品</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>淘宝搜「香水瓶分装瓶」，几块钱一个</td></tr>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>一支1ml滴管</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>或者用香水瓶自带的滴管头</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>药店买一次性滴管即可</td></tr>
              <tr><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>闻香纸条</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>白纸裁成细长条即可，用来闻原料的味道</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>也可以用咖啡店的搅拌棒代替</td></tr>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>笔记本+笔</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>记录你的配方——你一定会想复刻成功的那一瓶</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>—</td></tr>
            </tbody>
          </table>
        </div>
        <h3 style={{fontSize: "18px", fontWeight: 700, color: "#374151", marginBottom: 0}}>
          可选装备（让你更像正经调香师）：
        </h3>
        <p>精密电子秤（精度0.01g，约30元）</p>
        <p>烧杯/小量杯（化学实验用的那种玻璃小量杯）</p>
        <p>移液枪（不买也行，滴管就够）</p>

        <h3 style={{fontSize: "18px", fontWeight: 700, color: "#374151"}}>
          最最重要：安全须知
        </h3>

        <p>调香是玩气味，不是玩化学。记住这几条，你就能安全地享受整个过程：</p>

        <p>1. 所有香原料都是<strong>浓缩</strong>的！<strong>&nbsp;不能直接涂在皮肤上</strong>，必须用酒精稀释。就像浓缩果汁要兑水才能喝。</p>
        <p>2. 第一次使用任何原料前，<strong>做皮肤测试</strong>：用酒精稀释到1%（1滴原料+99滴酒精），涂在手腕内侧，等24小时看有没有红肿过敏。</p>
        <p>3. 在<strong>通风良好</strong>的地方操作。不要对着瓶子大口吸气——有些原料（如黑胡椒、肉桂）的粉末会刺激鼻腔。</p>
        <p>4. 原料<strong>远离火源</strong>。酒精是易燃品。</p>
        <p>5. 调好的香水<strong>不要喝</strong>。&nbsp;闻就好。</p>

        {/* Heading 2 — 第一步 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "32px 0"}} />
        <h2 id="ch-step1" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          第一步：读懂你的「核心原料」
        </h2>

        <p>当你完成占卜后，页面会给你若干行这样的内容：</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>核心原料：</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>雪松（苍劲的木香，如立于高山之巅）</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>乳香（空灵的树脂香，如古寺中飘散的烟）</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>佛手柑（明亮的柑橘香气，如破晓的第一道光）</p>
        <p>这就是你的配方核心。</p>
        <p>通常AI会给出&nbsp;2-4味原料，也有的卦象会给5味。每一味原料在香水结构中扮演不同的角色。请你像读卦象一样，先感受它们：</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>
          原料角色速查表
        </h4>
        <div style={{overflowX: "auto", margin: "12px 0"}}>
          <table className="w-full" style={{borderCollapse: "collapse", fontSize: "14px", lineHeight: 1.6}}>
            <thead>
              <tr style={{background: "#f0ece6"}}>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600}}>角色</th>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600}}>特点</th>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600}}>常见原料</th>
                <th style={{padding: "8px 12px", border: "1px solid #d1cdc5", fontWeight: 600}}>在香水中的位置</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>前调<br/>(Top Note)</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>最先闻到的味道，轻盈、清新，持续15-30分钟</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>佛手柑、柠檬、橙子、葡萄柚、苦橙叶、胡椒、生姜</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>第一印象，如卦之初爻</td></tr>
              <tr><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>中调<br/>(Heart Note)</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>香水的灵魂和主体，持续2-4小时</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>玫瑰、茉莉、薰衣草、桂花、天竺葵、杜松、肉桂</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>核心气质，如卦之五爻</td></tr>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>后调<br/>(Base Note)</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>最持久的气味，可以留香6小时以上</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>檀香、雪松、香根草、广藿香、乳香、没药、琥珀、麝香、安息香</td><td style={{padding: "6px 12px", border: "1px solid #d1cdc5"}}>底色与余韵，如卦之上爻</td></tr>
            </tbody>
          </table>
        </div>
        <p>小窍门：如果你的核心原料中包含了三种角色的原料（例如佛手柑+玫瑰+檀香），那你已经凑齐了一瓶完整香水的骨架。</p>
        <p>如果全是后调（比如只有檀香+乳香），那么你可以自己加一味柑橘类的前调让它更轻盈。</p>

        {/* Heading 2 — 第二步 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "32px 0"}} />
        <h2 id="ch-step2" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          第二步：基本原则——「三二一」调香法
        </h2>

        <p>这是调香入门最经典的配方结构。记住它，就能自己搭出任何香水。</p>
        <p><strong>核心公式：前调:中调:后调=3:2:1</strong></p>
        <p>但这不是按滴数算——不同原料的<strong>浓度和气味强度差异巨大</strong>。更准确的说法是：</p>
        <p>前调原料：气味通常轻盈，可以<strong>多放</strong>一些</p>
        <p>中调原料：气味中等，<strong>适量</strong></p>
        <p>后调原料：气味浓烈厚重，要<strong>少放</strong>一些</p>
        <p>实际操作的起点比例：</p>
        <p><strong>原料的总量约占香水的15-20%，剩下的80-85%是酒精</strong>。</p>
        <p>举例：如果你要做一瓶&nbsp;10ml&nbsp;的香水：</p>
        <div style={{overflowX: "auto", margin: "12px 0", marginLeft: "2em"}}>
          <table style={{borderCollapse: "collapse", fontSize: "14px", lineHeight: 1.6, width: "auto", minWidth: "60%"}}>
            <thead>
              <tr style={{background: "#f0ece6"}}>
                <th style={{padding: "8px 16px", border: "1px solid #d1cdc5", fontWeight: 600}}>成分</th>
                <th style={{padding: "8px 16px", border: "1px solid #d1cdc5", fontWeight: 600}}>用量</th>
                <th style={{padding: "8px 16px", border: "1px solid #d1cdc5", fontWeight: 600}}>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "6px 16px", border: "1px solid #d1cdc5"}}>酒精</td><td style={{padding: "6px 16px", border: "1px solid #d1cdc5"}}>约8ml</td><td style={{padding: "6px 16px", border: "1px solid #d1cdc5"}}>基底</td></tr>
              <tr><td style={{padding: "6px 16px", border: "1px solid #d1cdc5"}}>所有原料</td><td style={{padding: "6px 16px", border: "1px solid #d1cdc5"}}>总共约2ml</td><td style={{padding: "6px 16px", border: "1px solid #d1cdc5"}}>这才是你的「调香」空间</td></tr>
            </tbody>
          </table>
        </div>
        <p>在这2ml原料中，前调、中调、后调按&nbsp;3:2:1&nbsp;的大致比例分配（即前调最多，后调最少，因为后调原料气味最浓）。</p>

        {/* Heading 2 — 第三步 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "32px 0"}} />
        <h2 id="ch-step3" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          第三步：认识你可能会遇到的「核心原料」
        </h2>

        <p>以下是根据「未闻」64卦所有香气数据，整理出的你可能会在测试结果中看到的原料清单，以及它们的气味性格和用量建议。</p>

        {/* 原料表格公共样式函数 */}
        {(() => {
          const TableStyle = (headers, rows) => (
            <div style={{overflowX: "auto", margin: "8px 0 16px 2em"}}>
              <table style={{borderCollapse: "collapse", fontSize: "14px", lineHeight: 1.6, width: "100%"}}>
                <thead>
                  <tr style={{background: "#f0ece6"}}>
                    {headers.map((h, i) => <th key={i} style={{padding: "7px 10px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap"}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} style={{background: ri % 2 === 0 ? "rgba(255,255,255,0.6)" : "transparent"}}>
                      {row.map((cell, ci) => <td key={ci} style={{padding: "5px 10px", border: "1px solid #d1cdc5"}}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

          return (
            <>
              <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151", marginLeft: "2em"}}>柑橘类（前调）</h4>
              {TableStyle(
                ["原料", "闻起来像", "用量建议", "一句话记忆"],
                [
                  ["佛手柑（香柠檬）","清亮微苦的柑橘","可大量使用，5-8滴","破晓的第一道光"],
                  ["柠檬","直白明亮的酸爽","5-8滴","夏日的深呼吸"],
                  ["葡萄柚","清甜微涩","5-8滴","晨间的一杯西柚汁"],
                  ["苦橙叶","绿意微苦，带木质感","3-5滴","枝叶间的清冽"],
                ]
              )}

              <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151", marginLeft: "2em"}}>草本绿叶类（前调/中调）</h4>
              {TableStyle(
                ["原料", "闻起来像", "用量建议", "一句话记忆"],
                [
                  ["杜松","清冽的松针加一点辛香","3-5滴","北境的冷风"],
                  ["薄荷","清凉的绿意","2-3滴（非常抢戏）","一口冷冽的呼吸"],
                  ["迷迭香","草本厨房香气","3-4滴","地中海的阳光"],
                  ["橡苔","潮湿的森林地表","偏强，1-2滴","朽叶下的清冷"],
                  ["紫罗兰叶","清新的黄瓜般绿意","2-3滴","雨后的叶尖"],
                ]
              )}

              <p style={{fontFamily: "'SimSun', '宋体', serif", fontSize: "12pt", fontWeight: 700, color: "#000", marginLeft: "2em"}}>花香类（中调）</p>
              {TableStyle(
                ["原料", "闻起来像", "用量建议", "一句话记忆"],
                [
                  ["玫瑰","经典馥郁的花香","可用3-5滴","一瓣心香"],
                  ["茉莉","浓郁、甜美、略带动物感","偏强，2-3滴即可","月下的低语"],
                  ["橙花","清透雅致的花香带皂感","3-5滴","初夏的白花"],
                  ["桂花","甜润的蜜桃杏子花香","2-3滴","秋日的甜梦"],
                  ["薰衣草","清爽的草本花香","3-5滴","普罗旺斯的风"],
                  ["鸢尾根","粉质、优雅、像紫罗兰色的粉末","偏贵但柔和，2-3滴","复古的粉扑"],
                ]
              )}

              <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151", marginLeft: "2em"}}>辛香树脂类（中调/后调）</h4>
              {TableStyle(
                ["原料", "闻起来像", "用量建议", "一句话记忆"],
                [
                  ["黑胡椒","辛辣刺激的颗粒感","1滴足矣！很抢戏","舌尖的闪电"],
                  ["生姜","温暖辛香","2-3滴","冬日里的一杯姜茶"],
                  ["肉桂","温暖甜辛","1-2滴（非常强势）","圣诞夜的暖意"],
                  ["小豆蔻","清柠般的辛香","2-3滴","印度奶茶的香气"],
                  ["乳香","空灵的树脂香，微酸微甜","3-5滴","教堂里的祈祷"],
                  ["没药","苦涩深沉的树脂，比乳香厚重","1-2滴","古老棺木的叹息"],
                  ["安息香","温暖甜蜜的香草般树脂","3-5滴","冬日壁炉的拥抱"],
                ]
              )}

              <p style={{fontFamily: "'SimSun', '宋体', serif", fontSize: "12pt", fontWeight: 700, color: "#000", marginLeft: "2em"}}>木质类（后调/中调）</p>
              {TableStyle(
                ["原料", "闻起来像", "用量建议", "一句话记忆"],
                [
                  ["雪松","铅笔的木屑味，干燥的木香","稳健，可用3-5滴","高山的脊梁"],
                  ["檀香","温润的奶香木头","温和，可用3-5滴","寺庙的呼吸"],
                  ["香根草","泥土和树根的气息，带一点烟熏感","偏强，2-3滴即可","大地深处的脉络"],
                  ["广藿香","深绿色的草药泥土味","很强，1-2滴足矣","雨后的森林地面"],
                  ["柏树","清新的木质，带点松脂味","可用3-5滴","山风的骨骼"],
                ]
              )}

              <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151", marginLeft: "2em"}}>基底/动物感类（后调）</h4>
              {TableStyle(
                ["原料", "闻起来像", "用量建议", "一句话记忆"],
                [
                  ["麝香","干净的体香（现代人工麝香）、温暖的肌肤感","2-3滴","皮肤的温度"],
                  ["龙涎香","咸湿的海洋气息，带点粉感","1-2滴（很贵很浓）","潮水退后的沙滩"],
                  ["琥珀","温暖的树脂甜香","3-5滴","封存万年的蜜"],
                  ["香草","甜美的奶油味","2-3滴（多了会甜腻）","刚出炉的曲奇"],
                ]
              )}
            </>
          );
        })()}

        {/* Heading 2 — 第四步 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "32px 0"}} />
        <h2 id="ch-step4" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          第四步：动手调香——七步法
        </h2>

        <p>准备好了吗？以下是完整的操作流程。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>第1步：闻一闻你的原料</h4>
        <p>把每一味核心原料各滴1滴在闻香纸条上。闭上眼，深呼吸，然后在笔记本上分别写下每一味原料给你的第一感觉。例如：雪松——像走进了一家老木匠的作坊。佛手柑——像打开了一瓶冰镇汽水。</p>
        <p>这一步，是你与原料的初次对话。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>第2步：做「纸上试配」</h4>
        <p>取一根新的闻香纸条，在纸条的<strong>不同位置</strong>分别滴上你计划用的各原料——前调滴在纸条一端，中调在中部，后调在另一端。</p>
        <p>然后一起闻，感受这个组合是否和谐。</p>
        <p>如果<strong>太冲</strong>&nbsp;→减少前调</p>
        <p>如果<strong>太闷</strong>&nbsp;→减少后调</p>
        <p>如果<strong>太单一</strong>&nbsp;→考虑加一味反差原料（比如木质调里加一点柑橘，花香调里加一点辛香）</p>
        <p>反复调整，直到你在纸条上闻到了「就是它」的感觉。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>第3步：按比例下料（以10ml为例）</h4>
        <p>假设你的核心原料是：佛手柑（前调）+玫瑰（中调）+乳香（后调）。</p>
        <p><strong>按照&nbsp;3:2:1&nbsp;的原料比例：</strong></p>
        <p>往空瓶里滴入&nbsp;6滴佛手柑</p>
        <p>再滴入&nbsp;4滴玫瑰</p>
        <p>最后滴入&nbsp;2滴乳香</p>
        <p>这里的「滴」是指标准滴管滴出的量。不同原料的滴管可能大小不同，但作为一个起点已经足够。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>第4步：加酒精</h4>
        <p>用酒精加满到&nbsp;10ml&nbsp;刻度线（如果瓶子没有刻度，按8:2的感觉——8成酒精，2成原料）。</p>
        <p>盖紧瓶盖。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>第5步：摇晃与融合</h4>
        <p>把瓶子握在手心，用体温温暖它。轻轻摇晃，让原料和酒精充分融合。</p>
        <p>打开瓶盖闻一下——这时候的味道还是生涩的，像刚和面的面团，还没发酵好。不要急着下定论。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>第6步：静置与等待（最考验耐心的一步）</h4>
        <p>把瓶子放在衣柜或抽屉的阴暗角落。</p>
        <p><strong>24小时后</strong>：打开闻一次。酒精味开始散去，原料开始磨合。</p>
        <p><strong>1周后</strong>：再闻一次。这是重要的转折点——香气开始圆润。</p>
        <p><strong>2周后</strong>：基本成熟。如果是柑橘调为主的香水，这时候最好闻。</p>
        <p><strong>4周后</strong>：完全成熟。木质调和树脂调需要这么久才能展现出真正的深度。</p>
        <p>熟成的秘密：香水<strong>不是即调即用</strong>的。它像一坛酒，给足时间，气味分子才会真正融合。你对它有多耐心，它就对你有多慷慨。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>第7步：记录你的配方</h4>
        <p>在笔记本上写下你的配方：</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>未闻·[卦名]调香记录</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>日期：XXXX年XX月XX日</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>卦象：乾为天·初九</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>核心原料：佛手柑·玫瑰·乳香</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>配方（10ml）：</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>佛手柑6滴→前调</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>玫瑰4滴→中调</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>乳香2滴→后调</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>95%酒精加至10ml</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>熟成时间：2周</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>初闻感受：[写下你的感受]</p>
        <p style={{fontFamily: "'Times New Roman', serif"}}>2周后感：[写下变化]</p>
        <p>这样，下次你再占到这个卦，可以直接复刻，或者微调改进。</p>

        {/* Heading 2 — 第五步 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "32px 0"}} />
        <h2 id="ch-step5" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          第五步：如果你想让配方更讲究
        </h2>

        <p>上面的「三二一」法是一个安全牌，但真正的调香乐趣在于打破规则。</p>
        <p>以下是一些进阶技巧，但仍然是调香小白能做到的：</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>1.调香轮的「三角法则」</h4>
        <p>把上面的原料角色速查表简化成三个角：</p>
        <p>柑橘/清新（前调）————花香（中调）————木质/树脂（后调）</p>
        <p>好闻的组合往往跨越两个角：</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>柑橘+木质=清爽又有深度（如爱马仕大地）</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>花香+木质=温柔又有风骨（如香奈儿梧桐影木）</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>柑橘+花香=明亮又甜美（如祖玛珑橙花）</p>
        <p>最安全的万能配方：<strong>柑橘+花香+木质</strong>。它涵盖了几乎所有经典香水。</p>

        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>2.用量微调口诀</h4>

        {/* 常见问题调整表 */}
        <div style={{overflowX: "auto", margin: "8px 0 16px"}}>
          <table style={{borderCollapse: "collapse", fontSize: "14px", lineHeight: 1.6, width: "100%"}}>
            <thead>
              <tr style={{background: "#f0ece6"}}>
                <th style={{padding: "6px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "left", whiteSpace: "nowrap"}}>问题</th>
                <th style={{padding: "6px 12px", border: "1px solid #d1cdc5", fontWeight: 600, textAlign: "left"}}>解决方案</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "5px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>太淡了，留香短</td><td style={{padding: "5px 12px", border: "1px solid #d1cdc5"}}>增加后调（檀香、乳香、广藿香）1-2滴</td></tr>
              <tr><td style={{padding: "5px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>太呛，酒精味重</td><td style={{padding: "5px 12px", border: "1px solid #d1cdc5"}}>增加静置时间，或减少前调1-2滴</td></tr>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "5px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>太甜腻</td><td style={{padding: "5px 12px", border: "1px solid #d1cdc5"}}>加入1滴苦橙叶、香根草或少量黑胡椒</td></tr>
              <tr><td style={{padding: "5px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>太沉闷</td><td style={{padding: "5px 12px", border: "1px solid #d1cdc5"}}>加入2-3滴佛手柑或柠檬</td></tr>
              <tr style={{background: "rgba(255,255,255,0.6)"}}><td style={{padding: "5px 12px", border: "1px solid #d1cdc5", whiteSpace: "nowrap"}}>少了一个层次</td><td style={{padding: "5px 12px", border: "1px solid #d1cdc5"}}>在后调里加1滴橡苔或广藿香增加深度</td></tr>
            </tbody>
          </table>
        </div>
        <h4 style={{fontSize: "16px", fontWeight: 700, color: "#374151"}}>3.当你只有一味原料</h4>
        <p>有些卦象只给了1-2味核心原料。不要慌——你可以自己补充。</p>
        <p>拿出一张纸，问自己三个问题：</p>
        <p>它让我想到什么颜色？&nbsp;→暖色（橙、红）配柑橘或花香做前调；冷色（绿、蓝）配草本或海洋调。</p>
        <p>它让我想到什么季节？&nbsp;→春夏配清爽前调，秋冬配温暖中后调。</p>
        <p>它让我想到什么场景？&nbsp;→清晨配柑橘与绿茶，夜晚配麝香与琥珀。</p>
        <p>万能补充规则：&nbsp;无论你的核心原料是什么，加3-5滴佛手柑作为前调，几乎永远不会出错。佛手柑是调香界的「万用钥匙」。</p>

        {/* Heading 2 — FAQ */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "32px 0"}} />
        <h2 id="ch-faq" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          常见问题速查
        </h2>

        <div className="faq-section" style={{lineHeight: 2}}>
        <p style={{marginTop: "12px"}}><strong>Q：</strong>调出来的香水为什么全是酒精味？&nbsp;</p>
        <p><strong>A：</strong>别慌，刚调好的香水酒精味重很正常。盖紧瓶盖放1-2周，酒精会逐渐挥发，香气开始显现。柑橘调的熟成时间最短（约1周），木质调和树脂调需要2-4周。</p>

        <p style={{marginTop: "12px"}}><strong>Q：</strong>为什么我的香水味道和我闻纸条时不一样？&nbsp;</p>
        <p><strong>A：</strong>完全正常。纸条上闻到的是「平面」的气味，加入酒精并熟成后是「立体」的。就像生面粉和烤好的面包味道完全不同。</p>

        <p style={{marginTop: "12px"}}><strong>Q：</strong>滴多了怎么办？</p>
        <p><strong>A：</strong>如果某一味原料手抖加多了，可以再补加酒精稀释整体浓度；或者加入它的「对家」来平衡，比如檀香加多了，补一点佛手柑。</p>
        <p>当然，最直接的方法是重新调一瓶，把这次的失败配方记下来当反面教材。</p>

        <p style={{marginTop: "12px"}}><strong>Q：</strong>原料在哪里买？</p>
        <p><strong>A：</strong>淘宝搜「精油单方」「香原料单方」——注意买稀释好的或者标明可接触皮肤的产品。有些原料是纯香精（Perfume Oil），需要自己稀释。初学者建议直接买「调香原料套装」，淘宝上大约50-80元就能买到一个包含十几种常见原料的入门套装。</p>

        <p style={{marginTop: "12px"}}><strong>Q：</strong>我没有所有原料，只占到了其中几味？</p>
        <p><strong>A：</strong>那就只用这几味来调。少即是多。很多经典香水只有3-4种核心香材。比如「雪松+佛手柑」就是一支极简好闻的木质柑橘调。</p>

        <p style={{marginTop: "12px"}}><strong>Q：</strong>可以只用精油代替吗？</p>
        <p><strong>A：</strong>可以。如果你买不到专业调香原料，优质的单方精油（如阿芙、Oshadhi等品牌）可以作为替代品。但要注意，精油浓度已经是稀释过的（一般5-10%），所以用量要比上面说的多5-10倍。所以会变成精油1ml+酒精4ml=约5ml香水。</p>
        </div>

        {/* Heading 2 — 尾声 */}
        <hr style={{border: "none", borderTop: "0.5px solid rgba(0,0,0,0.08)", margin: "32px 0"}} />
        <h2 id="ch-ending" style={{fontSize: "22px", fontWeight: 700, color: "#1f2937", marginTop: "32px", marginBottom: "12px", letterSpacing: "0.05em"}}>
          尾声
        </h2>

        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>在刚听到《周易》课的老师说，卦象是一个变化的过程，每一爻都在前一爻的基础上加入变量，引起事情的发展和改变时，我突然感觉香水和卦象有种异曲同工之妙：每种香水都有前调、中调、后调，同样要随着时间的流逝，挥发性强的原料散去，才能闻到底下的、挥发性没那么强的原料的气息。于是，我萌生了将易经六十四卦映射到香水中的想法。</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>于是，这个网页诞生了。</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>它还不完善，这是一定的。因为一共有64*6=384爻，而每一爻又因占卜者所问问题的不同，有不同的解读，所以我并不能够将所有的结果都看一遍、改一遍。这些结果如果有不符合《周易》解释的地方，请以你对《周易》原文的理解为准。正如我的《周易》课老师zwj所说，我们每个人都应该形成自己对《周易》的理解。</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif"}}>但我希望这个测试可以给你带来一点点的娱乐效果，这就足够啦。</p>
        <p style={{fontFamily: "'KaiTi', 'STKaiti', '楷体', serif", textAlign: "right"}}>
          ——来自「未闻」作者<span style={{fontFamily: "'Times New Roman', serif"}}>Bastet</span>
        </p>

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
