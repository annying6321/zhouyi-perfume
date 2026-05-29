// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

export default function Home() {
  return (
    <>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Cormorant+Garamond:ital@0;1&display=swap');`}</style>
    <div className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{
        backgroundColor: "#faf8f5",
        backgroundImage: "url('/paper-texture.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: "#2C2C2C",
      }}
    >
      {/* 顶部品牌标识 */}
      <div className="text-center mb-14">
        <p className="text-xs mb-5" style={{color: "#8B8177", letterSpacing: "0.4em", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "16px"}}>
          I CHING × PERFUME MAPPING
        </p>
        <h1 className="text-5xl sm:text-6xl tracking-[0.3em]" style={{fontWeight: 400, letterSpacing: "0.5em", color: "#2C2C2C", fontFamily: "'Ma Shan Zheng', cursive"}}>
          未闻
        </h1>
      </div>

      {/* 核心文案 */}
      <div className="text-center max-w-xs sm:max-w-sm mb-14">
        <p className="text-sm sm:text-base" style={{color: "#5C534A", lineHeight: "2.4", letterSpacing: "0.08em"}}>
          当卦象不再只是符号，<br />
          而化作可以被感知的气味，<br />
          这里尝试<strong>用香气重新解读《周易》</strong>。<br /><br />
          不妨试一试，<br />
          看看属于你的那一缕气息，<br />
          正如何缓缓展开。
        </p>
      </div>

      {/* 开始测试按钮 — HERTI 风格 */}
      <a
        href="/divine"
        className="inline-block px-10 py-3 text-sm transition-all duration-300"
        style={{
          background: "#2C2C2C",
          color: "#FAF5EF",
          letterSpacing: "0.3em",
        }}
      >
        开始测试
      </a>

      {/* 底部提示 */}
      <p className="text-xs mt-8" style={{color: "#A0978D", letterSpacing: "0.2em"}}>
        请在心思清静，意念集中时打开
      </p>

      {/* 底部版权信息 */}
      <div className="text-center mt-20 mb-8" style={{fontSize: "11px", opacity: 0.4, letterSpacing: "1px", lineHeight: "2", color: "#8B8177"}}>
        <p>这里的答案更像一缕香气，飘过即可，不必当作命运的说明书。</p>
        <p>© 2026 I Ching × Perfume Mapping · Created by Bastet</p>
        <p>原创作品 · 抄袭必究</p>
      </div>
    </div>
    </>
  );
}
