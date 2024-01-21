import { Route, Routes } from "react-router-dom";
import SideBar from "./components/SideBar";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Todo from "./pages/Todo";
import Habit from "./pages/Habit";
import { useTasks } from "./hooks/useTasks";
import { useHabits } from "./hooks/useHabits";

function App() {
  const taskProps = useTasks();
  const habitProps = useHabits();

  return (
    <ChakraProvider
      theme={extendTheme({
        initialColorMode: "dark",
        useSystemColorMode: false,
      })}
    >
      <section className="w-[900px] mx-auto flex">
        <SideBar tasks={taskProps.tasks} habits={habitProps.tasks} />
        <main className="flex-1">
          <Routes>
            <Route exact path="/" element={<Todo {...taskProps} />} />
            <Route path="/habit" element={<Habit {...habitProps} />} />
          </Routes>
        </main>
      </section>
    </ChakraProvider>
  );
}

export default App;
