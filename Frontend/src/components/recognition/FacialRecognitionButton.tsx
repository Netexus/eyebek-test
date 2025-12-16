"use client"

import { recognitionService } from "@/services/recognition";
import { Scan } from "lucide-react";
import { useState } from "react";

interface FacialRecognitionButtonProps {
    userId: string;
    userName?: string;
}

export default function FacialRecognitionButton({ userId, userName }: FacialRecognitionButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRecognition = async () => {
        try {
            setLoading(true);
            setError(null);

            await recognitionService.startRecognition(userId);
            // User will be redirected, so this won't execute
        } catch (err: any) {
            setError(err?.message || "Error al iniciar reconocimiento");
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleRecognition}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                <Scan className="w-5 h-5" />
                {loading ? "Iniciando..." : "Reconocimiento Facial"}
            </button>

            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
