'use client'
import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-background to-background_secondary" />      
      <main className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-20"
          >
            <Image
              src="/Logo.png"
              alt="Logo"
              width={200}
              height={200}
            />
          </motion.div>
          
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-4 bg-primary/20 blur-xl rounded-full" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 text-4xl sm:text-5xl lg:text-6xl font-bold text-primary bg-clip-text"
        >
          Enhance your web3 skills
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-lg sm:text-xl text-text/80 text-center max-w-2xl"
        >
          Accelerate your web3 career with AI-powered mentoring and intelligent tools.
          A platform that validates and rewards your blockchain progress.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-12 px-8 py-4 bg-primary text-background font-semibold rounded-full 
                   hover:bg-secondary transition-all duration-300 ease-out
                   shadow-[0_0_15px_rgba(127,184,0,0.2)] hover:shadow-[0_0_20px_rgba(127,184,0,0.3)]"
        >
          Get the Dapp
        </motion.button>
      </main>
    </div>
  );
}
