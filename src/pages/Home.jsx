import { useState, useEffect } from "react";

import axios from "axios";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

import Error from "../../components/Error";

import CheckLoggedIn from "../../functions/check-logged-in"

function App() {
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    CheckLoggedIn()
  }, []);

  return (
    <>
      <Error showError={showError} setShowError={setShowError} text={error} />
      <Button color="primary" onClick={() => {setError("Testing"), setShowError(true)}}>Button</Button>
    </>
  );
}

export default App;
