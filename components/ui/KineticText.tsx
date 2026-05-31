'use client'
import { motion, Variants } from 'framer-motion'

interface KineticTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  mode?: 'words' | 'chars'
}

const WORD_VARIANTS: Variants = {
  hidden: {},
  visible: (i: number) => ({
    transition: { staggerChildren: 0.055, delayChildren: i * 0.12 },
  }),
}

const CHAR_VARIANTS: Variants = {
  hidden: { y: '110%', opacity: 0, rotateZ: 3 },
  visible: {
    y: '0%',
    opacity: 1,
    rotateZ: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 180,
      mass: 0.8,
    },
  },
}

const WORD_CHAR_VARIANTS: Variants = {
  hidden: { y: '115%', opacity: 0 },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 18,
      stiffness: 160,
      mass: 0.9,
    },
  },
}

export function KineticText({
  text,
  className = '',
  delay = 0,
  stagger = 0.04,
  as: Tag = 'h1',
  mode = 'words',
}: KineticTextProps) {
  const words = text.split(' ')

  if (mode === 'chars') {
    const chars = text.split('')
    return (
      <Tag className={className}>
        <motion.span
          style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}
          variants={WORD_VARIANTS}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          {chars.map((char, i) => (
            <span key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
              <motion.span
                variants={CHAR_VARIANTS}
                style={{ display: 'inline-block' }}
                custom={i}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </Tag>
    )
  }

  return (
    <Tag className={className}>
      <motion.span
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((word, wi) => (
          <span key={wi} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.span
              variants={WORD_CHAR_VARIANTS}
              style={{ display: 'inline-block' }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
