import React, { useState } from "react";

const JsonTool: React.FC = () => {
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const parseJson = (): any => {
    setError("");
    try {
      // 允许用户直接输入对象或数组
      return JSON.parse(input);
    } catch (e: any) {
      setError(e?.message || "JSON 解析失败");
      throw e;
    }
  };

  const onFormat = () => {
    try {
      const obj = parseJson();
      setOutput(JSON.stringify(obj, null, 2));
    } catch {}
  };

  const onMinify = () => {
    try {
      const obj = parseJson();
      setOutput(JSON.stringify(obj));
    } catch {}
  };

  const onValidate = () => {
    try {
      parseJson();
      setOutput("JSON 校验通过 ✅");
    } catch {}
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {}
  };

  const onClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <section className="card" style={{ padding: 12 }}>
      <div className="section-header"><h2>JSON 格式化 / 校验</h2></div>
      <div className="tool-body">
        <div className="field">
          <label>输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder='例如: {"a":1, "b":[true, null, "x"]}'
          />
        </div>
        <div className="tool-actions">
          <button onClick={onFormat}>格式化</button>
          <button onClick={onMinify}>压缩</button>
          <button onClick={onValidate}>校验</button>
          <button onClick={onClear}>清空</button>
        </div>
        {error && <div className="error-text">{error}</div>}
        <div className="field">
          <label>输出结果</label>
          <textarea value={output} readOnly rows={12} />
        </div>
        <div className="tool-actions">
          <button onClick={onCopy}>复制输出</button>
        </div>
      </div>
    </section>
  );
};

export default JsonTool;