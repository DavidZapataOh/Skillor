"use client";

import { usePrivy } from "@privy-io/react-auth";

function AuthButton() {
  const { ready, authenticated, login, logout } = usePrivy();

  return (
    <div>
      {authenticated && ready ? (
        <button
          type="button"
          onClick={logout}
          className="bg-primary text-background font-bold py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      ) : (
        <button
          type="button"
          onClick={login}
          className="bg-primary text-background font-bold py-2 px-4 rounded-lg"
      >
        Login
        </button>
      )}
    </div>
  );
}

  export default AuthButton;