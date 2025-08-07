import AnimatedOrb from './components/animated-orb';
import { Conversation } from './components/conversation';
import GradientLayout from './components/gradient-layout';
import { motion } from 'motion/react';
import { useAgentConversation } from './hooks/use-agent-conversation';
import { VideoPlayer, VideoPlayerContent, VideoPlayerControlBar, VideoPlayerMuteButton, VideoPlayerPlayButton, VideoPlayerSeekBackwardButton, VideoPlayerSeekForwardButton, VideoPlayerTimeDisplay, VideoPlayerTimeRange, VideoPlayerVolumeRange } from './components/ui/video';
import '@fontsource/geist';

export default function App() {
  const {
    startConversation,
    isConversationConnected,
    isRecognitionConnected,
    inferredSpeaker,
    isAgentSpeaking,
    stopConversation,
    asset,
  } = useAgentConversation();

  return (
    <GradientLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className="mb-8"
        >
          <AnimatedOrb />
        </motion.div>
        {asset.type === 'image' && asset.url && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <img
              src={asset.url}
              alt="Imagen del agente"
              className="max-w-[250px] h-[250px] w-fit  object-contain"
            />
          </motion.div>
        )}
        {asset.type === 'video' && asset.url && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <VideoPlayer className="overflow-hidden rounded-lg border">
              <VideoPlayerContent
                crossOrigin=""
                muted
                preload="auto"
                slot="media"
                src={asset.url}
              />
              <VideoPlayerControlBar>
                <VideoPlayerPlayButton />
                <VideoPlayerSeekBackwardButton />
                <VideoPlayerSeekForwardButton />
                <VideoPlayerTimeRange />
                <VideoPlayerTimeDisplay showDuration />
                <VideoPlayerMuteButton />
                <VideoPlayerVolumeRange />
              </VideoPlayerControlBar>
            </VideoPlayer>
          </motion.div>
        )}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Alicia
        </motion.h1>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Conversation
            startConversation={startConversation}
            isConversationConnected={isConversationConnected}
            isRecognitionConnected={isRecognitionConnected}
            inferredSpeaker={inferredSpeaker || ''}
            isAgentSpeaking={isAgentSpeaking}
            stopConversation={stopConversation}
          />
        </motion.div>
      </motion.div>
    </GradientLayout>
  );
}
