import type { Metadata } from "next";

import { AuthHeader } from "../components/auth-header";
import { RegisterForm } from "../components/register-form";

export const metadata: Metadata = {
  title: "Create account"
};

export default function RegisterPage() {
  return (
    <div className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-10 backdrop-blur">
      <AuthHeader
        title="Create your workspace account"
        description="Set up your profile and invite your team once you&apos;re inside."
      />
      <RegisterForm />
    </div>
  );
}
