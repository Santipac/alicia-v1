import { useState, useRef, useEffect, useCallback } from 'react';
import { AudioPlayer } from '../lib/audio-player';

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<AudioPlayer | null>(null);

  // Efecto para inicializar el AudioPlayer una sola vez cuando el componente se monta.
  // Es crucial que se cree aquí para que persista entre renders.
  useEffect(() => {
    // La función que pasamos al constructor es la que sincroniza
    // el estado interno de la clase con el estado de React.
    playerRef.current = new AudioPlayer(setIsPlaying);

    // Limpieza: podrías añadir lógica aquí si fuera necesario
    return () => {
      playerRef.current?.clearQueue();
    };
  }, []);

  const addAudioChunk = useCallback((base64AudioData: string) => {
    playerRef.current?.addAudioChunk(base64AudioData);
  }, []);

  const clearQueue = useCallback(() => {
    playerRef.current?.clearQueue();
  }, []);
  
  return { isPlaying, addAudioChunk, clearQueue };
};