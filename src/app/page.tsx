import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 lg:w-96 lg:h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 lg:w-96 lg:h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="z-10 w-full max-w-xl flex flex-col items-center text-center space-y-12 sm:space-y-16 my-12">
        
        {/* Logo */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-primary text-primary-foreground rounded-[2rem] flex items-center justify-center font-black text-6xl shadow-xl">
          F
        </div>

        {/* Text Section */}
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-foreground">
            feedo.
          </h1>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground/90 leading-tight">
            Happening now.
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-md mx-auto pt-4 leading-relaxed">
            Join the conversation, share your thoughts, and connect with people all over the world.
          </p>
        </div>

        {/* Actions Section */}
        <div className="w-full max-w-sm space-y-6 pt-4">
          <Link 
            href="/register" 
            className="flex w-full justify-center rounded-full bg-primary px-4 py-4 text-lg font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Create account
          </Link>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground font-medium">
                Already have an account?
              </span>
            </div>
          </div>

          <Link 
            href="/login" 
            className="flex w-full justify-center rounded-full bg-transparent border-2 border-border px-4 py-4 text-lg font-bold text-primary hover:bg-muted transition-all active:scale-[0.98]"
          >
            Sign in
          </Link>
        </div>

        {/* Footer Text */}
        <div className="pt-8 text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
          By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
        </div>

      </div>
    </div>
  );
}
