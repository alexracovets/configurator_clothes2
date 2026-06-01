'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

import type { SlidingIndicatorReturnType } from '@types';

const useSlidingIndicator = (activeIndex: number): SlidingIndicatorReturnType => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const getItemRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      itemRefs.current[index] = element;
    },
    [],
  );

  const updateIndicator = useCallback(() => {
    const wrapper = wrapperRef.current;
    const element = itemRefs.current[activeIndex];
    const indicator = indicatorRef.current;

    if (!wrapper || !element || !indicator) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    indicator.style.transform = `translateX(${elementRect.left - wrapperRect.left}px)`;
    indicator.style.width = `${elementRect.width}px`;
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const observer = new ResizeObserver(updateIndicator);
    observer.observe(wrapper);

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    window.addEventListener('resize', updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator]);

  return { wrapperRef, getItemRef, indicatorRef };
};

export { useSlidingIndicator };
