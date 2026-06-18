import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import type { inlineInputType } from '../../types/inputType';
import style from './InlineInput.module.css'

const InlineInput = ({ value, onSave, isCreation = false, setIsCliked }: inlineInputType) => {
  const [text, setText] = useState(value);
  const [isOpen, setIsOpen] = useState(isCreation);

  useEffect(() => {
    setText(value);
  }, [value]);
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const onSubmit = () => {
    const trimmed = text.trim();
    if (trimmed) {
      if (isCreation || trimmed !== value.trim()) {
        onSave(trimmed);
      }
      if (isCreation) {
        setText('');
      }
    } else {
      if (!isCreation) {
        setText(value);
      }
    }
    setIsOpen(false);
    setIsCliked?.(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') {
      setText(value);
      setIsOpen(false);
      setIsCliked?.(false);
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
      className={style.input}
    />
  ) : (
    <div onClick={() => setIsOpen(true)} className={style.text}>
      {text}
    </div>
  );
};

export default InlineInput;
