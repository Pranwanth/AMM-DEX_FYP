import React, { useState } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
  return (
    <>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6">{children}</div>
        </div>
      )}
    </>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ children }) => {
  return <div className="">{children}</div>;
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
  return <div className="mt-4 flex justify-end">{children}</div>;
};

// Example Usage
const ExampleDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={handleOpenDialog}>Open Dialog</button>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>Select a token</DialogHeader>
          <div className="bg-sky-50 flex justify-center items-center gap-2 p-1 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#082f49" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input placeholder="Search name" className="block w-full h-8 bg-transparent rounded-md text-base" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {/* Render your tokens here */}
          </div>
          <hr />
          <h4>Popular Tokens</h4>
        </DialogContent>
        <DialogFooter>
          <button onClick={handleCloseDialog}>Close</button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ExampleDialog;
