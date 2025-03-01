import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallbackPage() {
  // Get user details from Clerk
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempted = useRef(false); // Prevent multiple sync attempts

  useEffect(() => {
    console.log("User", user);

    const syncUser = async () => {
      try {
        // If user data isn't loaded or sync already attempted, return
        if (!isLoaded || !user || syncAttempted.current) {
          return;
        }

        // Send user data to the backend
        await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });

        syncAttempted.current = true; // Mark sync as attempted
      } catch (error) {
        console.log("Error in auth callback", error);
      } finally {
        navigate("/"); // Redirect to home after sync
      }
    };

    syncUser();
  }, [isLoaded, user, navigate]);

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      {/* Card to display loading message */}
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center gap-4 pt-6">
          {/* Loading spinner */}
          <Loader className="size-6 text-emerald-500 animate-spin" />
          <h3 className="text-zinc-400 text-xl font-bold">Logging you in</h3>
          <p className="text-zinc-400 text-sm">Just a moment...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthCallbackPage;
