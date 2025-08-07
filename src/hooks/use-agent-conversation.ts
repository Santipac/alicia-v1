/**
 * @file hooks/useAgentConversation.ts
 * @description Hook principal que orquesta la conversación con el agente de ElevenLabs
 * y el envío de audio al servicio de reconocimiento de hablantes.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useVoiceStream } from 'voice-stream';
import type { ElevenLabsWebSocketEvent } from '../types/elevenlabs';
import type { SpeakerRecognitionResult } from '../types/recognition';
import { useAudioPlayer } from './use-audio-player';
import { useSpeakerRecognition } from './use-speaker-recognition';
import { ELEVENLABS_AGENT_ID } from '../constants';
import { useNavigate } from 'react-router';

// Función auxiliar para enviar mensajes JSON a través del WebSocket
const sendMessage = (websocket: WebSocket, request: object) => {
  if (websocket.readyState !== WebSocket.OPEN) {
    return;
  }
  websocket.send(JSON.stringify(request));
};

interface Asset {
  type: 'image' | 'video';
  url: string | null;
}

export const useAgentConversation = () => {
  const navigate = useNavigate();

  const [asset, setAsset] = useState<Asset>({
    type: 'image',
    url: null,
  });
  // --- Refs y Estado para la conexión con ElevenLabs ---
  const elevenLabsSocketRef = useRef<WebSocket | null>(null);
  const [isConversationConnected, setIsConversationConnected] =
    useState<boolean>(false);

  // --- MODIFICADO: Estado para el hablante actual y Ref para el anterior ---
  // Usamos useState para el hablante actual para poder devolverlo del hook y que la UI reaccione.
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  // Usamos useRef para el hablante anterior porque no necesitamos que su cambio cause un re-render.
  const previousSpeakerRef = useRef<string | null>(null);

  // --- Hooks especializados ---
  // Hook para reproducir el audio del agente
  const {
    isPlaying: isAgentSpeaking,
    addAudioChunk,
    clearQueue,
  } = useAudioPlayer();

  // Hook para el servicio de reconocimiento de hablantes
  const {
    isRecognitionConnected,
    startRecognition,
    stopRecognition,
    sendAudioChunk: sendRecognitionChunk,
  } = useSpeakerRecognition((result: SpeakerRecognitionResult) => {
    // --- LÓGICA DE DETECCIÓN DE CAMBIO DE HABLANTE ---
    // Esta es la ubicación correcta para esta lógica, ya que se ejecuta
    // cada vez que recibimos un nuevo resultado del reconocimiento.

    const newSpeaker = result.inferred_speaker;

    // Guardamos el hablante que era 'actual' como 'anterior'
    previousSpeakerRef.current = currentSpeaker;

    // Actualizamos el estado del hablante actual
    setCurrentSpeaker(newSpeaker);

    // Comparamos si hubo un cambio de hablante
    const previousSpeaker = previousSpeakerRef.current;
    if (previousSpeaker && newSpeaker !== previousSpeaker) {
      console.log(
        `¡CAMBIO DE HABLANTE! Antes: ${previousSpeaker}, Ahora: ${newSpeaker}`
      );

      // Construimos el mensaje dinámico para notificar el cambio
      const contextMessage = `Hubo un cambio de hablante. Ahora habla ${newSpeaker}, antes estaba hablando ${previousSpeaker}. Recuerda saludarlo y llamarlo por su nombre.`;

      if (elevenLabsSocketRef.current?.readyState === WebSocket.OPEN) {
        // NOTA: 'contextual_update' es un ejemplo. Verifica la documentación de ElevenLabs
        // para el tipo de mensaje correcto para actualizar el contexto de la conversación.
        console.log("sended message")
        console.log(contextMessage);
        
        sendMessage(elevenLabsSocketRef.current, {
          type: 'contextual_update', // <- Verifica si este tipo es correcto
          text: contextMessage,
        });
      }
    }
  });

  // Hook para capturar el audio del micrófono del usuario
  const { startStreaming, stopStreaming } = useVoiceStream({
    onAudioChunked: base64AudioData => {
      if (elevenLabsSocketRef.current?.readyState === WebSocket.OPEN) {
        sendMessage(elevenLabsSocketRef.current, {
          user_audio_chunk: base64AudioData,
        });
      }
      sendRecognitionChunk(base64AudioData);
    },
  });

  // --- Funciones de control de la conversación ---
  const startConversation = useCallback(async () => {
    if (isConversationConnected) return;

    startRecognition();

    const websocket = new WebSocket(
      `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_AGENT_ID}`
    );

    websocket.onopen = async () => {
      console.log('WebSocket de Conversación: Conectado.');
      setIsConversationConnected(true);
      sendMessage(websocket, { type: 'conversation_initiation_client_data' });
      await startStreaming();
    };

    websocket.onmessage = async event => {
      const data = JSON.parse(event.data) as ElevenLabsWebSocketEvent;
      if (data.type === 'interruption') {
        console.log('Interruption event received', data.interruption_event);
      }
      if(data.type === 'client_tool_call'){
        if(data.client_tool_call.tool_name === 'onNavigateRobots'){
          navigate('/robots');
        }
        if (data.client_tool_call.tool_name === 'onSetImageUrl'){
          const parameters = data.client_tool_call.parameters as {
            url: string;
          };
          setAsset({
            type: 'image',
            url: parameters.url,
          });
        }
        if (data.client_tool_call.tool_name === 'onSetVideoUrl'){
          const parameters = data.client_tool_call.parameters as {
            url: string;
          };
          setAsset({
            type: 'video',
            url: parameters.url,
          });
        }
        if (data.client_tool_call.tool_name === 'onNavigateRobots') {
          window.open("https://robots.educabot.com/bloques-75401", "_blank");
        }
      }
      if (data.type === 'audio') {
        if (data.audio_event?.audio_base_64) {
          addAudioChunk(data.audio_event.audio_base_64);
        }
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket de Conversación: Desconectado.');
      elevenLabsSocketRef.current = null;
      setIsConversationConnected(false);
      stopStreaming();
      clearQueue();
      stopRecognition();
      setAsset({
        type: 'image',
        url: null,
      });
    };

    websocket.onerror = error => {
      console.error('WebSocket de Conversación: Error.', error);
    };

    // ELIMINADO: La lógica de enviar el 'contextual_update' se movió de aquí al callback.
    elevenLabsSocketRef.current = websocket;
  }, [
    isConversationConnected,
    startStreaming,
    stopStreaming,
    addAudioChunk,
    clearQueue,
    startRecognition,
    stopRecognition,
  ]);

  const stopConversation = useCallback(async () => {
    console.log('Deteniendo todas las conexiones...');
    stopRecognition();
    setAsset({
      type: 'image',
      url: null,
    });
    elevenLabsSocketRef.current?.close(1000, 'User ended conversation');
  }, [stopRecognition]);

  // --- Efecto de limpieza principal ---
  useEffect(() => {
    return () => {
      stopConversation();
    };
  }, [stopConversation]);

  // ELIMINADO: El useEffect para loguear el ref ya no es necesario, la lógica está en el callback.

  return {
    startConversation,
    stopConversation,
    isConversationConnected,
    isAgentSpeaking,
    isRecognitionConnected,
    inferredSpeaker: currentSpeaker, // Devolvemos el estado, que sí actualizará la UI
    asset,
  };
};