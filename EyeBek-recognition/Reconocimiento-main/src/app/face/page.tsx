// Componente para reconocimiento facial con control de servo motor
// Detecta rostros en tiempo real desde la cámara web y los compara con una imagen de la BD

"use client";

import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js"; // Librería de face-api.js para detección facial

export default function FacePage() {
  // Referencias y estados del componente
  const videoRef = useRef(null); // Referencia al elemento <video> para acceder a la cámara
  const descriptorRef = useRef(null); // Almacena el descriptor (huella facial) del usuario en BD
  
  // Estados de la interfaz
  const [status, setStatus] = useState("Cargando modelos..."); // Mensaje de estado actual
  const [isMatch, setIsMatch] = useState(null); // null: no determinado, true: reconocido, false: no coincide
  const [distance, setDistance] = useState(null); // Distancia euclidiana entre rostros (0-1)
  const [servoStatus, setServoStatus] = useState("Desconectado"); // Estado del servo motor

  // Ejecutar inicialización cuando el componente carga
  useEffect(() => {
    initializeApp();
  }, []);

  // Función principal que inicializa toda la aplicación
  async function initializeApp() {
    try {
      // PASO 1: Cargar los modelos de IA necesarios para detectar rostros
      setStatus("📦 Cargando modelos de IA...");
      console.log("Iniciando carga de modelos...");
      
      // Detector de rostros pequeños (optimizado para velocidad)
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      console.log("✓ TinyFaceDetector cargado");
      
      // Detector de 68 puntos de referencia faciales (ojos, nariz, boca, etc.)
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      console.log("✓ FaceLandmark68Net cargado");
      
      // Red neuronal para generar descriptores faciales (huella digital del rostro)
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("✓ FaceRecognitionNet cargado");

      // PASO 2: Obtener la imagen de referencia del usuario desde la BD
      setStatus("🔍 Obteniendo imagen de la BD...");
      await loadUserFromDB();

      // PASO 3: Activar la cámara web
      setStatus("📹 Abriendo cámara...");
      await startCamera();

      // PASO 4: Indicar que está listo
      setStatus("✅ Listo - Acércate a la cámara");
    } catch (error) {
      console.error("❌ Error fatal:", error);
      setStatus("❌ Error: " + error.message);
    }
  }

  // Carga la imagen del usuario desde la BD y genera su descriptor facial
  async function loadUserFromDB() {
    const USER_ID = "693c59ba1a0cb1391ef2a790"; // ID del usuario a reconocer
    
    try {
      // Obtener datos del usuario desde la API
      const res = await fetch(`/api/user/${USER_ID}`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Usuario no encontrado`);
      }

      const user = await res.json();
      console.log("👤 Usuario obtenido:", user);

      if (!user.image) {
        throw new Error("El usuario no tiene imagen en la BD");
      }

      // Descargar la imagen desde la URL almacenada
      console.log("📥 Descargando imagen:", user.image);
      const img = await faceapi.fetchImage(user.image);
      console.log("✓ Imagen descargada");

      // Detectar el rostro en la imagen y generar su descriptor
      // El descriptor es una array de 128 números que representa características faciales únicas
      console.log("🔎 Detectando rostro en imagen...");
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks() // Agregar puntos de referencia
        .withFaceDescriptor(); // Generar el descriptor facial

      if (!detection) {
        throw new Error("❌ No se detectó rostro en la imagen de BD");
      }

      // Guardar el descriptor para compararlo con los rostros detectados en la cámara
      descriptorRef.current = detection.descriptor;
      console.log("✅ Descriptor del usuario cargado:", detection.descriptor);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      throw error;
    }
  }

  // Accede a la cámara web del dispositivo
  async function startCamera() {
    try {
      // Solicitar acceso a la cámara
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 400, height: 300 } // Resolución de la cámara
      });
      console.log("✓ Cámara accesible");

      if (videoRef.current) {
        videoRef.current.srcObject = stream; // Conectar stream a elemento <video>

        // Cuando el video esté listo, iniciar la detección de rostros
        videoRef.current.onloadedmetadata = () => {
          console.log("✓ Video cargado, iniciando detección...");
          videoRef.current.play();
          detectFace(); // Iniciar bucle de detección
        };
      }
    } catch (error) {
      console.error("Error de cámara:", error);
      throw new Error("No se pudo acceder a la cámara");
    }
  }

  // Detecta rostros en el video en tiempo real y los compara con el descriptor del usuario
  async function detectFace() {
    if (!descriptorRef.current) {
      console.warn("⚠️ Descriptor no disponible aún");
      return;
    }

    console.log("🚀 Iniciando loop de detección...");
    
    // Configurar opciones del detector (umbral de confianza)
    const options = new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 });
    let detectionCount = 0;
    let lastMatchTime = 0; // Prevenir múltiples activaciones del servo en corto tiempo

    // Ejecutar detección cada 500ms (análisis continuo del video)
    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      try {
        // Detectar rostro en el frame actual del video
        const detection = await faceapi
          .detectSingleFace(videoRef.current, options)
          .withFaceLandmarks() // Obtener puntos de referencia
          .withFaceDescriptor(); // Generar descriptor del rostro detectado

        // Si no hay rostro detectado, continuar esperando
        if (!detection) {
          if (detectionCount % 10 === 0) {
            console.log("⏳ Esperando rostro...");
          }
          detectionCount++;
          return;
        }

        // Calcular la distancia euclidiana entre descriptores
        // Valores cercanos a 0 = rostros muy similares (reconocido)
        // Valores cercanos a 1 = rostros completamente diferentes (no coincide)
        const dist = faceapi.euclideanDistance(
          descriptorRef.current, // Descriptor del usuario en BD
          detection.descriptor   // Descriptor del rostro detectado en cámara
        );

        setDistance(dist.toFixed(3)); // Mostrar distancia con 3 decimales
        console.log(`📊 Distancia: ${dist.toFixed(3)}`);

        // Comparar distancia con umbral (0.5 es típico para reconocimiento facial)
        if (dist < 0.5) {
          // ✅ RECONOCIDO: El rostro coincide con el usuario
          console.log("🎉 ¡RECONOCIDO! Distancia:", dist.toFixed(3));
          
          // Evitar activar el servo múltiples veces en poco tiempo
          const now = Date.now();
          if (now - lastMatchTime > 2000) { // Esperar al menos 2 segundos entre activaciones
            lastMatchTime = now;
            await abrirServo(); // Activar el servo motor
          }
          
          setIsMatch(true);
        } else {
          // ❌ NO COINCIDE: El rostro no pertenece al usuario
          console.log("❌ NO COINCIDE. Distancia:", dist.toFixed(3));
          setIsMatch(false);
        }
      } catch (error) {
        console.error("Error en detección:", error);
      }
    }, 500); // Ejecutar cada 500 milisegundos
  }

  // Envía comando MQTT a través de la API para abrir el servo motor
  async function abrirServo() {
    try {
      setServoStatus("⏳ Enviando comando...");
      
      // Llamar a la API del servidor para enviar comando MQTT a la Raspberry Pi
      const response = await fetch("/api/servo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "ABRIR" }), // Comando esperado por el servo
      });

      const data = await response.json();
      
      if (response.ok) {
        // Éxito: servo abierto correctamente
        console.log("✅ Servo activado:", data);
        setServoStatus("✅ Servo ABIERTO");
        
        // Cerrar el servo automáticamente después de 3 segundos
        setTimeout(() => cerrarServo(), 3000);
      } else {
        // Error al activar el servo
        console.error("❌ Error:", data);
        setServoStatus("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error("Error al controlar servo:", error);
      setServoStatus("❌ Error de conexión");
    }
  }

  // Envía comando MQTT para cerrar el servo motor
  async function cerrarServo() {
    try {
      // Llamar a la API del servidor para cerrar el servo
      const response = await fetch("/api/servo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "CERRAR" }), // Comando para cerrar
      });

      if (response.ok) {
        console.log("✅ Servo cerrado");
        setServoStatus("✅ Servo CERRADO");
      }
    } catch (error) {
      console.error("Error al cerrar servo:", error);
    }
  }

  // Renderizar la interfaz de usuario
  return (
    <div style={{ 
      textAlign: "center", 
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "500px",
      margin: "0 auto"
    }}>
      <h1>👤 Reconocimiento Facial</h1>
      
      {/* Video en vivo de la cámara */}
      <video
        ref={videoRef}
        width="400"
        height="300"
        style={{ 
          // Cambiar color del borde según el resultado
          border: isMatch === true ? "5px solid green" : 
                  isMatch === false ? "5px solid red" : 
                  "3px solid #333",
          borderRadius: "10px",
          display: "block",
          margin: "20px auto",
          transition: "border 0.3s"
        }}
        autoPlay
        playsInline
        muted
      />

      {/* Panel de información */}
      <div style={{ 
        backgroundColor: "#f0f0f0", 
        padding: "15px", 
        borderRadius: "8px",
        marginBottom: "15px"
      }}>
        <p style={{ margin: "5px", fontSize: "16px", color: "#333" }}>
          <strong>Estado:</strong> {status}
        </p>
        {distance && (
          <p style={{ margin: "5px", fontSize: "14px", color: "#666" }}>
            <strong>Distancia:</strong> {distance}
          </p>
        )}
        <p style={{ margin: "5px", fontSize: "14px", color: "#666" }}>
          <strong>Servo:</strong> {servoStatus}
        </p>
      </div>

      {/* Mensaje cuando el usuario es RECONOCIDO */}
      {isMatch === true && (
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#d4edda", 
          color: "#155724", 
          borderRadius: "8px",
          fontSize: "24px",
          fontWeight: "bold",
          border: "2px solid #28a745"
        }}>
          ✅ ¡RECONOCIDO! ¡Bienvenido!
        </div>
      )}

      {/* Mensaje cuando el usuario NO es reconocido */}
      {isMatch === false && (
        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f8d7da", 
          color: "#721c24", 
          borderRadius: "8px",
          fontSize: "20px",
          fontWeight: "bold",
          border: "2px solid #f5c6cb"
        }}>
          ❌ No coincide. Intenta de nuevo.
        </div>
      )}

      {/* Sección de ayuda para ver los logs */}
      <details style={{ marginTop: "20px", textAlign: "left" }}>
        <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
          📋 Logs (abre para ver detalles)
        </summary>
        <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          Abre la consola del navegador (F12) para ver los logs completos de depuración.
        </p>
      </details>
    </div>
  );
}
