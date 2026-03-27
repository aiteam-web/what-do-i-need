import { motion } from "framer-motion";

interface NeedChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const NeedChip = ({ label, selected, onToggle }: NeedChipProps) => (
  <motion.button
    onClick={onToggle}
    className={`chip-base ${selected ? "chip-selected" : ""}`}
    whileTap={{ scale: 0.95 }}
    layout
  >
    {label}
  </motion.button>
);

export default NeedChip;
