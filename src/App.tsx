import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./auth/store";

import Home from "./pages/home";
import Chat from "./pages/chat";
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import Test from "./pages/test";
import TestSimplePeer from "./pages/test-simple-peer";
import TestNewPeer from "./pages/test-new-peer";
import LoginRegister from "./pages/login-register";
import { Toaster } from "./components/ui/toaster";
import { RootState } from "./auth/store";

import "./App.css";
import Profile from "./pages/profile";
import FindUser from "./pages/find-user";

// AuthRoute component
const AuthRoute: React.FC<{
  isProtected: boolean;
  children: React.ReactNode;
}> = ({ isProtected, children }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (isProtected && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isProtected && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Route configuration
const routes = [
  { path: "/", element: <Home />, isProtected: true },
  { path: "/profile", element: <Profile />, isProtected: true },
  { path: "/find-user", element: <FindUser />, isProtected: true },
  { path: "/chat", element: <Chat />, isProtected: true },
  { path: "/chat1", element: <Chat />, isProtected: true },
  { path: "/chat2", element: <Chat />, isProtected: true },
  { path: "/chat3", element: <Chat />, isProtected: true },
  { path: "/test", element: <Test />, isProtected: true },
  { path: "/test-peer", element: <TestSimplePeer />, isProtected: true },
  { path: "/test-peer-new", element: <TestNewPeer />, isProtected: true },
  { path: "/login", element: <LoginRegister />, isProtected: false },
];

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            <Header />
            <div>
              <Routes>
                {routes.map(({ path, element, isProtected }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <AuthRoute isProtected={isProtected}>{element}</AuthRoute>
                    }
                  />
                ))}
              </Routes>
            </div>
            <Toaster />
            <Footer />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
