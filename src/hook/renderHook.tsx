import { useEffect, useRef } from 'react';

export function useRenderCount() {
  const count = useRef(0);
  useEffect(() => {
    count.current += 1;
    console.log(`Рендер №${count.current}`);
  });
}