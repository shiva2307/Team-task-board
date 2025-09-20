"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input, Label } from "@team-task-board/ui";
import { registerSchema, type RegisterInput } from "@team-task-board/shared";

import { FormMessage } from "./form-message";

export function RegisterForm() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setMessage({ type: "success", text: `Account created for ${values.email}. You can now sign in.` });
  });

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Taylor Swift" autoComplete="name" {...register("name")} />
          <FormMessage message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          <FormMessage message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            {...register("password")}
          />
          <FormMessage message={errors.password?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
          />
          <FormMessage message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <FormMessage message={message?.text} variant={message?.type === "error" ? "error" : "success"} />

      <p className="text-center text-sm text-slate-400">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-sky-400 hover:text-sky-300">
          Sign in instead
        </Link>
      </p>
    </>
  );
}
