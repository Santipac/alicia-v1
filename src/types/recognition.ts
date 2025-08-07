/**
 * @file types/recognition.ts
 * @description Define las interfaces de TypeScript para la respuesta del servicio de reconocimiento de hablantes.
 */

/**
 * Representa el objeto de confianza de los hablantes.
 * Cada clave es el nombre de un hablante y el valor es su porcentaje de confianza como string.
 * @example { "john": "85.2%", "jane": "12.1%" }
 */
export interface SpeakerConfidence {
    [speakerName: string]: string;
  }
  
  /**
   * Define la estructura completa de un resultado exitoso del WebSocket de
   * reconocimiento de hablantes.
   */
  export interface SpeakerRecognitionResult {
    timestamp: number;
    speakers: SpeakerConfidence;
    audio_length: number;
    total_speakers: number;
    audio_energy: number;
    activation_threshold: boolean;
    activation_threshold_limit: number;
    current_audio_energy: number;
    inferred_speaker: string;
    speaker_confidence_threshold: number;
  }