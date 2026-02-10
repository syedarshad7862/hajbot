import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import salaamhajilogo from "/favicon.png"
import { Mail, Lock, User, Loader2, Building2, Phone  } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (isLogin) {
      await signIn(email, password);

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      navigate("/chat");
    } else {
      if (!fullName.trim() || !contactNumber) {
        toast({
          title: "Missing Information",
          description: "Agency name and contact number are required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }else{
      }

      await signUp(email, password, fullName, contactNumber);


      toast({
        title: "Account Created!",
        description: "Welcome to Salaam Haji.",
      });

      navigate("/chat");
    }
  } catch (error: any) {
    toast({
      title: "Authentication Error",
      description: error.message || "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      {/* <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-25 h-20 rounded-full mb-4 shadow-soft">
            <img src={salaamhajilogo} alt="salaam haji" className="w-full h-full object-cover rounded-full" />
            
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              Salaam Haji
            </h1>
            <p className="text-xs text-muted-foreground">Your Journey Begins Here</p>
          </div>
        </div>
      </div> */}

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 pt-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-soft border border-border p-6 md:p-8">
            <h2 className="font-serif text-2xl font-bold text-center mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-muted-foreground text-center mb-6 text-sm">
              {isLogin
                ? "Sign in to continue your journey"
                : "Join us to start your blessed journey"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>

                {/* Agency Name
                <div className="space-y-2">
                  <Label htmlFor="agencyName">Agency Name</Label>
                  <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="agencyName"
                    type="text"
                    placeholder="Enter agency name"
                    value={agencyName}
                    className="pl-10"
                    onChange={(e) => setAgencyName(e.target.value)}
                    required
                  />
                  </div>
                </div> */}

                    {/* Contact Number */}
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="contactNumber"
                      type="tel"
                      placeholder="Enter contact number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      pattern="[0-9]{10}"
                      className="pl-10"
                      required
                    />
                    </div>
                  </div>
                </>
              )}
              

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-medium ml-1 hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
