import React, { useState } from "react";

function genUUID() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  // Fallback RFC4122 v4
  let d = new Date().getTime();
  let d2 = (performance && performance.now && performance.now()*1000) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16; 
    if(d > 0){
      r = (d + r)%16 | 0;
      d = Math.floor(d/16);
    } else {
      r = (d2 + r)%16 | 0;
      d2 = Math.floor(d2/16);
    }
    return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
  });
}

const UuidTool: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const onGenerate = () => setValue(genUUID());
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(value); } catch {}
  };
  const onClear = () => setValue("");
  return (
    <section className="card" style={{ padding: 12 }}>
      <div className="section-header"><h2>UUID 生成</h2></div>
      <div className="tool-body">
        <div className="tool-actions">
          <button onClick={onGenerate}>生成 UUID</button>
          <button onClick={onCopy} disabled={!value}>复制</button>
          <button onClick={onClear} disabled={!value}>清空</button>
        </div>
        <div className="field">
          <label>结果</label>
          <input value={value} readOnly placeholder="点击生成" />
        </div>
      </div>
    </section>
  );
};

export default UuidTool;