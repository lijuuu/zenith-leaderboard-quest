
import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

export default function useWindowSize(): WindowSize {
  const getSize = (): WindowSize => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const [windowSize, setWindowSize] = useState<WindowSize>(getSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
