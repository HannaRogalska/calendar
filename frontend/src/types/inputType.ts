
export interface inlineInputType {
  value: string;
  onSave: (text: string) => void;
  isCreation?: boolean;
  setIsCliked?: (value: boolean) => void;
}
