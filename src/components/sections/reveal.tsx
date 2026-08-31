"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type FunctionComponent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Stagger, in milliseconds, for items revealed as a group. */
  readonly delay?: number;
  readonly as?: ElementType;
}

/**
 * Reveals its children once they scroll into view.
 *
 * The transition itself lives in CSS behind a `prefers-reduced-motion` query,
 * so this component only ever sets a data attribute. With reduced motion the
 * CSS rule does not apply and the content is simply visible — no flash of
 * hidden content, and nothing to special-case here.
 *
 * The observer disconnects after the first reveal: these animations run once.
 */
export function Reveal({ children, className, delay = 0, as: Comp = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /**
   * See the note in `Container`: a variable tag collapses to `never` props, so
   * the forwarded props — including the ref this component depends on — are
   * named explicitly.
   */
  const Tag = Comp as FunctionComponent<
    ComponentPropsWithoutRef<"div"> & { ref?: RefObject<HTMLElement | null> }
  >;

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
