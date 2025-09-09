import React, { useState } from "react";

const UrlTool: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => {
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setOutput("URL 解码失败");
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
      <div className="section-header"><h2>URL 编解码</h2></div>
      <div className="tool-body">
        <div className="field">
          <label>输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="例如: https://example.com?q=a b&x=你好"
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

export default UrlTool;