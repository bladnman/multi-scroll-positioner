import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import Single from "./layouts/Single/Single";
import Double from "./layouts/Double/Double";
import Nested from "./layouts/Nested/Nested";

function App() {
  console.clear();
  return (
    <div className="App">
      {/* <Single /> */}
      {/* <Double /> */}
      <Nested />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
