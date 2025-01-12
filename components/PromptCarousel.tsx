"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Headphones,
  PiggyBank,
  Book,
  Plane,
  Camera,
  Utensils,
  Dumbbell,
  TreesIcon as Plant,
  Palette,
  Film,
  Zap,
  Briefcase,
  Gamepad2,
  ShoppingBag,
  Microscope,
  Globe,
  Cpu,
} from "lucide-react";

interface Prompt {
  id: string;
  icon: React.ReactNode;
  text: string;
}

const topRowPrompts: Prompt[] = [
  {
    id: "1",
    icon: <BarChart3 className="w-4 h-4" />,
    text: "Malaysian Airlines Flight MH17",
  },
  {
    id: "2",
    icon: <PiggyBank className="w-4 h-4" />,
    text: "Long Island Serial Killer Case",
  },
  {
    id: "3",
    icon: <Book className="w-4 h-4" />,
    text: "Skripal Poisoning Case",
  },
  {
    id: "4",
    icon: <Headphones className="w-4 h-4" />,
    text: "	Charlottesville Unite the Right Rally",
  },
  {
    id: "5",
    icon: <Plane className="w-4 h-4" />,
    text: "Syrian Chemical Weapons Attacks",
  },
  {
    id: "6",
    icon: <Camera className="w-4 h-4" />,
    text: "Capitol Riot Participants",
  },
  {
    id: "7",
    icon: <Utensils className="w-4 h-4" />,
    text: "Navalny Poisoning Evidence",
  },
  {
    id: "8",
    icon: <Dumbbell className="w-4 h-4" />,
    text: "Christchurch Mosque Shooting Documentation",
  },
  {
    id: "9",
    icon: <Plant className="w-4 h-4" />,
    text: "Yemen Conflict Civilian Casualties",
  },
];

const bottomRowPrompts: Prompt[] = [
  {
    id: "10",
    icon: <Palette className="w-4 h-4" />,
    text: "Iran Protests Human Rights Violations",
  },
  {
    id: "11",
    icon: <Film className="w-4 h-4" />,
    text: "Cambridge Analytica Facebook Data",
  },
  {
    id: "12",
    icon: <Zap className="w-4 h-4" />,
    text: "Eliot Higgins Bitcoin Ransom",
  },
  {
    id: "13",
    icon: <Briefcase className="w-4 h-4" />,
    text: "Public Wi-Fi security scanner",
  },
  {
    id: "14",
    icon: <Gamepad2 className="w-4 h-4" />,
    text: "Russia-Ukraine War Troop Movements",
  },
  {
    id: "15",
    icon: <ShoppingBag className="w-4 h-4" />,
    text: "Pegasus Spyware Global Investigation",
  },
  {
    id: "16",
    icon: <Microscope className="w-4 h-4" />,
    text: "Panama Papers Leak Analysis",
  },
  {
    id: "17",
    icon: <Globe className="w-4 h-4" />,
    text: "Rohingya Genocide Documentation",
  },
  {
    id: "18",
    icon: <Cpu className="w-4 h-4" />,
    text: "Jeffrey Epstein Network",
  },
];

interface PromptCarouselProps {
  onPromptSelect: (prompt: string) => void;
}

export default function PromptCarousel({
  onPromptSelect,
}: PromptCarouselProps) {
  const [topRowOffset, setTopRowOffset] = useState(0);
  const [bottomRowOffset, setBottomRowOffset] = useState(0);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const [isTopRowPaused, setIsTopRowPaused] = useState(false);
  const [isBottomRowPaused, setIsBottomRowPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isTopRowPaused && topRowRef.current) {
        setTopRowOffset((prevOffset) => {
          const newOffset =
            (prevOffset + 0.02 * deltaTime) %
            (topRowRef.current!.scrollWidth / 2);
          return newOffset;
        });
      }
      if (!isBottomRowPaused && bottomRowRef.current) {
        setBottomRowOffset((prevOffset) => {
          const newOffset =
            (prevOffset -
              0.02 * deltaTime +
              bottomRowRef.current!.scrollWidth / 2) %
            (bottomRowRef.current!.scrollWidth / 2);
          return newOffset;
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTopRowPaused, isBottomRowPaused]);

  const handlePromptClick = (prompt: string) => {
    onPromptSelect(prompt);
  };

  return (
    <div className="relative w-full overflow-hidden py-4 mb-6 rounded-md ">
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden">
          <div
            ref={topRowRef}
            className="flex gap-4 whitespace-nowrap"
            style={{ transform: `translateX(-${topRowOffset}px)` }}
            onMouseEnter={() => setIsTopRowPaused(true)}
            onMouseLeave={() => setIsTopRowPaused(false)}
          >
            {[...topRowPrompts, ...topRowPrompts].map((prompt, index) => (
              <Button
                key={`${prompt.id}-${index}`}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap blueprint-button"
                onClick={() => handlePromptClick(prompt.text)}
              >
                {prompt.icon}
                <span className="blueprint-text">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={bottomRowRef}
            className="flex gap-4 whitespace-nowrap"
            style={{ transform: `translateX(-${bottomRowOffset}px)` }}
            onMouseEnter={() => setIsBottomRowPaused(true)}
            onMouseLeave={() => setIsBottomRowPaused(false)}
          >
            {[...bottomRowPrompts, ...bottomRowPrompts].map((prompt, index) => (
              <Button
                key={`${prompt.id}-${index}`}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap blueprint-button"
                onClick={() => handlePromptClick(prompt.text)}
              >
                {prompt.icon}
                <span className="blueprint-text">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#050c21] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#050c21] to-transparent pointer-events-none" />
    </div>
  );
}
