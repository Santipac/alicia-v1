import { useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mic, Phone, PhoneOff, User, WifiOff } from 'lucide-react';
import { Button } from './ui/button';

interface ConversationProps {
  startConversation: () => void;
  isConversationConnected: boolean;
  isRecognitionConnected: boolean;
  inferredSpeaker: string;
  isAgentSpeaking: boolean;
  stopConversation: () => void;
}

export function Conversation({
  startConversation,
  isConversationConnected,
  isRecognitionConnected,
  inferredSpeaker,
  isAgentSpeaking,
  stopConversation,
}: ConversationProps) {

  const handleStart = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startConversation();
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [startConversation]);

  return (
    <>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-8"
      >
        <AnimatePresence mode="wait">
          {!isConversationConnected ? (
            <motion.div
              key="start-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={handleStart}
                disabled={isConversationConnected}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <motion.div
                  className="flex items-center justify-center space-x-3"
                  animate={
                    isConversationConnected ? { scale: [1, 1.05, 1] } : {}
                  }
                  transition={{
                    duration: 1,
                    repeat: isConversationConnected ? Infinity : 0,
                  }}
                >
                  {isConversationConnected ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <Phone className="w-5 h-5" />
                      </motion.div>
                      <span>Conectando...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      <span>Iniciar Conversación</span>
                    </>
                  )}
                </motion.div>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="stop-button"
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Button onClick={stopConversation} variant="destructive">
                <div className="flex items-center justify-center space-x-3">
                  <PhoneOff className="w-5 h-5" />
                  <span>Detener Conversación</span>
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isConversationConnected && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="w-full max-w-lg"
          >
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl w-full">
              {/* Estado de Conexión */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-4"
              >
                <span className="/80 font-medium">Estado:</span>
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                  <span className="text-green-400 font-semibold">
                    Conectado
                  </span>
                </div>
              </motion.div>

              {/* Estado de Reconocimiento */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between mb-4 gap-4"
              >
                <span className="/80 font-medium">
                  Estado de Reconocimiento:
                </span>
                <div className="flex items-center space-x-2">
                  {isRecognitionConnected ? (
                    <>
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="w-2 h-2 bg-green-400 rounded-full"
                      />
                      <span className="text-green-400 font-semibold">
                        Conectado
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-semibold">
                        Desconectado
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Agente Hablando */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between mb-4"
              >
                <span className="/80 font-medium">¿Agente Hablando?</span>
                <div className="flex items-center space-x-2">
                  {isAgentSpeaking ? (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Mic className="w-4 h-4 text-blue-400" />
                      </motion.div>
                      <span className="text-blue-400 font-semibold">Sí</span>
                    </>
                  ) : (
                    <span className="text-gray-400 font-semibold">No</span>
                  )}
                </div>
              </motion.div>

              {/* Hablante Inferido */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <span className="/80 font-medium">Hablante Inferido:</span>
                <div className="flex items-center space-x-2">
                  {inferredSpeaker ? (
                    <>
                      <User className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-semibold">
                        {inferredSpeaker}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400 font-semibold">-</span>
                  )}
                </div>
              </motion.div>

              {/* Indicador de Actividad */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                    ))}
                  </div>
                  <span className="/60 text-sm">Conversación activa</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
