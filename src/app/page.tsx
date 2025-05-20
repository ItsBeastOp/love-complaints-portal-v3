'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

// ✅ Get these from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Home() {
  const [complaints, setComplaints] = useState<string[]>([]);
  const [newComplaint, setNewComplaint] = useState('');
  const [loading, setLoading] = useState(true);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // ✅ Load from Supabase on mount
  useEffect(() => {
    const fetchComplaints = async () => {
      const { data, error } = await supabase
        .from('complaints')
        .select('content')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading complaints:', error);
      } else if (data) {
        setComplaints(data.map(item => item.content));
      }
      setLoading(false);
    };

    fetchComplaints();
  }, []);

  // ✅ Submit to Supabase
  const handleSubmit = async () => {
    const trimmed = newComplaint.trim();
    if (!trimmed) return;

    const { error } = await supabase.from('complaints').insert([{ content: trimmed }]);
    if (error) {
      console.error('Error saving complaint:', error);
      alert('Something went wrong. Try again.');
      return;
    }

    setComplaints([...complaints, trimmed]);
    setNewComplaint('');
    launchConfetti();
  };

  const saySomethingCute = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
    alert('i loveee youu soo mucchhh kuroo <3');
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-pink-700 mb-4">
        Shorya & Reya's Love Portal <Sparkles className="inline ml-2 text-yellow-400" />
      </h1>
      <p className="text-lg text-pink-600 mb-6 text-center">
        Hey Reya! Got a tiny grievance or a silly little complaint? Submit it here, and I'll fix it with love and kisses!
      </p>

      {/* 💌 Input box */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4">
        <textarea
          className="w-full p-2 border border-pink-200 rounded mb-4"
          placeholder="Write your sweet complaint here..."
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          rows={4}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded w-full flex justify-center items-center"
        >
          {loading ? 'Loading...' : 'Submit with Love'} <Heart className="ml-2" />
        </button>
      </div>

      {/* 💖 Cute button */}
      <button
        onClick={saySomethingCute}
        className="mt-6 bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded"
      >
        Say Something Cute
      </button>

      {/* 📝 Display saved complaints */}
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
