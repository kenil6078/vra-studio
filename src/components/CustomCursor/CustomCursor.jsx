import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Set initial position offscreen to avoid starting flash in top-left corner
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      // Snappy response for the inner dot
      gsap.to(dot, {
        x,
        y,
        duration: 0.08,
        ease: 'power2.out',
      });

      // Elastic trailing lag for the outer ring
      gsap.to(ring, {
        x,
        y,
        duration: 0.35,
        ease: 'power3.out',
      });
    };

    // Hover scales and styling adjustments
    const onMouseEnterLink = () => {
      gsap.to(ring, {
        scale: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.9)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        scale: 0.5,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const onMouseLeaveLink = () => {
      gsap.to(ring, {
        scale: 1,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.45)',
        duration: 0.3,
        ease: 'power2.out',
      });
      gsap.to(dot, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Initial query to attach listeners to active interactive elements
    const attachListeners = (elements) => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
        el.addEventListener('mouseenter', onMouseEnterLink);
        el.addEventListener('mouseleave', onMouseLeaveLink);
      });
    };

    const queryAndAttach = () => {
      const elements = document.querySelectorAll('a, button, [role="button"], .cursor-pointer, input, textarea, select');
      attachListeners(elements);
    };

    queryAndAttach();

    // Use MutationObserver to monitor dynamically loaded children (e.g. navigation pages)
    const observer = new MutationObserver(() => {
      queryAndAttach();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      const elements = document.querySelectorAll('a, button, [role="button"], .cursor-pointer, input, textarea, select');
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
};

export default CustomCursor;
