'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem('welcomeShown');
    if (!hasShown) {
      setShowWelcome(true);
      sessionStorage.setItem('welcomeShown', 'true');
    }
  }, []);

  const launchConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

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

  const handleSubmitComplaint = async () => {
    const trimmed = newComplaint.trim();
    if (!trimmed) {
      alert('Write something first, love!');
      return;
    }

    const { error } = await supabase
      .from('complaints')
      .insert([{ content: trimmed, mood: selectedMood }]);

    if (error) {
      console.error('Error saving complaint:', error);
      alert('Error saving complaint. Try again.');
      return;
    }

    setComplaints([...complaints, { content: trimmed, mood: selectedMood ?? undefined }]);
    setNewComplaint('');
    setSelectedMood(null);
    launchConfetti();
  };

  const saySomethingCute = () => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    alert('i loveee youu soo mucchhh kuroo <3');
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6">

      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md text-center border-4 border-pink-200">
            <h2 className="text-xl font-bold text-pink-600 mb-2">📣 Welcome to the Love Complaints Portal! 💔</h2>
            <p className="text-pink-800 mb-4 text-sm leading-relaxed">
              Here you can say whatever you want to tell your silly boyfriend indirectly:
              <br /><br />
              🥺 Cry about ignored texts,<br />
              😤 Rant about forgotten anniversaries,<br />
              😆 Complain about silly fights,<br />
              😍 And still say "I love you" five seconds later.
              <br /><br />
              Your love drama is safe here. Let it out. We won’t judge.<br />
              (In fact, we might even give you a virtual tissue 🧻💕)
              <br /><br />
              Ready? Go spill the tea. ☕
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full"
            >
              Okayyy 💕
            </button>
          </div>
        </div>
      )}

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

      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-4">
        <textarea
          className="w-full p-2 border border-pink-200 rounded mb-4"
          placeholder="Write your sweet complaint here..."
          value={newComplaint}
          onChange={(e) => setNewComplaint(e.target.value)}
          rows={4}
        />

        <div className="flex justify-center gap-3 mb-4">
          {moodOptions.map((mood) => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood.label)}
              className={`text-3xl hover:scale-125 transition-transform ${
                selectedMood === mood.label ? 'ring-2 ring-pink-400 rounded-full' : ''
              }`}
              title={mood.label}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmitComplaint}
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded w-full flex justify-center items-center"
        >
          {loading ? 'Loading...' : 'Submit with Love'} <Heart className="ml-2" />
        </button>
      </div>

      <button
        onClick={saySomethingCute}
        className="mt-6 bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded"
      >
        Say Something Cute
      </button>

      {complaints.length > 0 && (
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold text-pink-700 mb-4">Reya's Adorable Complaints</h2>
          {complaints.map((c, i) => (
            <div key={i} className="mb-3 bg-white shadow rounded-xl p-4 border border-pink-100">
              {c.mood && (
                <p className="text-xl">
                  {moodOptions.find((m) => m.label === c.mood)?.emoji} <span className="text-sm text-pink-500">{c.mood}</span>
                </p>
              )}
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
