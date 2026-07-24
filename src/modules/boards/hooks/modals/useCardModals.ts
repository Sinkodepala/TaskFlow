import type { Dispatch, SetStateAction } from "react";

import type { ModalsState } from "@/modules/boards/hooks/modals/modals.types";

type SetModalsState = Dispatch<SetStateAction<ModalsState>>;

export const useCardModals = (state: ModalsState, setState: SetModalsState) => {
  const openCreateCardModal = (columnId: string) => {
    setState({
      activeModal: "createCard",
      selectedColumnId: columnId,
      selectedCardId: null,
    });
  };

  const closeCreateCardModal = () => {
    setState((prev) => ({
      ...prev,
      activeModal: null,
      selectedColumnId: null,
    }));
  };

  const openTaskDetailsModal = (cardId: string) => {
    setState({
      activeModal: "taskDetails",
      selectedColumnId: null,
      selectedCardId: cardId,
    });
  };

  const closeTaskDetailsModal = () => {
    setState((prev) => ({
      ...prev,
      activeModal: null,
      selectedCardId: null,
    }));
  };

  const openDeleteCardModal = () => {
    setState((prev) => ({
      activeModal: "deleteCard",
      selectedColumnId: null,
      selectedCardId: prev.selectedCardId,
    }));
  };

  const closeDeleteCardModal = () => {
    setState((prev) => ({
      ...prev,
      activeModal: prev.selectedCardId ? "taskDetails" : null,
    }));
  };

  return {
    isCreateCardOpen: state.activeModal === "createCard",
    selectedCardId: state.selectedCardId,
    openCreateCardModal,
    closeCreateCardModal,
    openTaskDetailsModal,
    closeTaskDetailsModal,
    isDeleteCardOpen: state.activeModal === "deleteCard",
    openDeleteCardModal,
    closeDeleteCardModal,
  };
};
