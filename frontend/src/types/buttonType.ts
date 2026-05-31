import { type ReactNode } from 'react';

export interface buttonType {
  id?: string;
  fn: (...args: any[]) => void;
  className?: string;
  children: ReactNode;
}
