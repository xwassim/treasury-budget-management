import React, { useState, useRef, useEffect } from 'react';


interface EditableCellProps {
  value: number;
  onChange: (value: number) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleBlur = () => {
    const parsedValue = parseFloat(editValue) || 0;
    onChange(parsedValue);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value.toString());
    }
  };
  
  return (
    <div className="w-full">
      {isEditing ? (
        <input
          ref={inputRef}
          type="number"
          step="0.01"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full p-1 text-center border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full p-1 text-center hover:bg-gray-100 cursor-pointer rounded transition-colors duration-150"
        >
          {value}
        </div>
      )}
    </div>
  );
};

export default EditableCell;