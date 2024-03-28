import React, { useEffect, useRef } from 'react';

interface PopoverProps {
  anchorElement: HTMLElement | null;
  isOpen: boolean;
  children: React.ReactNode
  closePopover: () => void
}

const Popover: React.FC<PopoverProps> = ({ anchorElement, isOpen, children, closePopover }) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        closePopover(); // Close the popover if click occurs outside of it
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closePopover]);

  if (!anchorElement) {
    return null; // Return null if anchorElement is not provided
  }

  return (
    <>
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 min-w-min bg-white border border-gray-300 shadow-lg rounded-md p-2"
          style={{
            top: anchorElement.offsetTop + anchorElement.offsetHeight + 'px',
            left: anchorElement.offsetLeft + 'px',
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Popover;
