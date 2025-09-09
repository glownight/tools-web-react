"use client";
import React, { useState, useEffect, useCallback } from "react";

interface TypeWriterProps {
  text: string;
  className?: string;
}

const TypeWriter: React.FC<TypeWriterProps> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  // const [showHeart, setShowHeart] = useState(false);

  const handleClick = () => {
    // 重置状态，重新开始打字效果
    setDisplayText("");
    setIsPaused(false);
    // setShowHeart(false);
  };

  const typeEffect = useCallback(() => {
    if (isPaused) return;

    const typeSpeed = 80; // 更快的打字速度，避免首屏空白

    if (displayText === text) {
      // setShowHeart(true);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(text.substring(0, displayText.length + 1));
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, text, isPaused]);

  useEffect(() => {
    typeEffect();
  }, [typeEffect]);

  return (
    <span className="inline-flex items-center gap-2" aria-live="polite">
      <span
        onClick={handleClick}
        className={className}
        style={{ cursor: "pointer" }}
      >
        {displayText || text}
      </span>
      {/* {showHeart && (
        <span className={styles.heart}>❤️</span>
      )} */}
    </span>
  );
};

export default TypeWriter;
