import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { useNavigate } from "react-router-dom"

function NotFoundPage() {
    const navigate = useNavigate();
  return (
    <div className="h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center space-y-8 px-4">

            <div className="flex justify-center animate-bounce">
                <Music2 className="h-24 w-24 text-emerald-500"/>
            </div>

            <div className="space-y-4">
                <h1 className="text-7xl font-bold text-white">404</h1>
                <h2 className="text-2xl font-semibold text-white">Uh-oh! Lost the beat?</h2>
                <p className="text-neutral-400 max-w-md mx-auto">
                    Looks like you took a wrong turn in the playlist. Let's get you back home!
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button
                    onClick={()=>navigate(-1)}
                    variant={'outline'}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 w-full sm:w-auto"
                >
                    Go Back
                </Button>

                <Button
                    onClick={()=>navigate("/")}
                    className="bg-amber-300 hover:bg-amber-200 text-black w-full sm:w-auto"
                >
                    Back to Home
                </Button>
            </div>

        </div>
        
    </div>
  )
}

export default NotFoundPage