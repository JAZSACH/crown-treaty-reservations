import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { PUB } from "@/content/pub";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    ...pageHead({ title: "Owner login", description: "Sign in to manage reservations at The Crown & Treaty." }),
    meta: [...pageHead({ title: "Owner login", description: "Sign in to manage reservations." }).meta, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function withGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error(result.error.message);
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin" });
  }

  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (!data.session) toast.success("Check your inbox to confirm your email, then sign in.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-deep/40 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="surface-green rounded-t-lg px-8 py-7 text-center">
          <p className="text-[0.62rem] tracking-[0.4em] uppercase text-brass">Owner dashboard</p>
          <p className="mt-2 font-serif text-3xl tracking-[0.08em] uppercase">{PUB.name}</p>
        </div>
        <div className="rounded-b-lg border border-t-0 border-border bg-card p-8 shadow-lift">
          <h1 className="text-3xl">{mode === "signin" ? "Sign in" : "Create owner account"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access is limited to the pub's registered owner email.</p>

          <Button variant="outline" size="lg" className="mt-6 w-full" onClick={withGoogle} disabled={busy}>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={withEmail} className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Email</Label>
              <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Password</Label>
              <Input type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <button className="mt-5 w-full text-center text-sm text-primary underline-offset-4 hover:underline" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "First time? Create the owner account" : "Already have an account? Sign in"}
          </button>
          <p className="mt-6 text-center text-xs text-muted-foreground"><Link to="/" className="hover:text-primary">← Back to the website</Link></p>
        </div>
      </div>
    </div>
  );
}
