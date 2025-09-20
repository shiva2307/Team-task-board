"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input, Label } from "@team-task-board/ui";
import { loginSchema, type LoginInput } from "@team-task-board/shared";

import { FormMessage } from "./form-message";

export function LoginForm() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setMessage({ type: "success", text: `Welcome back, ${values.email}! (Demo only)` });
  });

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          <FormMessage message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
          />
          <FormMessage message={errors.password?.message} />
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <FormMessage message={message?.text} variant={message?.type === "error" ? "error" : "success"} />

      <p className="text-center text-sm text-slate-400">
        Don{"'"}t have an account?{" "}
        <Link href="/register" className="font-medium text-sky-400 hover:text-sky-300">
          Create one
        </Link>
      </p>
    </>
  );
}
