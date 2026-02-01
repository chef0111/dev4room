import { ReactNode } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { FormBase, FormControlFn } from "./form-base";

export const FormInputOTP: FormControlFn<{ children?: ReactNode }> = ({
  children,
  ...props
}) => {
  return (
    <FormBase {...props}>
      {(field) => (
        <div className="flex flex-col items-center gap-2.5">
          <InputOTP
            {...field}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            className="justify-center"
          >
            <InputOTPGroup className="input-otp-group">
              <InputOTPSlot index={0} className="input-otp-slot" />
              <InputOTPSlot index={1} className="input-otp-slot" />
            </InputOTPGroup>
            <InputOTPSeparator className="max-xs:hidden" />
            <InputOTPGroup className="input-otp-group">
              <InputOTPSlot index={2} className="input-otp-slot" />
              <InputOTPSlot index={3} className="input-otp-slot" />
            </InputOTPGroup>
            <InputOTPSeparator className="max-xs:hidden" />
            <InputOTPGroup className="input-otp-group">
              <InputOTPSlot index={4} className="input-otp-slot" />
              <InputOTPSlot index={5} className="input-otp-slot" />
            </InputOTPGroup>
          </InputOTP>
          {children}
        </div>
      )}
    </FormBase>
  );
};
