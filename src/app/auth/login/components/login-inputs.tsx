import React from "react";
import { LoginInput } from "./login-input";
import { loginInputs } from "../config/inputs";

interface LoginInputsProps {
  errors?: {
    username?: string[];
    password?: string[];
    _form?: string[];
  };
}

const LoginInputsComponent: React.FC<LoginInputsProps> = ({ errors }) => {
  return (
    <>
      {loginInputs.map((input) => (
        <LoginInput
          key={input.id}
          id={input.id}
          label={input.label}
          type={input.type}
          placeholder={input.placeholder}
          autoComplete={input.autoComplete}
          autoCapitalize={input.autoCapitalize}
          autoCorrect={input.autoCorrect}
          required={input.required}
          error={errors?.[input.id as keyof typeof errors]?.[0]}
        />
      ))}
    </>
  );
};

export const LoginInputs = React.memo(LoginInputsComponent);
