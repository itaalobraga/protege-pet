import { useState, useRef, useEffect, useCallback } from "react";

export function useDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  const close = useCallback(() => setIsOpen(false), []);

  return [isOpen, toggle, close, ref];
}
