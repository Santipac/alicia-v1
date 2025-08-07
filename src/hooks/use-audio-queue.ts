import { useState, useEffect, useCallback, useRef } from 'react';

export const useAudioQueue = () => {
  const [queue, setQueue] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Usaremos una ref para mantener la instancia de audio actual y evitar
  // que se vea afectada por los re-renders del componente.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addToQueue = useCallback((audioSrc: string) => {
    if (audioSrc) {
      setQueue((prevQueue) => [...prevQueue, audioSrc]);
    }
  }, []);

  const clearQueue = useCallback(() => {
    if (audioRef.current) {
      // Detiene y limpia el audio actual
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    // Vacía la cola y resetea el estado
    setQueue([]);
    setIsPlaying(false);
  }, []);

  // El useEffect ahora se encarga de vigilar y disparar la reproducción,
  // pero la lógica principal está en la función 'playNextInQueue'.
  useEffect(() => {
    // Si no estamos reproduciendo nada y hay audios en la cola, empezamos.
    if (!isPlaying && queue.length > 0) {
      const audioSrc = queue[0];
      
      // Creamos una nueva instancia de audio
      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      // Marcamos que estamos reproduciendo ANTES de llamar a .play()
      setIsPlaying(true);

      audio.onended = () => {
        // Cuando termina, limpiamos y avanzamos la cola
        setIsPlaying(false);
        setQueue((prevQueue) => prevQueue.slice(1));
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error("Error al reproducir audio:", e);
        // Si hay un error, actuamos como si hubiera terminado para pasar al siguiente
        setIsPlaying(false);
        setQueue((prevQueue) => prevQueue.slice(1));
        audioRef.current = null;
      };

      audio.play().catch(error => {
        // El AbortError es esperado si limpiamos la cola, así que lo ignoramos si es el caso.
        if (error.name === 'AbortError') {
          console.log('Reproducción abortada intencionalmente.');
          return;
        }
        console.error("Error en play() (Autoplay bloqueado?):", error);
        // Si falla el play, reseteamos el estado para no quedarnos bloqueados.
        setIsPlaying(false);
        audioRef.current = null;
      });
    }

    // La función de limpieza ahora es más específica.
    // Solo debe actuar si el componente se desmonta.
    return () => {
      // Si el componente se desmonta, queremos detener cualquier audio pendiente.
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  // La dependencia clave es la longitud de la cola y el estado de reproducción.
  // Esta combinación asegura que el efecto se re-evalúe solo cuando un audio termina
  // o cuando se añade el primer audio a una cola vacía.
  }, [queue, isPlaying]);


  return { addToQueue, isPlaying, queueLength: queue.length, clearQueue };
};