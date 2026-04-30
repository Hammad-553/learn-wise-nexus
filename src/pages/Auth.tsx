import { useState, useEffect, useRef, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { GraduationCap, User as UserIcon, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required").max(72),
});

type Mode = "login" | "signup";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const from = (location.state as any)?.from?.pathname || "/";

  const [mode, setMode] = useState<Mode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(true);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  // Moving button state
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const buttonWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, navigate, from]);

  const isLoginValid = email.trim() !== "" && password.trim() !== "";
  const isSignupValid =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const formValid = mode === "login" ? isLoginValid : isSignupValid;

  const resetForm = () => {
    setErrors({});
    setFormError("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    resetForm();
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormError("");

    if (!formValid) {
      setFormError("Please fill the input fields before proceeding");
      return;
    }

    if (mode === "signup") {
      const result = signupSchema.safeParse({ fullName, email, password, confirmPassword });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setSubmitting(true);
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: result.data.fullName },
        },
      });
      setSubmitting(false);

      if (error) {
        if (error.message.toLowerCase().includes("already")) {
          setFormError("An account with this email already exists.");
        } else {
          setFormError(error.message);
        }
        return;
      }
      toast.success("Account created! You're now signed in.");
      navigate("/", { replace: true });
    } else {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });
      setSubmitting(false);

      if (error) {
        setFormError("Invalid email or password.");
        return;
      }
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    }
  };

  const handleForgot = async () => {
    if (!email.trim()) {
      setFormError("Enter your email first to reset password.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent (if account exists).");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-secondary via-background to-primary/10">
      <Card className="w-full max-w-md p-6 sm:p-8 shadow-2xl border-border/60 backdrop-blur bg-card/95">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg mb-3">
            <GraduationCap className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-center tracking-tight">
            STUDENT MANAGEMENT SYSTEM
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Login to your account" : "Create a new account"}
          </p>
        </div>

        {formError && (
          <div className="mb-4 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="pl-9"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                />
              </div>
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                className="pl-9 pr-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={72}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            {mode === "signup" && !errors.password && (
              <p className="text-[11px] text-muted-foreground">
                Min 8 chars, with uppercase, lowercase & number.
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  maxLength={72}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-primary hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="flex justify-center pt-2">
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Please wait..." : mode === "login" ? "Login" : "Sign Up"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => switchMode("signup")} className="text-primary font-semibold hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => switchMode("login")} className="text-primary font-semibold hover:underline">
                Login
              </button>
            </>
          )}
        </p>
      </Card>
    </div>
  );
};

export default Auth;
