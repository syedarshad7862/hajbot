import { Plane, MapPin, MessageCircle, HelpCircle, Home as HomeIcon, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import salaamhajilogo from "/favicon.png"

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary p-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-soft overflow-hidden">
            {/* <span className="text-2xl">🕋</span> */}
            <Plane className="w-5 h-5 text-primary relative z-10" />
            {/* <img src={salaamhajilogo} alt="salaam haji" className="w-full h-full object-cover rounded-full" /> */}
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">Salaam Haji</h1>
            <p className="text-sm text-primary-foreground/70">Travel Assistant • Online</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Kaaba Icon */}
        <div className="inline-flex items-center justify-center w-25 h-20 rounded-full mb-4 shadow-soft">
          {/* <span className="text-4xl">🕋</span> */}
          <img src={salaamhajilogo} alt="salaam haji" className="w-full h-full object-cover rounded-full" />
        </div>

        {/* Welcome Message */}
        <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
          Assalamu Alaikum!
        </h2>
        <p className="text-muted-foreground text-center text-lg max-w-md mb-8 leading-relaxed">
          Welcome to Salaam Haji. I am your AI assistant for Hajj and Umrah
          guidance. Ask me about rituals, duas, rules, and step-by-step
          instructions.
        </p>

        {/* Feature Icons */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <div className="flex flex-col items-center gap-1 px-4 py-3 border border-border rounded-xl bg-card">
            <span className="text-lg">🕋</span>
            <span className="text-xs text-muted-foreground">Ritual Guide</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-3 border border-border rounded-xl bg-card">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">Ask Questions</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-3 border border-border rounded-xl bg-card">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">Ziyarat Info</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-3 border border-border rounded-xl bg-card">
            <MessageCircle  className="w-5 h-5 text-primary" />
            <span className="text-xs text-muted-foreground">AI Chat</span>
          </div>
        </div>

        {/* Login/Signup Buttons */}
        {!user ? (
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-6"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/auth?tab=signup")}
              size="lg"
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 font-semibold rounded-xl py-6"
            >
              Sign Up
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => navigate("/chat")}
            size="lg"
            className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-6"
          >
            Start Chatting
          </Button>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden safe-area-pb z-50">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-primary relative"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
            <div className="absolute -bottom-0 w-8 h-0.5 bg-primary rounded-full" />
          </button>
          <button
            onClick={() => navigate("/chat")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium">Chat</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground">
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-medium">Bookings</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-foreground">
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Home;
