// © 2026 Bastet — 未闻·I Ching × Perfume Mapping。All rights reserved.
"use client";

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "48px 24px", animation: "fadeIn 0.5s ease-out" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.6 }}>🍃</div>
          <p style={{ fontSize: "14px", color: "#999", margin: "0 0 16px 0", lineHeight: 1.7 }}>
            这一部分加载出了问题，试试刷新页面。
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: "8px 20px",
              fontSize: "13px",
              borderRadius: "8px",
              background: "#374151",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
