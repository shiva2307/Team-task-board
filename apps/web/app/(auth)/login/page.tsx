import type { Metadata } from "next";

import { AuthHeader } from "../components/auth-header";
import { LoginForm } from "../components/login-form";

export const metadata: Metadata = {
  title: "Login"
};

export default function LoginPage() {
  return (
    <div className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-10 backdrop-blur">
      <AuthHeader
        title="Sign in to continue"
        description="Enter your email and password to access your projects."
      />
      <LoginForm />
    </div>
  );
}
