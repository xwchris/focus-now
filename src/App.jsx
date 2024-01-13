import { Route, Routes, useLocation } from "react-router-dom";
// import SideBar from "./components/SideBar";
import Today from "./pages/Today";
// import Tomorrow from "./pages/Tomorrow";
// import After from "./pages/After";
import "preline/preline";
import { useEffect } from "react";
// import { IStaticMethods } from "preline/preline";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <>
      {/* <SideBar /> */}
      <Routes>
        <Route exact path="/" element={<Today />} />
        {/* <Route exact path="/tomorrow" element={<Tomorrow />} />
        <Route exact path="/after" element={<After />} /> */}
      </Routes>
    </>
  );
}

export default App;
