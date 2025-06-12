import { ScrollArea } from "@/components/ui/scroll-area";
import ToolButton from "./ToolButton";
import { Type, Highlighter, Underline, Baseline, Square, Circle, ArrowUpRight, Layers3, Undo, Redo, Palette, CaseSensitive, Shield, Download, Save, MousePointer2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";

export default function EditorToolbar() {
  return (
    <aside className="w-20 bg-card border-r flex flex-col items-center py-4 shadow-md">
      <ScrollArea className="flex-1 w-full">
        <div className="grid grid-cols-1 gap-2 px-2">
          <ToolButton icon={<MousePointer2 />} label="Select" shortcut="V" />
          <Separator className="my-2" />
          
          <ToolButton icon={<Type />} label="Text" shortcut="T" />
          <ToolButton icon={<Highlighter />} label="Highlight" shortcut="H" />
          <ToolButton icon={<Underline />} label="Underline" shortcut="U" />
          <ToolButton icon={<Baseline />} label="Strikeout" shortcut="S" />
          
          <Separator className="my-2" />
          <ToolButton icon={<Square />} label="Rectangle" shortcut="R" />
          <ToolButton icon={<Circle />} label="Circle" shortcut="C" />
          <ToolButton icon={<ArrowUpRight />} label="Arrow" shortcut="A" />

          <Separator className="my-2" />
          <ToolButton icon={<Shield />} label="Watermark" shortcut="W" />

          <Separator className="my-2" />
          <ToolButton icon={<Layers3 />} label="Layers" />
          <ToolButton icon={<Palette />} label="Color" />
          <ToolButton icon={<CaseSensitive />} label="Font" />
          
          <Separator className="my-2" />
          <ToolButton icon={<Undo />} label="Undo" shortcut="Ctrl+Z" />
          <ToolButton icon={<Redo />} label="Redo" shortcut="Ctrl+Y" />
        </div>
      </ScrollArea>
      <div className="mt-auto px-2 py-2 w-full space-y-2 border-t pt-4">
         <Button variant="ghost" size="icon" className="w-full h-10">
            <Save className="h-5 w-5" />
            <span className="sr-only">Save</span>
         </Button>
         <Button variant="ghost" size="icon" className="w-full h-10">
            <Download className="h-5 w-5" />
            <span className="sr-only">Download</span>
         </Button>
      </div>
    </aside>
  );
}
