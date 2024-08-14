import "./App.css";
import { BrowserRouter, Routes, Route, RouterProvider } from "react-router-dom";
import {
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Signup from "./pages/signup/Signup";
import Signin from "./pages/signin/Signin";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import TodoContainer from "./pages/todoContainer/TodoContainer";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/users",
      children: [
        { path: "signin", element: <Signin /> },
        { path: "signup", element: <Signup /> },
      ],
    },
    { path: "/", element: <TodoContainer /> },
  ]);
  /*
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<div>Welcome to Authentication Application</div>}
          />
          <Route
            path="/users"
            children={
              <>
                <Route path="signin" element={<Signin />} />
                <Route path="signup" element={<Signup />} />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );*/
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
      <ToastContainer />
    </>
  );
}

export default App;
