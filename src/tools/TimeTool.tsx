import React, { useMemo, useState } from "react";

function format(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const TimeTool: React.FC = () => {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");

  const now = useMemo(() => Date.now(), []);

  const tsToDate = () => {
    try {
      const n = Number(timestamp);
      if (Number.isNaN(n)) throw new Error("不是合法的时间戳");
      const ms = n < 1e12 ? n * 1000 : n; // 兼容秒/毫秒
      setDateStr(format(ms));
    } catch (e: any) {
      setDateStr(e?.message || "转换失败");
    }
  };

  const dateToTs = () => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) throw new Error("日期格式不正确，如 2024-01-02 12:30:00");
      setTimestamp(String(Math.floor(d.getTime() / 1000)));
    } catch (e: any) {
      setTimestamp(e?.message || "转换失败");
    }
  };

  const copyTs = async () => { try { await navigator.clipboard.writeText(timestamp); } catch {} };
  const copyDate = async () => { try { await navigator.clipboard.writeText(dateStr); } catch {} };

  const clear = () => { setTimestamp(""); setDateStr(""); };

  return (
    <section className="card" style={{ padding: 12 }}>
      <div className="section-header"><h2>时间戳转换</h2></div>
      <div className="tool-body">
        <div className="field">
          <label>当前时间（毫秒）</label>
          <input value={String(now)} readOnly />
        </div>
        <div className="grid2">
          <div className="field">
            <label>时间戳（秒或毫秒）</label>
            <input value={timestamp} onChange={(e)=>setTimestamp(e.target.value)} placeholder="例如 1735718400 或 1735718400000" />
          </div>
          <div className="tool-actions">
            <button onClick={tsToDate}>转日期</button>
            <button onClick={copyTs} disabled={!timestamp}>复制时间戳</button>
          </div>
        </div>
        <div className="grid2">
          <div className="field">
            <label>日期</label>
            <input value={dateStr} onChange={(e)=>setDateStr(e.target.value)} placeholder="YYYY-MM-DD HH:mm:ss" />
          </div>
          <div className="tool-actions">
            <button onClick={dateToTs}>转时间戳</button>
            <button onClick={copyDate} disabled={!dateStr}>复制日期</button>
          </div>
        </div>
        <div className="tool-actions">
          <button onClick={clear}>清空</button>
        </div>
      </div>
    </section>
  );
};

export default TimeTool;