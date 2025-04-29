import React from "react";
import { useCustomQuery } from "./hooks/useCustomQuery";

function App() {
  const { data, isLoading, error } = useCustomQuery(
    "https://pokeapi.co/api/v2/pokemon/ditto",
  );

  if (isLoading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    console.log(data),
    (
      <div>
        <h1>곽지욱</h1>
      </div>
    )
  );
}

export default App;
