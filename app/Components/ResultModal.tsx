// Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  convertedAddresses: string[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, convertedAddresses }) => {
  if (!isOpen) return null;

  const handleCopy = () => {
    const addressesText = convertedAddresses.join('\n');
    navigator.clipboard.writeText(addressesText)
      .then(() => alert("Addresses copied to clipboard!"))
      .catch((err) => alert("Failed to copy addresses: " + err));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Converted Addresses</h2>
        <textarea
          value={convertedAddresses.join("\n")}
          readOnly
          className="w-full h-40 rounded-lg border bg-white dark:bg-stone-900 text-gray-900 dark:text-gray-100 p-2"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handleCopy}
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 text-sm h-10 px-4"
          >
            Copy Addresses
          </button>
          <button
            onClick={onClose}
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-red-500 text-white hover:bg-red-600 text-sm h-10 px-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
