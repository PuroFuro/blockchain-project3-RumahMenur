import { useNavigate } from "react-router-dom";
import AnimatedButton from "../components/AnimatedButtons";
import { GridScan } from "../components/GridScan";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden">
            {/* Animated grid background — fixed so it fills the whole viewport
                (behind the navbar too); only mounts on the hero route. */}
            <div className="fixed inset-0 z-0">
                <GridScan
                    sensitivity={0.55}
                    lineThickness={1}
                    linesColor="#2F293A"
                    gridScale={0.08}
                    scanColor="#1B1BFF"
                    scanOpacity={0.4}
                    enablePost
                    bloomIntensity={0.6}
                    chromaticAberration={0.002}
                    noiseIntensity={0.01}
                    lineJitter={0.1}
                    scanGlow={0.5}
                    scanSoftness={2}
                    enableWebcam={false}
                    showPreview={false}
                />
            </div>

            {/* Hero content — pointer-events-none lets the grid react to the
                mouse everywhere; the button re-enables them for itself. */}
            <div className="pointer-events-none relative z-10 flex flex-1 flex-col items-center justify-center text-center">
                <h1 className="hero-text">Your Voice, Secured on the Blockchain</h1>
                <p className="hero-subtext max-w-lg mt-1">
                    No sign-ups and complete mathematical certainty that your voice is counted exactly as intended
                </p>

                <div className="pointer-events-auto">
                    <AnimatedButton className="mt-2" onClick={() => navigate("/vote")}>
                        Start Voting
                    </AnimatedButton>
                </div>
            </div>
        </div>
    );
}
