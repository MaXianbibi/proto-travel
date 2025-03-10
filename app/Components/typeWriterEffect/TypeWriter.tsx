import { useEffect, useState, useRef } from 'react';

interface TypeWriterProps {
  fullText: string[];
  oldOption?: string[];
}

const TypeWritter = ({ fullText, oldOption = [] }: TypeWriterProps) => {
  const [displayedText, setDisplayedText] = useState<string[]>(oldOption);
  const animationRef = useRef<{ timer: NodeJS.Timeout | null; cleanupTimeout: NodeJS.Timeout | null }>({
    timer: null,
    cleanupTimeout: null,
  });

  useEffect(() => {
    // Nettoyer les animations précédentes
    if (animationRef.current.timer) {
      clearInterval(animationRef.current.timer);
    }
    if (animationRef.current.cleanupTimeout) {
      clearTimeout(animationRef.current.cleanupTimeout);
    }

    const findDifference = (oldStr: string, newStr: string) => {
      let commonLength = 0;
      for (let i = 0; i < Math.min(oldStr.length, newStr.length); i++) {
        if (oldStr[i] !== newStr[i]) break;
        commonLength++;
      }
      return {
        common: oldStr.slice(0, commonLength),
        toRemove: oldStr.slice(commonLength),
        toAdd: newStr.slice(commonLength),
      };
    };

    const getAnimationSpeed = (textLength: number) => {
      // Si le texte est long (> 20 caractères), utiliser une vitesse plus rapide (30ms)
      return textLength > 20 ? 30 : 50;
    };

    const animateErase = (toRemove: string, common: string, index: number, callback: () => void) => {
      let removeSteps = toRemove.length;
      const speed = getAnimationSpeed(toRemove.length + common.length); // Vitesse basée sur la longueur totale
      animationRef.current.timer = setInterval(() => {
        setDisplayedText((prev) => {
          const newText = [...prev];
          if (removeSteps > 0) {
            removeSteps--;
            newText[index] = newText[index].slice(0, -1);
            return newText;
          } else {
            clearInterval(animationRef.current.timer!);
            animationRef.current.timer = null;
            newText[index] = common;
            callback();
            return newText;
          }
        });
      }, speed);
    };

    const animateWrite = (toAdd: string, common: string, index: number) => {
      let charIndex = 0;
      const speed = getAnimationSpeed(toAdd.length + common.length); // Vitesse basée sur la longueur totale
      animationRef.current.timer = setInterval(() => {
        setDisplayedText((prev) => {
          const newText = [...prev];
          if (charIndex < toAdd.length) {
            charIndex++;
            newText[index] = common + toAdd.slice(0, charIndex);
            return newText;
          } else {
            clearInterval(animationRef.current.timer!);
            animationRef.current.timer = null;
            newText[index] = common + toAdd;
            return newText;
          }
        });
      }, speed);
    };

    const animateArray = async () => {
      const initialText = Array(fullText.length).fill('');
      if (oldOption.length > 0) {
        for (let i = 0; i < Math.min(oldOption.length, fullText.length); i++) {
          initialText[i] = oldOption[i] || '';
        }
      }
      setDisplayedText(initialText);

      for (let i = 0; i < fullText.length; i++) {
        const oldStr = i < oldOption.length ? oldOption[i] : '';
        const newStr = fullText[i] || '';

        if (oldStr === newStr) continue;

        const { common, toRemove, toAdd } = findDifference(oldStr, newStr);

        if (toRemove.length > 0) {
          await new Promise<void>((resolve) => {
            animateErase(toRemove, common, i, () => resolve());
          });
          await new Promise((resolve) => {
            animationRef.current.cleanupTimeout = setTimeout(resolve, 100);
          });
        }

        if (toAdd.length > 0) {
          await new Promise<void>((resolve) => {
            animateWrite(toAdd, common, i);
            animationRef.current.cleanupTimeout = setTimeout(resolve, toAdd.length * getAnimationSpeed(toAdd.length + common.length));
          });
        }
      }
    };

    animateArray();

    return () => {
      if (animationRef.current.timer) {
        clearInterval(animationRef.current.timer);
      }
      if (animationRef.current.cleanupTimeout) {
        clearTimeout(animationRef.current.cleanupTimeout);
      }
    };
  }, [fullText, oldOption]);


  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div ref={divRef} className='h-[535px] overflow-y-auto'>

      <span className="text-2xl font-light font-inter ">
        {displayedText.map((text, index) => (
          <span key={index}>
            {text}.
            {index < displayedText.length - 1 && ' '}
            <br />
            <br />
          </span>
        ))}
      </span>
    </div>
  );
};

export default TypeWritter;