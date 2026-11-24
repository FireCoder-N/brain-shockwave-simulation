import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const WIDTH = 256; // px, tooltip width (w-64)

/**
 * ⓘ button that reveals a short explanation: on mouse hover, keyboard focus, or tap/click.
 * The tooltip is rendered in a portal with fixed positioning, so scrolling containers
 * (e.g. the parameter panel) never clip it.
 *
 * @param {{ text: string, label: string }} props  label = accessible name of the button.
 */
export default function InfoTip({ text, label }) {
  const [pos, setPos] = useState(/** @type {{ left: number, top: number } | null} */ (null));
  const buttonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const tipId = useId();

  const open = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, r.left + r.width / 2 - WIDTH / 2),
      window.innerWidth - WIDTH - 8,
    );
    const below = r.bottom + 8;
    // Flip above the icon when there is no room below.
    setPos({ left, top: below + 96 > window.innerHeight ? r.top - 8 - 96 : below });
  };
  const close = () => setPos(null);

  useEffect(() => {
    if (!pos) return;
    /** @param {KeyboardEvent} e */
    const onKey = (e) => e.key === 'Escape' && close();
    /** @param {PointerEvent} e */
    const onPointerDown = (e) => {
      if (!buttonRef.current?.contains(/** @type {Node} */ (e.target))) close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [pos]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={pos !== null}
        aria-describedby={pos ? tipId : undefined}
        onPointerEnter={(e) => e.pointerType === 'mouse' && open()}
        onPointerLeave={(e) => e.pointerType === 'mouse' && close()}
        onFocus={(e) => e.currentTarget.matches(':focus-visible') && open()}
        onBlur={close}
        onClick={() => (pos ? close() : open())}
        className="inline-grid size-5 place-items-center rounded-full align-middle text-muted transition-colors hover:text-accent"
      >
        <svg
          viewBox="0 0 20 20"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <circle cx="10" cy="10" r="8" />
          <path strokeLinecap="round" d="M10 9v5" />
          <circle cx="10" cy="6.2" r=".6" fill="currentColor" />
        </svg>
      </button>
      {pos &&
        createPortal(
          <div
            id={tipId}
            role="tooltip"
            style={{ left: pos.left, top: pos.top, width: WIDTH }}
            className="pointer-events-none fixed z-[70] rounded-lg border border-line bg-bg px-3 py-2 text-xs leading-relaxed text-fg shadow-lg"
          >
            {text}
          </div>,
          document.body,
        )}
    </>
  );
}
