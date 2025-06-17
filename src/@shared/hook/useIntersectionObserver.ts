import { useRef, useCallback , useEffect} from "react";

const useIntersectionObserver = (onIntersect: () => void) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(onIntersect);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callbackRef.current();
          }
        },
        {
          threshold: 0,
          rootMargin: "400px",
        }
      );
    }
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleRef = useCallback((el: HTMLElement | null) => {
    if (targetRef.current) {
      observerRef.current?.unobserve(targetRef.current);
    }
    if (el) {
      observerRef.current?.observe(el);
    }
    targetRef.current = el;
  }, []);

  return handleRef;
};

export default useIntersectionObserver;