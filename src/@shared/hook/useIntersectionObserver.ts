import { useRef, useCallback, useEffect } from "react";

const useIntersectionObserver = (
  onIntersect: () => void,
  options = { threshold: 0.1, rootMargin: "200px" }
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(onIntersect);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    callbackRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log("Intersection entry:", {
            isIntersecting: entry.isIntersecting,
            boundingClientRect: entry.boundingClientRect,
            intersectionRatio: entry.intersectionRatio,
            targetId: (entry.target as HTMLElement).id || "no-id",
          });
          if (entry.isIntersecting) {
            console.log("Intersection observed!");
            callbackRef.current();
          }
        });
      },
      {
        threshold: options.threshold,
        rootMargin: options.rootMargin,
        root: null,
      }
    );

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [options.threshold, options.rootMargin]);

  const handleRef = useCallback((el: HTMLElement | null) => {
    if (targetRef.current) {
      observerRef.current?.unobserve(targetRef.current);
    }
    if (el) {
      console.log("Observing element:", { id: el.id, height: el.offsetHeight });
      observerRef.current?.observe(el);
    }
    targetRef.current = el;
  }, []);

  return handleRef;
};

export default useIntersectionObserver;