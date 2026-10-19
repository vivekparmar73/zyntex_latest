import { useEffect } from 'react';

const EDITABLE = 'input, textarea, select, [contenteditable="true"]';

/**
 * Discourages casual copying: blocks the context menu, image dragging and copy/cut
 * outside form fields. (Text selection is disabled in CSS.) This cannot stop screenshots
 * or browser developer tools — it only removes the easy routes.
 */
export default function useContentProtection() {
  useEffect(() => {
    const onContextMenu = (e) => {
      if (!e.target.closest?.(EDITABLE)) e.preventDefault();
    };
    const onDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.closest?.('a img')) e.preventDefault();
    };
    const onCopy = (e) => {
      if (!e.target.closest?.(EDITABLE)) e.preventDefault();
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('copy', onCopy);
    document.addEventListener('cut', onCopy);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('cut', onCopy);
    };
  }, []);
}
