'use client';

import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
export default function Home() {
  const [complaints, setComplaints] = useState<string[]>([]);
  const [newComplaint, setNewComplaint] = useState('');

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = () => {
    if (newComplaint.trim()) {
      setComplaints([...complaints, newComplaint]);
      setNewComplaint('');
      launchConfetti();
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-pink-700 mb-4">
        Shorya & Reya's Love Portal <Sparkles className="inline ml-2 text-yellow-400" />
      </h1>
      <p className="text-lg text-pink-600 mb-6 text-center">
        Hey Reya! Got a tiny grievance or a silly little complaint? Submit it here, and I'll fix it with love and kisses!
      </p>
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4">
        <textarea
          className="w-full p-2 border border-pink-200 rounded mb-4"
          placeholder="Write your sweet complaint here..."
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded w-full flex justify-center items-center"
        >
          Submit with Love <Heart className="ml-2" />
        </button>
      </div>

      {complaints.length > 0 && (
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">Reya's Adorable Complaints</h2>
          {complaints.map((c, i) => (
            <div key={i} className="mb-3 bg-white shadow rounded-xl p-4 border border-pink-100">
              <p className="text-pink-800">{c}</p>
              <p className="text-sm text-gray-500 mt-2 italic">
                Noted, my love. Shorya will handle this with hugs and maybe a surprise chocolate!
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
