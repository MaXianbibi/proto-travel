"use client";

import { useState, useEffect } from "react";

interface TextInputProps {
  onType: (value: string) => void;
  placeHolder?: string;
}

export default function TextInput({ onType, placeHolder }: TextInputProps) {
  const [text, setText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  const [lastSentText, setLastSentText] = useState(""); // Ajout d'une variable pour éviter les appels répétés

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 300);

    return () => clearTimeout(handler);
  }, [text]);

  useEffect(() => {
    if (debouncedText !== lastSentText) {
      onType(debouncedText);
      setLastSentText(debouncedText); // Stocke la dernière valeur envoyée
    }
  }, [debouncedText, onType, lastSentText]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  
  return (
    <input
      type="text"
      value={text}
      onChange={handleChange}
      className="focus:outline-none text-2xl w-full p-2  rounded-md shadow "
      placeholder={placeHolder}
    />
  );
}
