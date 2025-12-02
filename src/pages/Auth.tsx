import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Check if user is admin
        checkIfAdmin(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        checkIfAdmin(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkIfAdmin = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin');
    
    if (data && data.length > 0) {
      navigate("/admin");
    } else {
      toast.error("You do not have admin access");
      await supabase.auth.signOut();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: authData.email,
        password: authData.password,
      });

      if (error) throw error;

      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email: authData.email,
        password: authData.password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      toast.success("Sign up successful! You can now log in.");
      setIsSignUp(false);
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create Account' : 'Admin Login'}</CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Sign up with an email and password to request admin access.'
                : 'Sign in to access the admin dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="user@university.edu"
                  value={authData.email}
                  onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (isSignUp ? "Signing up..." : "Logging in...") : isSignUp ? "Sign Up" : "Log In"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isSignUp ? (
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => setIsSignUp(false)}
                >
                  Already have an account? Log in
                </button>
              ) : (
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => setIsSignUp(true)}
                >
                  Need an account? Sign up
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
