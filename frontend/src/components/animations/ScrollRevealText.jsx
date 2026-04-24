import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const ScrollRevealText = ({ text, className }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const characters = text.split('');

  return (
    <p ref={containerRef} className={className}>
      {characters.map((char, i) => {
        const start = i / characters.length;
        const end = start + 0.1;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

        return (
          <motion.span key={i} style={{ opacity }}>
            {char}
          </motion.span>
        );
      })}
    </p>
  );
};
