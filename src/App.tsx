import { BrowserRouter } from "react-router-dom"
import PageRouter from "./routes/pageRouter"
function App() {

  return (
    <BrowserRouter>
      <PageRouter />
    </BrowserRouter>
  )
}

export default App
