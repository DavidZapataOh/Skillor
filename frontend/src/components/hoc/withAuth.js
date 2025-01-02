import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";

export function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const { ready, authenticated } = usePrivy();

    if (!authenticated && ready) {
      return (
        <div className="p-6 ml-64 h-[calc(100vh-80px)] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-text mb-4">Connect Your Wallet</h2>
            <p className="text-textSecondary">
              Please connect your wallet to access this section.
            </p>
          </motion.div>
        </div>
      );
    }

    if (!ready) {
      return (
        <div className="p-6 ml-64 h-[calc(100vh-80px)] flex items-center justify-center">
          <div className="text-primary">Loading...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
} 