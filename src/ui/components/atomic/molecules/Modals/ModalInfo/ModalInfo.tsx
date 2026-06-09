'use client';

import { BiError } from 'react-icons/bi';
import { useState } from 'react';

import { AtomDialog, AtomDialogContent, AtomDialogTitle, AtomTabs, AtomTabsSlidingList, AtomTabsTrigger, ScrollArea, SvgIcon } from '@atoms';
import { FAQContent, InfoContent } from './Content';

import { useInfoDialog } from '@store';

const ModalInfo = () => {
  const isOpen = useInfoDialog((state) => state.isOpen);
  const setIsOpen = useInfoDialog((state) => state.setIsOpen);
  const [activeTab, setActiveTab] = useState('faq');

  return (
    <AtomDialog open={isOpen} onOpenChange={setIsOpen}>
      <AtomDialogContent aria-describedby={undefined}>
        <AtomDialogTitle visuallyHidden>Info Dialog</AtomDialogTitle>
        <AtomTabs variant="modal" value={activeTab} onValueChange={(value) => value && setActiveTab(value)}>
          <AtomTabsSlidingList activeValue={activeTab} preset="modal" className="shrink-0">
            <AtomTabsTrigger value="faq">
              <BiError />
              FAQ
            </AtomTabsTrigger>
            <AtomTabsTrigger value="info">
              <SvgIcon name="ruler" />
              Tabella taglie
            </AtomTabsTrigger>
          </AtomTabsSlidingList>
          <ScrollArea className="min-h-0 flex-1 w-full" fadeEdges>
            <FAQContent />
            <InfoContent />
          </ScrollArea>
        </AtomTabs>
      </AtomDialogContent>
    </AtomDialog>
  );
};

export { ModalInfo };
