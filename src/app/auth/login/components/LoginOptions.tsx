import React from "react";
import { Checkbox } from "@/app/design";

const LoginOptionsComponent: React.FC = () => {
  return (
    <div className="my-4 flex items-center justify-between px-2">
      <Checkbox
        id="keepLoggedIn"
        name="keepLoggedIn"
        label="Keep me logged In"
        variant="primary"
        size="md"
      />
    </div>
  );
};

export const LoginOptions = React.memo(LoginOptionsComponent);
