import { useNavigate } from "react-router-dom";
import AnimatedButton from "../components/AnimatedButtons";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                    <h1 className="hero-text text-center">Your Voice, Secured on the Blockchain</h1>
                    <p className="hero-subtext max-w-lg text-center mt-1">
                        No sign-ups and complete mathematical certainty that your voice is counted exactly as intended
                    </p>

                    <div>
                        <AnimatedButton className="mt-2" onClick={() => navigate("/vote")}>
                            Start Voting
                        </AnimatedButton>
                    </div>
            </div>
        </>

    );
}
