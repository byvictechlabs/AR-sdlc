"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Box, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful");
        router.push("/admin");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[oklch(0.17_0.035_264)] p-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[oklch(0.45_0.2_264)]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[oklch(0.55_0.18_270)]/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.5_0.2_250)]/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Card className="border-white/10 bg-white/95 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <CardHeader className="text-center space-y-1 pb-2">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.45_0.2_264)] to-[oklch(0.55_0.2_280)] text-white shadow-lg shadow-blue-500/30">
              <Box className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold text-[oklch(0.17_0.03_264)]">
              AR SDLC Admin
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Sign in to manage learning content
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[oklch(0.2_0.03_264)]"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sdlc-ar.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 border-border/60 bg-white focus:border-[oklch(0.45_0.2_264)] focus:ring-[oklch(0.45_0.2_264)]/20"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[oklch(0.2_0.03_264)]"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-border/60 bg-white focus:border-[oklch(0.45_0.2_264)] focus:ring-[oklch(0.45_0.2_264)]/20"
                />
              </div>
              <Button
                type="submit"
                className="h-11 w-full bg-gradient-to-r from-[oklch(0.45_0.2_264)] to-[oklch(0.5_0.2_270)] text-white font-medium shadow-lg shadow-blue-500/25 hover:from-[oklch(0.42_0.2_264)] hover:to-[oklch(0.47_0.2_270)] transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-white/30">
          AR SDLC Learning Media &mdash; Admin Panel
        </p>
      </div>
    </div>
  );
}
