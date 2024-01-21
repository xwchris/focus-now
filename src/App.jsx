import { Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Today from "./pages/Today";
import "preline/preline";

function App() {
  return (
    <ChakraProvider
      theme={extendTheme({
        initialColorMode: "dark",
        useSystemColorMode: false,
      })}
    >
      <section className="w-[900px] mx-auto flex">
        <SideBar />
        <main className="flex-1">
          <Routes>
            <Route exact path="/" element={<Today />} />
          </Routes>
        </main>
      </section>
    </ChakraProvider>
  );
}

export default App;
