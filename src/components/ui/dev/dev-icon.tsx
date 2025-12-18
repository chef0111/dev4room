import { CodeXmlIcon } from "lucide-react";
import { ItemIcon } from "./item-icon";
import { cn } from "@/lib/utils";

interface DevIconProps {
  className?: string;
  iconClassName?: string;
}

const DevIcon = ({ className, iconClassName }: DevIconProps) => {
  return (
    <ItemIcon className={cn(className)}>
      <CodeXmlIcon className={iconClassName} />
    </ItemIcon>
  );
};

export default DevIcon;
