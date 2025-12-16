import { getSession } from "next-auth/react";
import { apiClient } from "./apiClient";

export interface InitiateRecognitionResponse {
    token: string;
    redirectUrl: string;
}

export const recognitionService = {
    /**
     * Initiates a facial recognition session for a user
     * Returns a token and redirect URL to the Recognition App
     */
    async initiateRecognition(userId: string): Promise<InitiateRecognitionResponse> {
        const session = await getSession();
        const token = (session as any)?.accessToken;

        if (!token) {
            throw new Error("No se encontró el token de autenticación");
        }

        return apiClient.post<InitiateRecognitionResponse>(
            "/api/recognition/init",
            { userId },
            {
                headers: apiClient.getAuthHeaders(token),
            }
        );
    },

    /**
     * Opens the Recognition App in a new window/redirect
     */
    async startRecognition(userId: string): Promise<void> {
        const { redirectUrl } = await this.initiateRecognition(userId);

        const currentUrl = window.location.href;
        const fullUrl = `${redirectUrl}&returnUrl=${encodeURIComponent(currentUrl)}`;

        window.location.href = fullUrl;
    },
};
