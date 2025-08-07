/**
 * @file hooks/useSpeakerRecognition.ts
 * @description Hook de React para gestionar una conexión WebSocket con un servicio
 * de reconocimiento de hablantes que procesa audio binario.
 */

import { useCallback, useRef, useState, useEffect } from 'react';
import type { SpeakerRecognitionResult } from '../types/recognition';

/**
 * Convierte un string en formato Base64 a un ArrayBuffer binario.
 * @param base64 El string en Base64 a convertir.
 * @returns Un ArrayBuffer con los datos binarios.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Hook para gestionar la conexión y comunicación con el WebSocket de reconocimiento de hablantes.
 * @param onResult Un callback que se ejecuta cada vez que se recibe un nuevo resultado de reconocimiento.
 */
export const useSpeakerRecognition = (onResult: (result: SpeakerRecognitionResult) => void) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isRecognitionConnected, setIsRecognitionConnected] = useState<boolean>(false);

  /**
   * Inicia la conexión con el WebSocket del servicio de reconocimiento.
   */
  const startRecognition = useCallback(() => {
    if (socketRef.current) {
      console.log("La conexión de reconocimiento ya existe.");
      return;
    }

    const socket = new WebSocket("ws://localhost:8000/ws/recognize");

    socket.onopen = () => {
      console.log("WebSocket de Reconocimiento: Conectado.");
      setIsRecognitionConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data) as SpeakerRecognitionResult;
        onResult(result); // Llama al callback con el resultado parseado
      } catch (error) {
        console.error("Error al parsear el resultado de reconocimiento:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket de Reconocimiento: Desconectado.");
      setIsRecognitionConnected(false);
      socketRef.current = null;
    };

    socket.onerror = (error) => {
      console.error("WebSocket de Reconocimiento: Error.", error);
    };

    socketRef.current = socket;
  }, [onResult]);

  /**
   * Cierra la conexión con el WebSocket del servicio de reconocimiento.
   */
  const stopRecognition = useCallback(() => {
    socketRef.current?.close(1000, 'Client stopped recognition');
  }, []);

  /**
   * Envía un chunk de audio (en Base64) al servicio, convirtiéndolo a formato binario.
   * @param base64AudioData El chunk de audio codificado en Base64.
   */
  const sendAudioChunk = useCallback((base64AudioData: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const audioBuffer = base64ToArrayBuffer(base64AudioData);
      socketRef.current.send(audioBuffer);
    }
  }, []);
  
  /**
   * Efecto de limpieza para asegurar que la conexión se cierre cuando el componente
   * que usa este hook se desmonte.
   */
  useEffect(() => {
      return () => {
          socketRef.current?.close();
      }
  }, [])

  return { isRecognitionConnected, startRecognition, stopRecognition, sendAudioChunk };
};