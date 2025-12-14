import { CodeXmlIcon } from "lucide-react";
import { ItemIcon } from "./item-icon";
import { cn } from "@/lib/utils";

const DevIcon = ({ className }: { className?: string }) => {
  return (
    <ItemIcon className={cn(className)}>
      <CodeXmlIcon />
    </ItemIcon>
  );
};

export default DevIcon;
