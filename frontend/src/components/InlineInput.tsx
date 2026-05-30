import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import type { inlineInputType } from '../types/inputType';

const InlineInput = ({ value, onSave }: inlineInputType) => {
  const [text, setText] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
   const handleSubmit = (e: any) => {
     if (text.trim() !== value.trim()) {
       onSave(e, text);
     }
     setIsOpen(false);
   };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSave(e, text);
      setIsOpen(false);
    }
    if (e.key === 'Escape') {
      setText(value);
      setIsOpen(false);
    }
  };
  return isOpen ? (
    <input
      type="text"
      placeholder="Task"
      onKeyDown={handleKeyDown}
      value={text}
      onChange={onChangeInput}
      autoFocus
      onBlur={handleSubmit}
    />
  ) : (
    <div onClick={() => setIsOpen(true)}>{text}</div>
  );
};

export default InlineInput;
