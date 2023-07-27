import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  let error = searchParams.get("error");
  return (
    <>
    <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-3xl font-bold">Error</p>
        <p className="mt-5">{error}</p>
        <button className="btn btn-neutral mt-5 uppercase" onClick={() => window.history.back()}>Retry</button>
      </div>
    </>
  );
}

export default App;
