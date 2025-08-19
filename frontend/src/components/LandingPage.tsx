import React from "react";
import { motion } from "framer-motion";
import digitalDiaryLogo from "../imgs/digitalDiaryLogo.jpg";

const features = [
  {
    title: "Planner",
    description:
      "Organize your schedule, appointments, and important dates with a beautiful calendar interface.",
    color: "from-green-400 to-blue-500",
    icon: "📅",
  },
  {
    title: "Doctor Ledger",
    description:
      "Track your doctor visits, manage appointments, and keep your medical records organized.",
    color: "from-pink-400 to-purple-500",
    icon: "🩺",
  },
  {
    title: "Daily Expense Tracker",
    description:
      "Monitor your daily expenses, visualize spending, and stay on top of your budget effortlessly.",
    color: "from-yellow-400 to-orange-500",
    icon: "💸",
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl opacity-60"
          animate={{ x: [0, 100, -100, 0], y: [0, 80, -80, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          style={{ top: "10%", left: "5%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-3xl opacity-50"
          animate={{ x: [0, -120, 120, 0], y: [0, -60, 60, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          style={{ top: "60%", left: "60%" }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-40"
          animate={{ x: [0, 80, -80, 0], y: [0, 100, -100, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          style={{ top: "40%", left: "80%" }}
        />
      </motion.div>
      {/* Logo and Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-10 flex flex-col items-center mt-16"
      >
        <img
          src={digitalDiaryLogo}
          alt="Digital Diary Logo"
          className="w-32 h-32 rounded-full shadow-2xl mb-6 border-4 border-green-400 animate-spin-slow"
        />
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-6xl font-extrabold text-white drop-shadow-lg mb-4 tracking-wide animate-gradient-text"
        >
          Digital Diary
        </motion.h1>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-xl text-zinc-200 mb-8 text-center max-w-xl"
        >
          Your all-in-one solution for planning, tracking doctor visits, and
          managing daily expenses with style and ease.
        </motion.p>
      </motion.div>
      {/* Animated Feature Cards */}
      <div className="z-10 flex flex-wrap justify-center gap-8 mb-16">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 + idx * 0.3 }}
            whileHover={{ scale: 1.08, rotate: [0, 2, -2, 0] }}
            className={`w-80 h-64 bg-gradient-to-br ${feature.color} rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden cursor-pointer hover:shadow-3xl hover:brightness-110`}
          >
            <motion.div
              className="text-5xl mb-4 animate-bounce"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {feature.icon}
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg animate-gradient-text">
              {feature.title}
            </h2>
            <p className="text-lg text-white text-center opacity-90">
              {feature.description}
            </p>
            <motion.div
              className="absolute bottom-0 left-0 w-full h-2 bg-white/20 animate-pulse"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        ))}
      </div>
      {/* Signup/Login Buttons */}
      <motion.div
        className="z-10 flex gap-8 mb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <a
          href="/signup"
          className="px-8 py-3 rounded-full bg-zinc-700 text-zinc-100 font-bold text-xl shadow-lg hover:bg-zinc-600 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-400 animate-gradient-text"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="px-8 py-3 rounded-full bg-zinc-800 text-zinc-100 font-bold text-xl shadow-lg hover:bg-zinc-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-zinc-500 animate-gradient-text"
        >
          Log In
        </a>
      </motion.div>
      {/* Custom Animations */}
      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes gradient-text {
          0% { color: #22c55e; }
          50% { color: #3b82f6; }
          100% { color: #22c55e; }
        }
        .animate-gradient-text {
          animation: gradient-text 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
