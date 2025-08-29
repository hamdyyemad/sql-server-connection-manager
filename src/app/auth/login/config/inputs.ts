import { LoginFormData } from "../types/login-form-data";

export interface InputConfig {
  id: keyof LoginFormData;
  label: string;
  type: "text" | "password";
  placeholder: string;
  autoComplete?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: "on" | "off";
  required?: boolean;
}

export const loginInputs: InputConfig[] = [
  {
    id: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    autoComplete: "username",
    autoCapitalize: "none",
    autoCorrect: "off",
    required: true,
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Min. 8 characters",
    autoComplete: "current-password",
    required: true,
  },
];
