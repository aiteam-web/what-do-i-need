import { motion, AnimatePresence } from "framer-motion";

interface MicroAckProps {
  message: string;
  show: boolean;
}

const MicroAcknowledgement = ({ message, show }: MicroAckProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-sm text-muted-foreground italic text-center"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default MicroAcknowledgement;
