import { motion } from 'motion/react';
import GradientLayout from '../components/gradient-layout';
import AnimatedOrb from '../components/animated-orb';
import { useAgentConversation } from '../hooks/use-agent-conversation';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';

export default function RobotsPage() {
  const navigate = useNavigate();
  const {
    stopConversation,
  } = useAgentConversation();

  const onStopConversation = () => {
    stopConversation();
    navigate('/');
  }

  return (
    <GradientLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col min-h-screen px-6 space-y-8"
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
          className="inline-flex w-full"
        >
          <AnimatedOrb className="w-10 h-10 md:w-24 md:h-24" />
          <div className="inline-flex gap-3 flex-wrap items-center w-full">
            <Button variant="destructive" onClick={onStopConversation}>
              Stop Conversation
            </Button>
          </div>
        </motion.div>
        <iframe
        src="https://robots.educabot.com/bloques-75401"
        width="100%"
        height="600px" // Puedes ajustar el alto según tus necesidades
        title="Proyecto de Bloques de Educabot"
        style={{ border: '1px solid #ccc' }} // Estilo opcional
      ></iframe>
      </motion.div>
    </GradientLayout>
  );
}
