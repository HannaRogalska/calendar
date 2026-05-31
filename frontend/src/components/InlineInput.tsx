import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import type { inlineInputType } from '../types/inputType';

const InlineInput = ({ value, onSave }: inlineInputType) => {
  const [text, setText] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const onSubmit = () => {
    if (text.trim() !== value.trim()) {
      onSave(text);
    }
    setIsOpen(false);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
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
      onBlur={onSubmit}
    />
  ) : (
    <div onClick={() => setIsOpen(true)}>{text}</div>
  );
};

export default InlineInput;
