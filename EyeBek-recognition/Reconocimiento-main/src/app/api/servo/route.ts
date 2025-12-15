// API para controlar el servo motor a través de MQTT
// El cliente envía {"accion":"ABRIR" o "CERRAR"} y esta API lo publica en MQTT a la Raspberry Pi

import * as mqtt from "mqtt";

// Variable global para mantener la conexión MQTT activa
let mqttClient: mqtt.MqttClient | null = null;

// Función para obtener o crear la conexión MQTT
// Conectar a MQTT
function getMqttClient() {
  // Si el cliente ya existe y está conectado, reutilizarlo
  if (!mqttClient || !mqttClient.connected) {
    // Conectarse al broker MQTT en la Raspberry Pi
    mqttClient = mqtt.connect("mqtt://192.168.1.19", {
      clientId: "nextjs-servo-client", // Identificador único del cliente
      reconnectPeriod: 1000, // Reintentar conexión cada 1 segundo si se desconecta
    });

    // Evento: conexión exitosa
    mqttClient.on("connect", () => {
      console.log("✓ Conectado a MQTT Broker");
    });

    // Evento: error en la conexión
    mqttClient.on("error", (err) => {
      console.error("❌ Error MQTT:", err);
    });
  }

  return mqttClient;
}

// Endpoint POST que recibe comandos del cliente y los envía por MQTT
export async function POST(req: Request) {
  try {
    // Parsear el JSON del request
    const body = await req.json();
    const { accion } = body;

    // Validar que la acción sea válida (ABRIR o CERRAR)
    if (!accion || !["ABRIR", "CERRAR"].includes(accion)) {
      return new Response(
        JSON.stringify({ error: "Acción inválida. Use ABRIR o CERRAR" }),
        { status: 400 }
      );
    }

    // Obtener la conexión MQTT
    const client = getMqttClient();

    // Crear el mensaje JSON que espera el servo en la Raspberry Pi
    // Publicar mensaje MQTT
    const message = JSON.stringify({ accion });
    
    // Publicar el mensaje en el topic "empresa/acceso"
    // La Raspberry Pi debe estar suscrita a este topic
    client.publish("empresa/acceso", message, { qos: 1 }, (err) => {
      if (err) {
        console.error("❌ Error al publicar:", err);
      } else {
        console.log(`✓ Mensaje enviado: ${accion}`);
      }
    });

    // Responder al cliente con éxito
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Servo ${accion} enviado`,
        accion 
      }),
      { status: 200 }
    );
  } catch (error) {
    // Error en el procesamiento
    console.error("Error en servo:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error al controlar servo",
        details: String(error)
      }),
      { status: 500 }
    );
  }
}
