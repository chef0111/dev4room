"use client";

import { JSX, useRef } from "react";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { GripVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export function DraggableBlockPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement | null;
}): JSX.Element | null {
  const menuRef = useRef<HTMLButtonElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  if (!anchorElem) {
    return null;
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef as React.RefObject<HTMLButtonElement>}
      targetLineRef={targetLineRef as React.RefObject<HTMLDivElement>}
      menuComponent={
        <Button
          ref={menuRef}
          type="button"
          variant="ghost"
          size="icon"
          className="draggable-block-menu hover:bg-light800_dark300 absolute top-0 left-0 size-6 cursor-grab rounded-sm will-change-transform active:cursor-grabbing"
        >
          <GripVerticalIcon className="size-4 opacity-30" />
        </Button>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="bg-secondary-foreground pointer-events-none absolute top-0 left-0 h-1 opacity-0 will-change-transform"
        />
      }
      isOnMenu={isOnMenu}
    />
  );
}
