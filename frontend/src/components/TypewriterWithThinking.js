// src/components/TypewriterWithThinking.js
import React, { useEffect, useState } from 'react';

const defaultConfig = {
  thinkingDuration: 1900, // Duración de la fase "pensando" (ms)
  typingSpeed: 100,      // Velocidad de escritura (ms por carácter)
  erasingSpeed: 30,       // Velocidad de borrado (ms por carácter)
  pauseDuration: 1000,    // Tiempo de pausa al terminar de escribir o borrar (ms)
};

const TypewriterWithThinking = ({ words, config = defaultConfig }) => {
  const { thinkingDuration, typingSpeed, erasingSpeed, pauseDuration } = config;
  
  // Fases: 'thinking' | 'typing' | 'pausing' | 'erasing'
  const [phase, setPhase] = useState('thinking');
  const [displayedText, setDisplayedText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];

    if (phase === 'thinking') {
      timer = setTimeout(() => {
        setPhase('typing');
      }, thinkingDuration);
    } else if (phase === 'typing') {
      if (displayedText !== currentWord) {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setPhase('pausing');
        }, pauseDuration);
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => {
        setPhase('erasing');
      }, pauseDuration);
    } else if (phase === 'erasing') {
      if (displayedText !== '') {
        timer = setTimeout(() => {
          setDisplayedText(currentWord.substring(0, displayedText.length - 1));
        }, erasingSpeed);
      } else {
        setPhase('thinking');
        setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, displayedText, words, wordIndex, thinkingDuration, typingSpeed, erasingSpeed, pauseDuration]);

  return (
    <span className="typewriter-with-thinking">
      {phase === 'thinking' ? (
        <span className="thinking-indicator"></span>
      ) : (
        displayedText
      )}
    </span>
  );
};

export default TypewriterWithThinking;
