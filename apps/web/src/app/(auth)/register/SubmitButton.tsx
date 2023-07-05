"use client";

import { useMutation } from "@tanstack/react-query";
import { SignInOptions, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "~/utils/cn";

export function SignButton() {
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: SignInOptions) => signIn("credentials", data),
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const name = e.currentTarget.form?.fullName.value;
    const email = e.currentTarget.form?.email.value;
    const password = e.currentTarget.form?.password.value;
    // zod schema validation
    // console.log(email, password)

    mutate(
      { name, email, password, register: true, redirect: false },
      {
        onSuccess: (res) => {
          // console.log(res)
          if (res?.ok) return router.push("/dashboard");
          setError(res?.error as string);
        },
      }
    );
  };

  return (
    <div>
      {error && (
        <div className="mb-2 text-sm font-semibold text-red-500">{error}</div>
      )}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading}
        className={cn(
          "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          "bg-indigo-600 text-white hover:bg-indigo-500 ",
          "disabled:cursor-not-allowed disabled:bg-indigo-300 disabled:opacity-50"
        )}
      >
        {isLoading ? "Loading ..." : "Sign in"}
      </button>
    </div>
  );
}
