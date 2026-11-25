import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Partner Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@company.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Demo accounts for the partner portal prototype
        const demoUsers = [
          {
            id: "1",
            email: "demo@anthropic.com",
            password: "demo123",
            name: "Demo User",
          },
          {
            id: "2",
            email: "partner@deloitte.com",
            password: "deloitte123",
            name: "Deloitte Partner",
          },
        ];

        const user = demoUsers.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );

        if (user) {
          return { id: user.id, email: user.email, name: user.name };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
});
