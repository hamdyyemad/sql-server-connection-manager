"use client";
import { useActionState } from "react";
import { loginAction, type LoginFormState } from "@/backend_lib/actions/auth";
import { LoginOptions } from "./login-options";
import { LoginError } from "./login-error";
import { LoginButton } from "./login-button";
import { LoginInputs } from "./login-inputs";

const initialState: LoginFormState = {
  success: false,
};

export default function LoginFormServer() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form noValidate className="mb-4 md:w-7/12 lg:w-full" action={formAction}>
      <LoginInputsWithErrors errors={state.errors} />

      <LoginOptions />

      <LoginErrorWithFormState state={state} />

      <LoginButtonWithStatus isPending={isPending} />
    </form>
  );
}

function LoginInputsWithErrors({
  errors,
}: {
  errors?: LoginFormState["errors"];
}) {
  return <LoginInputs errors={errors} />;
}

function LoginErrorWithFormState({ state }: { state: LoginFormState }) {
  const error = state.errors?._form?.[0] || null;
  return <LoginError error={error} />;
}

function LoginButtonWithStatus({ isPending }: { isPending: boolean }) {
  return <LoginButton loading={isPending} />;
}
