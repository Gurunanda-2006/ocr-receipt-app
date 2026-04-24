import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export const WordsPullUp = ({ text, className, showAsterisk = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="relative inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block"
          >
            {word}
            {showAsterisk && i === words.length - 1 && (
              <span className="absolute top-[0.1em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

export const WordsPullUpMultiStyle = ({ segments, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Pre-calculate all words from all segments to get absolute indices for staggering
  const allWords = segments.flatMap(segment => 
    segment.text.split(' ').map(word => ({ text: word, className: segment.className }))
  );

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {allWords.map((word, i) => (
        <span key={i} className="relative inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            initial={{ y: '100%' }}
            animate={isInView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.8,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1]
            }}
            className={`inline-block ${word.className}`}
          >
            {word.text}
          </motion.span>
        </span>
      ))}
    </div>
  );
};
