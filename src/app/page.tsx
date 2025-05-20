'use client';

import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Home() {
  const [complaints, setComplaints] = useState<string[]>([]);
  const [newComplaint, setNewComplaint] = useState('');

  const handleSubmit = () => {
    if (newComplaint.trim()) {
      setComplaints([...complaints, newComplaint]);
      setNewComplaint('');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // ... rest of your component
}
