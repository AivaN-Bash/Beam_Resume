import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

class AppErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-page" role="alert">
          <h1>Something went wrong.</h1>
          <p>Please refresh the page. If the problem continues, try again later.</p>
          <button type="button" onClick={() => window.location.reload()}>Refresh page</button>
        </main>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Required application root element #root was not found.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>
);
