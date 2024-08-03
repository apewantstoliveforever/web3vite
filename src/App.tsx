import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";

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
import TestSong from "./pages/test-song";
import Leftbar from "./layouts/left-bar";

//import dispatch to get friend request from redux
import { useDispatch } from "react-redux";

import { db, sea, user } from "./services/gun";

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
  { path: "/test-song", element: <TestSong />, isProtected: true },
  { path: "/login", element: <LoginRegister />, isProtected: false },
  {},
];

const App: React.FC = () => {
  const countNotifications = useSelector(
    (state: RootState) => state.auth.notifications.length
  );
  const notifications = useSelector(
    (state: RootState) => state.auth.notifications
  );
  const dispatch = useDispatch();
  useEffect(() => {
    //listen if have a friend request
    if (user.is) {
      console.log("user.is.pub", user.is.pub);
      const pub = user.is.pub;
      // console.log("username", pub);
      db.get(`friend-requestsa-${pub}`).map().on((data: any) => {
        //check if its new notification
        const isExist = notifications.some(
          (notification) => notification.body === data.from
        );
        if (!isExist) {
          const newRequest = {
            title: "Friend Request",
            body: data.from,
          };

          dispatch({
            type: "ADD_NOTIFICATION",
            payload: newRequest,
          });
        }
      });
    }
    return () => {
      // if (user.is)
        // db.get(`friend-requests-${user.is.alias}`).off;
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="flex flex-1">
          <Leftbar />
          <div className="flex-1">
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
        </div>
        <Toaster />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
