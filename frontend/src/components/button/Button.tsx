import type { buttonType } from "../../types/buttonType";


const Button = ({ id, fn, children, className }: buttonType) => {
  return (
    <button type="button" onClick={() => (id !== undefined ? fn(id) : fn())} className={className}>
      {children}
    </button>
  );
};

export default Button

