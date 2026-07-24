import type { Dispatch, SetStateAction } from "react";

import type { ModalsState } from "@/modules/boards/hooks/modals/modals.types";

type SetModalsState = Dispatch<SetStateAction<ModalsState>>;

export const useColumnModals = (
  state: ModalsState,
  setState: SetModalsState,
) => {
  const openCreateColumnModal = () => {
    setState({
      activeModal: "createColumn",
      selectedColumnId: null,
      selectedCardId: null,
    });
  };

  const closeCreateColumnModal = () => {
    setState((prev) => ({
      ...prev,
      activeModal: null,
    }));
  };

  const openRenameColumnModal = (columnId: string) => {
    setState({
      activeModal: "renameColumn",
      selectedColumnId: columnId,
      selectedCardId: null,
    });
  };

  const closeRenameColumnModal = () => {
    setState((prev) => ({
      ...prev,
      activeModal: null,
      selectedColumnId: null,
    }));
  };

  const openDeleteColumnModal = (columnId: string) => {
    setState({
      activeModal: "deleteColumn",
      selectedColumnId: columnId,
      selectedCardId: null,
    });
  };

  const closeDeleteColumnModal = () => {
    setState((prev) => ({
      ...prev,
      activeModal: null,
      selectedColumnId: null,
    }));
  };

  return {
    selectedColumnId: state.selectedColumnId,
    isCreateColumnOpen: state.activeModal === "createColumn",
    openCreateColumnModal,
    closeCreateColumnModal,
    isRenameColumnOpen: state.activeModal === "renameColumn",
    openRenameColumnModal,
    closeRenameColumnModal,
    isDeleteColumnOpen: state.activeModal === "deleteColumn",
    openDeleteColumnModal,
    closeDeleteColumnModal,
  };
};
