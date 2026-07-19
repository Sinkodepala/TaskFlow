import { useState } from "react";

export const useBoardModals = () => {
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(
    null,
  );

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);
  const [isCreateColumnOpen, setIsCreateColumnOpen] = useState(false);
  const [isRenameColumnOpen, setIsRenameColumnOpen] = useState(false);
  const [isDeleteColumnOpen, setIsDeleteColumnOpen] = useState(false);

  const openCreateCardModal = (columnId: string) => {
    setSelectedCardId(null);
    setIsDeleteCardOpen(false);
    setIsCreateColumnOpen(false);
    setIsRenameColumnOpen(false);
    setIsDeleteColumnOpen(false);
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
    setIsRenameColumnOpen(false);
    setIsDeleteColumnOpen(false);
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
    setIsRenameColumnOpen(false);
    setIsDeleteColumnOpen(false);
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
    setIsRenameColumnOpen(false);
    setIsDeleteColumnOpen(false);
    setIsCreateColumnOpen(true);
  };

  const closeCreateColumnModal = () => {
    setIsCreateColumnOpen(false);
  };

  const openRenameColumnModal = (columnId: string) => {
    setSelectedCardId(null);
    setIsDeleteCardOpen(false);
    setIsCreateCardOpen(false);
    setIsCreateColumnOpen(false);
    setIsDeleteColumnOpen(false);
    setSelectedColumnId(columnId);
    setIsRenameColumnOpen(true);
  };

  const closeRenameColumnModal = () => {
    setSelectedColumnId(null);
    setIsRenameColumnOpen(false);
  };

  const openDeleteColumnModal = (columnId: string) => {
    setSelectedCardId(null);
    setIsDeleteCardOpen(false);
    setIsCreateCardOpen(false);
    setIsCreateColumnOpen(false);
    setIsRenameColumnOpen(false);
    setSelectedColumnId(columnId);
    setIsDeleteColumnOpen(true);
  };

  const closeDeleteColumnModal = () => {
    setSelectedColumnId(null);
    setIsDeleteColumnOpen(false);
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

    isRenameColumnOpen,
    openRenameColumnModal,
    closeRenameColumnModal,

    isDeleteColumnOpen,
    openDeleteColumnModal,
    closeDeleteColumnModal,
  };
};
