import React, { useState } from "react";

const Base64Tool: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const encode = () => {
    try {
      const text = new TextEncoder().encode(input);
      const base64 = btoa(String.fromCharCode(...text));
      setOutput(base64);
    } catch (e) {
      setOutput("Base64 编码失败");
    }
  };

  const decode = () => {
    try {
      const binary = atob(input);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const decoded = new TextDecoder().decode(bytes);
      setOutput(decoded);
    } catch (e) {
      setOutput("Base64 解码失败");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {}
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <section className="card" style={{ padding: 12 }}>
      <div className="section-header"><h2>Base64 编解码</h2></div>
      <div className="tool-body">
        <div className="field">
          <label>输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="任意文本"
          />
        </div>
        <div className="tool-actions">
          <button onClick={encode}>编码</button>
          <button onClick={decode}>解码</button>
          <button onClick={clear}>清空</button>
        </div>
        <div className="field">
          <label>输出</label>
          <textarea value={output} readOnly rows={6} />
        </div>
        <div className="tool-actions">
          <button onClick={copy}>复制输出</button>
        </div>
      </div>
    </section>
  );
};

export default Base64Tool;