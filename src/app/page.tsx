'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// 🔑 Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 😍 Mood options
const moodOptions = [
  { label: 'Angry', emoji: '😠' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Happy', emoji: '😊' },
  { label: 'Okk', emoji: '😐' },
  { label: 'Crazy', emoji: '🤪' },
];

export default function Home() {
  const [complaints, setComplaints] = useState<{ content: string; mood?: string }[]>([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [loading, setLoading] = useState(true);

  // 🎉
  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // 📦 Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('content, mood')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading complaints:', error);
      } else if (data) {
        setComplaints(data);
      }
      setLoading(false);
    };

    fetchComplaints();
  }, []);

  // 💌 Submit complaint only (mood optional)
  const handleSubmitComplaint = async () => {
    const trimmed = newComplaint.trim();
    if (!trimmed) {
      alert('Write something first, love!');
      return;
    }

    const { error } = await supabase
      .from('complaints')
      .insert([{ content: trimmed }]);

    if (error) {
      console.error('Error saving complaint:', error);
      alert('Error saving complaint. Try again.');
      return;
    }

    setComplaints([...complaints, { content: trimmed }]);
    setNewComplaint('');
    launchConfetti();
  };

  // 💖 Mood emoji (separate action)
  const handleMoodSelect = async (emoji: string, label: string) => {
    const { error } = await supabase
      .from('mood')
      .insert([{ emoji, mood: label }]);

    if (error) {
      console.error('Error saving mood:', error);
      alert('Couldn’t save mood 😥');
    } else {
      alert(`Mood "${label}" saved! 🫶`);
    }
  };

  // 💬 Cute message
  const saySomethingCute = () => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    alert('i loveee youu soo mucchhh kuroo <3');
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6">
      {/* 👩‍❤️‍👨 Photos */}
      <div className="flex justify-center items-center gap-6 mb-4">
        <div className="text-center">
          <img
            src="/shorya.jpg"
            alt="Shorya"
            className="w-24 h-24 rounded-full border-4 border-pink-300 object-cover"
          />
          <p className="mt-2 font-semibold text-pink-700">Shorya</p>
        </div>
        <div className="text-center">
          <img
            src="/reya.jpg"
            alt="Reya"
            className="w-24 h-24 rounded-full border-4 border-pink-300 object-cover"
          />
          <p className="mt-2 font-semibold text-pink-700">Reya</p>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-pink-700 mb-4">
        Shorya & Reya's Love Portal <Sparkles className="inline ml-2 text-yellow-400" />
      </h1>
      <p className="text-lg text-pink-600 mb-6 text-center">
        Hey Reya! Got a tiny grievance or a silly little complaint? Submit it here, and I'll fix it with love and kisses!
      </p>

      {/* Complaint Form */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4">
        <textarea
          className="w-full p-2 border border-pink-200 rounded mb-4"
          placeholder="Write your sweet complaint here..."
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          rows={4}
        />
        <button
          onClick={handleSubmitComplaint}
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded w-full flex justify-center items-center"
        >
          {loading ? 'Loading...' : 'Submit with Love'} <Heart className="ml-2" />
        </button>
      </div>

      {/* Mood Selector */}
      <div className="mt-6 text-center">
        <p className="mb-2 text-pink-700 font-medium">How’s your mood, Reya?</p>
        <div className="flex gap-3 justify-center">
          {moodOptions.map((mood) => (
            <button
              key={mood.label}
              onClick={() => handleMoodSelect(mood.emoji, mood.label)}
              className="text-3xl hover:scale-125 transition-transform"
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Cute Button */}
      <button
        onClick={saySomethingCute}
        className="mt-6 bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded"
      >
        Say Something Cute
      </button>

      {/* Display Complaints */}
      {complaints.length > 0 && (
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">Reya's Adorable Complaints</h2>
          {complaints.map((c, i) => (
            <div key={i} className="mb-3 bg-white shadow rounded-xl p-4 border border-pink-100">
              <p className="text-xl">{c.mood ? moodOptions.find(m => m.label === c.mood)?.emoji : ''}</p>
              <p className="text-pink-800 mt-2">{c.content}</p>
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
