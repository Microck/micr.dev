import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

function Home() {
  return <div style={{ color: "black", background: "white", minHeight: "100vh" }}>Hello, Microkeebs!</div>;
}

function App() {
  return (
    <HashRouter basename="/microkeebs">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}

export default App;