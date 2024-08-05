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
// import Header from "./layouts/header";
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
import Server from "./pages/server";
import Rightbar from "./layouts/right-bar";
import Map from "./pages/map";

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
    return (
      <div className="flex h-screen flex-col w-full">
        <Navigate to="/" replace />;
      </div>
    );
  }

  return <>{children}</>;
};

// Route configuration
const routes = [
  { path: "/", element: <Home />, isProtected: true },
  { path: "/profile", element: <Profile />, isProtected: true },
  { path: "/find-user", element: <FindUser />, isProtected: true },
  // { path: "/chat", element: <Chat />, isProtected: true },
  { path: "/test", element: <Test />, isProtected: true },
  { path: "/test-peer", element: <TestSimplePeer />, isProtected: true },
  { path: "/test-peer-new", element: <TestNewPeer />, isProtected: true },
  { path: "/test-song", element: <TestSong />, isProtected: true },
  { path: "/login", element: <LoginRegister />, isProtected: false },
  { path: "/server/:id", element: <Server />, isProtected: true },
  { path: "/map", element: <Map />, isProtected: true },
];

const App: React.FC = () => {
  const countNotifications = useSelector(
    (state: RootState) => state.auth.notifications.length
  );
  const notifications = useSelector(
    (state: RootState) => state.auth.notifications
  );
  const dispatch = useDispatch();

  const joinedServers = [
    {
      name: "test-1",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "test-2",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "test-3",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "test-4",
      image: "https://via.placeholder.com/150",
    },
  ];
  useEffect(() => {
    //listen if have a friend request
    if (user.is) {
      console.log("user.is.pub", user.is.pub);
      const pub = user.is.pub;
      // console.log("username", pub);
      db.get(`friend-requestsa-${pub}`)
        .map()
        .on((data: any) => {
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

        <div className="flex flex-1 w-full">
          <Leftbar joinedServers={joinedServers} />
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
          {/* <Rightbar /> */}
        </div>
        <Toaster />
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
