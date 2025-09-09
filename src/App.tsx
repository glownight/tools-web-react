import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Fireworks from "./components/Fireworks";
import TypeWriter from "./components/TypeWriter";
import JsonTool from "./tools/JsonTool";
import UrlTool from "./tools/UrlTool";
import Base64Tool from "./tools/Base64Tool";
import UuidTool from "./tools/UuidTool";
import TimeTool from "./tools/TimeTool";

function App() {
  const location = useLocation();
  const [fireworksOn, setFireworksOn] = useState(false);

  const isHome = location.pathname === "/" || location.pathname === "/home";

  // 工具元数据
  type ToolMeta = {
    path: string;
    name: string;
    desc: string;
    category: string;
    keywords?: string[];
  };

  const tools: ToolMeta[] = [
    { path: "/tools/json", name: "JSON 格式化/校验", desc: "格式化、压缩、校验 JSON 文本，支持复制输出。", category: "数据处理", keywords: ["json", "format", "validate"] },
    { path: "/tools/url", name: "URL 编解码", desc: "对 URL 或查询字符串进行编码/解码。", category: "编码解码", keywords: ["url", "encode", "decode"] },
    { path: "/tools/base64", name: "Base64 编解码", desc: "将文本与 Base64 互转，支持 UTF-8。", category: "编码解码", keywords: ["base64", "b64"] },
    { path: "/tools/uuid", name: "UUID 生成", desc: "一键生成 RFC4122 v4 UUID。", category: "开发辅助", keywords: ["uuid", "id"] },
    { path: "/tools/time", name: "时间戳转换", desc: "在 Unix 时间戳与日期之间转换。", category: "时间日期", keywords: ["time", "timestamp"] },
  ];

  // 工具列表页组件（侧边分类 + 搜索 + 卡片栅格 + 收藏/最近）
  function ToolsIndex() {
    const [q, setQ] = useState("");
    const [cat, setCat] = useState<string>("全部");
    const [favs, setFavs] = useState<string[]>(() => {
      try {
        const raw = localStorage.getItem("tool_favorites");
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    });
    const [recent, setRecent] = useState<string[]>(() => {
      try {
        const raw = localStorage.getItem("tool_recent");
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    });

    const allCats = Array.from(new Set(["全部", ...tools.map(t => t.category)]));

    const lowerQ = q.trim().toLowerCase();
    const filtered = tools.filter(t => {
      if (cat !== "全部" && t.category !== cat) return false;
      if (!lowerQ) return true;
      const hay = `${t.name} ${t.desc} ${(t.keywords||[]).join(" ")}`.toLowerCase();
      return hay.includes(lowerQ);
    });

    const isFav = (path: string) => favs.includes(path);
    const toggleFav = (path: string) => {
      setFavs(prev => {
        const next = prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path];
        localStorage.setItem("tool_favorites", JSON.stringify(next));
        return next;
      });
    };

    const recentTools = recent
      .map(p => tools.find(t => t.path === p))
      .filter(Boolean) as ToolMeta[];

    const favTools = favs
      .map(p => tools.find(t => t.path === p))
      .filter(Boolean) as ToolMeta[];

    return (
      <section className="card" style={{ padding: 0 }}>
        <div className="tools-layout">
          <aside className="side-nav">
            <div className="side-section">
              <div className="side-title">分类</div>
              <nav className="side-links">
                {allCats.map(c => (
                  <button
                    key={c}
                    className={`side-link ${cat === c ? 'active' : ''}`}
                    onClick={() => setCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </nav>
            </div>

            <div className="side-section">
              <div className="side-title">常用收藏</div>
              {favTools.length === 0 ? (
                <div className="side-empty">暂无收藏，点击卡片右上角星标可收藏</div>
              ) : (
                <ul className="side-mini-list">
                  {favTools.map(t => (
                    <li key={t.path}><Link to={t.path}>{t.name}</Link></li>
                  ))}
                </ul>
              )}
            </div>

            <div className="side-section">
              <div className="side-title">最近使用</div>
              {recentTools.length === 0 ? (
                <div className="side-empty">暂无记录</div>
              ) : (
                <ul className="side-mini-list">
                  {recentTools.map(t => (
                    <li key={t.path}><Link to={t.path}>{t.name}</Link></li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <div className="tools-content">
            <div className="search-box">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索工具名称/描述/关键词..."
              />
            </div>

            <div className="tools-grid">
              {filtered.map(t => (
                <div key={t.path} className="tool-card">
                  <button
                    className={`star-btn ${isFav(t.path) ? 'on' : ''}`}
                    onClick={() => toggleFav(t.path)}
                    aria-label={isFav(t.path) ? '取消收藏' : '收藏'}
                    title={isFav(t.path) ? '取消收藏' : '收藏'}
                  >★</button>
                  <Link className="tool-title" to={t.path}>{t.name}</Link>
                  <div className="tool-desc">{t.desc}</div>
                  <div className="tool-meta">
                    <span className="tag">{t.category}</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="empty">未找到匹配的工具</div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="app">
      <header className="page-header">
        <div className="container header-inner">
          <div className="header-left">
            <h1 className="site-title">
              <TypeWriter text="Hi，欢迎来到我的工具站~" />
            </h1>
            <div className="subnav">
              <Link className={isHome ? "active" : ""} to="/">主页</Link>
              <Link className={!isHome ? "active" : ""} to="/tools">工具</Link>
            </div>
          </div>
          <div className="header-right">
            <button
              className={`kawaii-toggle ${fireworksOn ? "on" : "off"}`}
              onClick={() => setFireworksOn((v) => !v)}
              aria-pressed={fireworksOn}
              title={fireworksOn ? "关闭烟花" : "打开烟花"}
            >
              <span className="spark">✦</span>
              <span className="face" aria-hidden>
                {fireworksOn ? "(｡•́︿•̀｡)" : "(≧▽≦)"}
              </span>
              <span className="label">
                {fireworksOn ? "点击我关闭烟花" : "点击我开启烟花"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="container columns" style={{ gridTemplateColumns: "1fr" }}>
        <main className="main-left">
          <Routes>
            <Route
              path="/"
              element={
                <section className="card" style={{ padding: 16 }}>
                  <div className="section-header"><h2>工具站简介</h2></div>
                  <p style={{ padding: 12, color: "#cfd6d5" }}>
                    这里是基于 React + Vite 构建的个人常用工具集合。点击上方“工具”进入工具列表。
                  </p>
                </section>
              }
            />

            <Route
              path="/tools"
              element={<ToolsIndex />}
            />
            <Route path="/tools/json" element={<JsonTool />} />
            <Route path="/tools/url" element={<UrlTool />} />
            <Route path="/tools/base64" element={<Base64Tool />} />
            <Route path="/tools/uuid" element={<UuidTool />} />
            <Route path="/tools/time" element={<TimeTool />} />

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Fireworks enabled={fireworksOn} />
    </div>
  );
}

export default App;
