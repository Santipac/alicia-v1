// Esta clase maneja la lógica pura de la Web Audio API, sin depender de React.

export class AudioPlayer {
    private audioContext: AudioContext;
    private audioQueue: AudioBuffer[] = [];
    private isPlaying = false;
    private onStateChange: (isPlaying: boolean) => void;
  
    constructor(onStateChange: (isPlaying: boolean) => void = () => {}) {
      // Creamos el AudioContext. Es importante hacerlo después de una interacción del usuario.
      // Nuestro hook se encargará de esto.
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.onStateChange = onStateChange;
    }
  
    public async addAudioChunk(base64AudioData: string) {
      // Decodifica y convierte el chunk de PCM a un AudioBuffer
      const audioBuffer = await this.convertPCMToAudioBuffer(base64AudioData);
      this.audioQueue.push(audioBuffer);
  
      // Si no se está reproduciendo nada, inicia la cola
      if (!this.isPlaying) {
        this.playNext();
      }
    }
  
    private playNext() {
      if (this.audioQueue.length === 0) {
        this.isPlaying = false;
        this.onStateChange(false); // Comunica el cambio de estado
        return;
      }
  
      this.isPlaying = true;
      this.onStateChange(true); // Comunica el cambio de estado
      
      const audioBuffer = this.audioQueue.shift();
      if (!audioBuffer) return;
  
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
  
      source.onended = () => {
        // Cuando el chunk termina, llama al siguiente
        this.playNext();
      };
  
      source.start();
    }
    
    // Limpia la cola y detiene la reproducción
    public clearQueue() {
      this.audioQueue = [];
      // Detener el source actual requeriría una ref al source, pero vaciar la cola
      // y resetear el estado suele ser suficiente para esta aplicación.
      if (this.isPlaying) {
          this.isPlaying = false;
          this.onStateChange(false);
      }
    }
  
    // Tu lógica de conversión, ahora como método privado de la clase
    private async convertPCMToAudioBuffer(base64AudioData: string, sampleRate = 16000): Promise<AudioBuffer> {
      // Paso 1: Decodificar Base64 a un buffer binario
      const pcmData = Uint8Array.from(atob(base64AudioData), c => c.charCodeAt(0));
      
      // Paso 2: Convertir los datos PCM de 16-bit a Float32Array (-1.0 a 1.0)
      // El audio PCM de 16-bit usa 2 bytes por muestra.
      const floatArray = new Float32Array(pcmData.length / 2);
      const dataView = new DataView(pcmData.buffer);
  
      for (let i = 0; i < floatArray.length; i++) {
        // getInt16(byteOffset, littleEndian)
        // El 'true' indica 'little-endian', que es común para PCM.
        floatArray[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }
  
      // Paso 3: Crear un AudioBuffer de Web Audio API
      const audioBuffer = this.audioContext.createBuffer(
        1, // 1 canal (mono)
        floatArray.length,
        sampleRate // Frecuencia de muestreo (ej: 16000 Hz para ElevenLabs)
      );
  
      // Copia nuestros datos procesados al buffer
      audioBuffer.copyToChannel(floatArray, 0);
      return audioBuffer;
    }
  }