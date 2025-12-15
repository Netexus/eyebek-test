import axios from 'axios';

// URL base de la API de PayPal para Sandbox
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';


export async function generateAccessToken(): Promise<string> {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secretKey = process.env.PAYPAL_SECRET_KEY;

    if (!clientId || !secretKey) {
        throw new Error("Faltan las variables de entorno de PayPal (CLIENT_ID y/o SECRET_KEY).");
    }

    const auth = Buffer.from(`${clientId}:${secretKey}`).toString('base64');
    
    try {
        const response = await axios.post(
            `${PAYPAL_API}/v1/oauth2/token`,
            // Cuerpo de la petición debe ser 'application/x-www-form-urlencoded'
            'grant_type=client_credentials', 
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        // El token que necesitamos para las peticiones API
        return response.data.access_token; 
    } catch (error) {
        console.error("Error al generar el token de PayPal:", error);
        // Puedes agregar lógica para manejar errores de red o credenciales inválidas aquí
        throw new Error("Fallo en la autenticación con PayPal.");
    }
}