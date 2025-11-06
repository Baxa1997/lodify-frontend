import ErrorBoundary from "./components/ErrorBoundary";
import Router from "./router/router";
import {SocketProvider} from "./context/SocketProvider";
import "react-tabs/style/react-tabs.css";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <SocketProvider>
          <Router />
        </SocketProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
