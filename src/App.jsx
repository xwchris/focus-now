import { Route, Routes, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar";
import Today from "./pages/Today";
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
      <SideBar />
      <Routes>
        <Route exact path="/" element={<Today />} />
      </Routes>
    </>
  );
}

export default App;
