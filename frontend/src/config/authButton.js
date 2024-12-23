"use client";

import { useAuth } from "@crossmint/client-sdk-react-ui";

function AuthButton() {
  const { login, logout, jwt } = useAuth();

  return (
    <div>
      {jwt == null ? (
        <button
          type="button"
          onClick={login}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      ) : (
        <button
          type="button"
          onClick={logout}
          className="bg-black text-white font-bold py-2 px-4 rounded border-2 border-blue-500"
        >
          Logout
        </button>
      )}
    </div>
  );
}

  export default AuthButton;