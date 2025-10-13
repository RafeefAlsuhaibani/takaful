import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledById?: string;
}

export default function Modal({ open, onClose, children, labelledById }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the dialog
      if (dialogRef.current) {
        dialogRef.current.focus();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Return focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 opacity-0 animate-fadeIn"
      style={{ animation: 'fadeIn 200ms ease-out forwards' }}
      onClick={handleOverlayClick}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledById}
          dir="rtl"
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl outline-none overflow-y-auto max-h-[80vh] scale-95 opacity-0 animate-slideUp"
          style={{ animation: 'slideUp 250ms ease-out forwards' }}
          tabIndex={-1}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
