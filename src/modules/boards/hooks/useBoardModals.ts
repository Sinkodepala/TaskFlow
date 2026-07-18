import { useState } from "react";

export const useBoardModals = () => {
  const [isCreateCardOpen, setIsCreateCardOpen] = useState(false);

  const [selectedColumnId, setSelectedColumnId] =
    useState<string | null>(null);


  const openCreateCardModal = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateCardOpen(true);
  };


  const closeCreateCardModal = () => {
    setSelectedColumnId(null);
    setIsCreateCardOpen(false);
  };


  return {
    isCreateCardOpen,
    selectedColumnId,

    openCreateCardModal,
    closeCreateCardModal,
  };
};