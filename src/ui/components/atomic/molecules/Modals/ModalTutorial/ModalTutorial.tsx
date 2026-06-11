'use client';

import { AtomDialog, AtomDialogContent, AtomDialogTitle, ScrollArea } from '@atoms';

import { useTutorialDialog } from '@store';

const ModalTutorial = () => {
  const isOpen = useTutorialDialog((state) => state.isOpen);
  const setIsOpen = useTutorialDialog((state) => state.setIsOpen);

  return (
    <AtomDialog open={isOpen} onOpenChange={setIsOpen}>
      <AtomDialogContent aria-describedby={undefined}>
        <AtomDialogTitle visuallyHidden>Tutorial Dialog</AtomDialogTitle>
        <ScrollArea className="min-h-0 flex-1 w-full" fadeEdges />
      </AtomDialogContent>
    </AtomDialog>
  );
};

export { ModalTutorial };
