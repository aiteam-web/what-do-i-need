import { motion } from "framer-motion";

interface ProgressDotsProps {
  current: number;
  total: number;
}

const ProgressDots = ({ current, total }: ProgressDotsProps) => (
  <div className="flex items-center gap-2 justify-center">
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          i < current ? "bg-primary" : "bg-border"
        }`}
        animate={i === current - 1 ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.4 }}
      />
    ))}
  </div>
);

export default ProgressDots;
