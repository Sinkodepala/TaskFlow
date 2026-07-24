import { useState } from "react";

import { initialModalsState } from "@/modules/boards/hooks/modals/modals.types";
import { useCardModals } from "@/modules/boards/hooks/modals/useCardModals";
import { useColumnModals } from "@/modules/boards/hooks/modals/useColumnModals";

export const useBoardModals = () => {
  const [state, setState] = useState(initialModalsState);
  const cardModals = useCardModals(state, setState);
  const columnModals = useColumnModals(state, setState);

  return {
    ...cardModals,
    ...columnModals,
  };
};
