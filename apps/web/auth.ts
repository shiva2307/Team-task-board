// apps/web/auth.ts
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github" // ← change provider later if needed

export const {
  auth,                                   // get session on the server
  handlers: { GET, POST },                // route handlers (we re-export them in step 3)
  signIn, signOut,                        // server actions for forms
} = NextAuth({
  providers: [
    GitHub, // ← uses AUTH_GITHUB_ID / AUTH_GITHUB_SECRET from your .env
  ],
  // You can add callbacks/adapter here later if needed
})
