import { useState, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

const BotDropdown = ({ botId, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle opening and closing of dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown if clicked outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Attach the event listener when dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update onEdit and onDelete to include botId
  const handleEdit = () => {
    onEdit(botId); // Pass the botId to onEdit handler
  };

  const handleDelete = () => {
    onDelete(botId); // Pass the botId to onDelete handler
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Three Dots Icon */}
      <button
        onClick={toggleDropdown}
        className=" "
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <BsThreeDotsVertical size={24} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={handleEdit} // Updated to call handleEdit
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Edit Bot
            </button>
            <button
              onClick={handleDelete} // Updated to call handleDelete
              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-red-900"
              role="menuitem"
            >
              Delete Bot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotDropdown;
