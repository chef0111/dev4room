"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const TopProgress = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const lastUrlRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const finish = useCallback(() => {
    if (!startedRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setValue((prev) => {
      const target = 100;
      const diff = target - prev;
      return prev + diff * 0.3;
    });

    // Complete to 100% after a brief moment
    setTimeout(() => {
      setValue(100);
      // Hide after showing 100%
      setTimeout(() => {
        setVisible(false);
        setValue(0);
        startedRef.current = false;
      }, 150);
    }, 50);
  }, []);

  const startAnimating = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setVisible(true);
    setValue(0);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a maximum timeout to force finish after 15 seconds
    timeoutRef.current = setTimeout(() => {
      if (startedRef.current) {
        finish();
      }
    }, 15000);

    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      setValue((prev) => {
        let progress = 0;

        // Phase 1: Quick initial progress (0-30%)
        if (elapsed <= 200) {
          progress = Math.min(30, (elapsed / 200) * 30);
        }
        // Phase 2: Slower progress (30-70%)
        else if (elapsed <= 1000) {
          const phase2Elapsed = elapsed - 200;
          progress = 30 + Math.min(40, (phase2Elapsed / 800) * 40);
        }
        // Phase 3: Very slow progress (70-90%)
        else if (elapsed <= 3000) {
          const phase3Elapsed = elapsed - 1000;
          progress = 70 + Math.min(20, (phase3Elapsed / 2000) * 20);
        }
        // Phase 4: Extremely slow progress (90-95%)
        else if (elapsed <= 8000) {
          const phase4Elapsed = elapsed - 3000;
          progress = 90 + Math.min(5, (phase4Elapsed / 5000) * 5);
        }
        // Phase 5: Final slow crawl (95-98%)
        else {
          const phase5Elapsed = elapsed - 8000;
          progress = 95 + Math.min(3, (phase5Elapsed / 10000) * 3);
        }

        progress = Math.max(0, Math.min(98, progress));
        return Math.max(prev, progress);
      });

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);
  }, [finish]);

  const onClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const isModified =
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        anchor.target === "_blank";
      const href = anchor.getAttribute("href") || "";
      if (
        isModified ||
        !href ||
        href.startsWith("http") ||
        href.startsWith("https") ||
        href.startsWith("mailto:")
      )
        return;
      if (href.startsWith("#")) return;

      if (href.startsWith("/")) {
        const nextUrl = new URL(href, window.location.origin);
        const current = `${window.location.pathname}${window.location.search}`;
        const next = `${nextUrl.pathname}${nextUrl.search}`;
        if (next !== current) {
          lastUrlRef.current = next;
          startAnimating();
        }
      }
    },
    [startAnimating],
  );

  useEffect(() => {
    window.addEventListener("click", onClick, { capture: true });
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      window.removeEventListener("click", onClick, { capture: true } as any);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onClick]);

  const onPopState = useCallback(() => {
    startAnimating();
  }, [startAnimating]);

  useEffect(() => {
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onPopState]);

  useEffect(() => {
    if (!startedRef.current) return;
    const current = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    if (lastUrlRef.current && current === lastUrlRef.current) {
      finish();
    } else {
      finish();
    }
  }, [pathname, searchParams, finish]);

  if (!visible) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[100]">
      <Progress value={value} className="h-0.5 rounded-none" />
    </div>
  );
};

export default TopProgress;
