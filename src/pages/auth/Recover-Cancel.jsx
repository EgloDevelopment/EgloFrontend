import { useState, useEffect } from "react";

import axios from "axios";
import { useSearchParams } from "react-router-dom";

function App() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const code = searchParams.get("code");

  async function recoverConfirm() {
    const json = { id: id, code: code };
    await axios.post("/api/auth/recover-cancel", json).then((response) => {
      if (response.data.success) {
        setSuccess("Account deletion cancelled successfully");
      } else {
        setError(response.data.error);
      }
    });
  }

  useEffect(() => {
    if (id && code) {
      recoverConfirm();
    }
  }, [id, code]);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        Cancelling account deletion
      </div>

      <div className="toast toast-bottom toast-end z-50">
        {success && (
          <div
            className="alert alert-success hover:bg-green-900 cursor-pointer border-0"
            onClick={() => {
              setSuccess(null);
            }}
          >
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div
            className="alert alert-error hover:bg-red-900 cursor-pointer border-0"
            onClick={() => {
              setError(null);
            }}
          >
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
