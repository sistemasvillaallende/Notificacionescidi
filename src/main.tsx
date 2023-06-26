import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import { AuthProvider } from "./context/AuthProvider";
import "./assets/css/app.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <Provider store={store}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Provider>
  </HashRouter>
);
