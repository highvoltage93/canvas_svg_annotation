import { useState } from 'react'
import './app/App.css';
import { Header } from './widgets';
import Annotation from './entities/annotation/ui/annotation';

function App() {
  const [active, setActive] = useState<"rectangle" | "zoom_move" | "opacity">("opacity");

  return (
    <>
      <Header setActive={setActive} active={active}  />
      <Annotation active={active} />
    </>
  )
}

export default App;