import { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormBase, FormControlFn } from "./form-base";

export const FormSelect: FormControlFn<{
  children: ReactNode;
  fieldClassName?: string;
  orientation?: "horizontal" | "vertical" | "responsive" | null;
}> = ({ children, fieldClassName, orientation, ...props }) => {
  return (
    <FormBase {...props} className={fieldClassName} orientation={orientation}>
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger
            aria-invalid={field["aria-invalid"]}
            id={field.id}
            onBlur={onBlur}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    </FormBase>
  );
};
