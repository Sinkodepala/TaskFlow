import { useState } from "react";

export const useBoardModals = () => {
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(
    null,
  );

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);

  const openCreateCardModal = (columnId: string) => {
    setSelectedCardId(null);
    setIsDeleteCardOpen(false);
    setIsCreateColumnOpen(false);
    setSelectedColumnId(columnId);
    setIsCreateCardOpen(true);
  };

  const closeCreateCardModal = () => {
    setSelectedColumnId(null);
    setIsCreateCardOpen(false);
  };

  const openTaskDetailsModal = (cardId: string) => {
    setSelectedColumnId(null);
    setIsCreateCardOpen(false);
    setIsDeleteCardOpen(false);
    setIsCreateColumnOpen(false);
    setSelectedCardId(cardId);
  };

  const closeTaskDetailsModal = () => {
    setIsDeleteCardOpen(false);
    setSelectedCardId(null);
  };

  const openDeleteCardModal = () => {
    setSelectedColumnId(null);
    setIsCreateCardOpen(false);
    setIsCreateColumnOpen(false);
    setIsDeleteCardOpen(true);
  };

  const closeDeleteCardModal = () => {
    setIsDeleteCardOpen(false);
  };

  const openCreateColumnModal = () => {
    setSelectedCardId(null);
    setIsDeleteCardOpen(false);
    setSelectedColumnId(null);
    setIsCreateCardOpen(false);
    setIsCreateColumnOpen(true);
  };

  const closeCreateColumnModal = () => {
    setIsCreateColumnOpen(false);
  };

  return {
    isCreateCardOpen,
    selectedColumnId,
    openCreateCardModal,
    closeCreateCardModal,

    selectedCardId,
    openTaskDetailsModal,
    closeTaskDetailsModal,

    isDeleteCardOpen,
    openDeleteCardModal,
    closeDeleteCardModal,

    isCreateColumnOpen,
    openCreateColumnModal,
    closeCreateColumnModal,
  };
};
