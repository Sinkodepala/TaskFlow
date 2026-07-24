export type ActiveModal =
  | "createCard"
  | "taskDetails"
  | "deleteCard"
  | "createColumn"
  | "renameColumn"
  | "deleteColumn"
  | null;

export type ModalsState = {
  activeModal: ActiveModal;
  selectedColumnId: string | null;
  selectedCardId: string | null;
};

export const initialModalsState: ModalsState = {
  activeModal: null,
  selectedColumnId: null,
  selectedCardId: null,
};
