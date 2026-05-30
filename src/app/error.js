// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

export default function Error({ error, reset }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{
          backgroundColor: "#faf8f5",
          backgroundImage: "url('/paper-texture.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          color: "#2d2d2d",
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            letterSpacing: "0.5em",
            fontFamily: "'Ma Shan Zheng', cursive",
            color: "#444",
            marginBottom: "12px",
          }}
        >
          未闻
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "#999",
            letterSpacing: "2px",
            marginBottom: "32px",
          }}
        >
          命运不可见，但可以闻见
        </p>
        <div
          style={{
            maxWidth: "360px",
            width: "100%",
            padding: "32px 24px",
            borderRadius: "12px",
            background: "#fff",
            border: "0.5px solid rgba(0,0,0,0.08)",
            textAlign: "center",
            animation: "fadeIn 0.5s ease-out 0.2s both",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "16px", opacity: 0.6 }}>🍃</div>
          <h2
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#444",
              margin: "0 0 8px 0",
            }}
          >
            遇到了一点小问题
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#999",
              lineHeight: 1.7,
              margin: "0 0 24px 0",
            }}
          >
            占卜的香气被一阵风吹散了，别担心，重新试一次就好。
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                borderRadius: "8px",
                background: "#374151",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = 0.8)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
            >
              重试
            </button>
            <a
              href="/divine"
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                color: "#374151",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.opacity = 0.7)}
              onMouseOut={(e) => (e.target.style.opacity = 1)}
            >
              重新起卦
            </a>
          </div>
        </div>
        <p
          style={{
            fontSize: "11px",
            opacity: 0.4,
            letterSpacing: "1px",
            color: "#8B8177",
            marginTop: "48px",
          }}
        >
          © 2026 I Ching × Perfume Mapping · Created by Bastet
        </p>
      </div>
    </>
  );
}
