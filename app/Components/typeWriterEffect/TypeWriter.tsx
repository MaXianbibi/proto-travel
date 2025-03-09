"use client";

import React, { useState, useEffect } from 'react';

interface TypeWriterProps {
  fullText: string;
}

export default function TypeWritter({ fullText }: TypeWriterProps) {

  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 50); // Vitesse d'apparition (50ms par caractère)
      return () => clearTimeout(timeout); // Nettoyage
    }
  }, [index, fullText]);

  return (
    <div >
      <p>{displayedText}</p>
    </div>
  );
}