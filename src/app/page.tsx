'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [moodMessage, setMoodMessage] = useState<string | null>(null);
  const [lovePopup, setLovePopup] = useState(false);

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

    const { error } = await supabase.from('complaints').insert([{ content: trimmed }]);

    if (error) {
      console.error('Error saving complaint:', error);
      alert('Error saving complaint. Try again.');
      return;
    }

    setComplaints([...complaints, { content: trimmed }]);
    setNewComplaint('');
    launchConfetti();
  };

  const handleMoodSelect = async (emoji: string, label: string) => {
    const { error } = await supabase.from('mood').insert([{ emoji, mood: label }]);

    if (error) {
      console.error('Error saving mood:', error);
      alert('Couldn’t save mood 😥');
    } else {
      setMoodMessage(`Mood "${label}" ${emoji} saved with love! 💕`);
      setTimeout(() => setMoodMessage(null), 3000);
    }
  };

  const saySomethingCute = () => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    setLovePopup(true);
    setTimeout(() => setLovePopup(false), 4000);
  };

  return (
    <div className="relative min-h-screen bg-pink-50 flex flex-col items-center p-6 overflow-hidden">

      {/* 💖 Floating Hearts Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 text-2xl"
            initial={{ y: '100vh', x: `${Math.random() * 100}%`, opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 1, 0] }}
            transition={{
              delay: Math.random() * 5,
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      {/* 💌 Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 max-w-md text-center border-4 border-pink-200"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120 }}
          >
            <h2 className="text-xl font-bold text-pink-600 mb-2">
              📣 Welcome to the Love Complaints Portal! 💔
            </h2>
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowWelcome(false)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                Okayyy 💕
              </button>
              <button
                onClick={() => {
                  saySomethingCute();
                  setShowWelcome(false);
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                Say Something Cute 💖
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* 💕 Love Pop-Up */}
      <AnimatePresence>
        {lovePopup && (
          <motion.div
            className="fixed top-20 bg-yellow-200 text-pink-800 px-6 py-4 rounded-2xl font-bold shadow-xl z-50 text-center text-lg"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            💖 I loveeee youuu sooo mucchhh KUROO 😘💋✨🧸
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of the app remains unchanged below this */}
