import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import "./App.css";

function ProtectedRoute({ children }) {
    const user = localStorage.getItem("hairloon_user");
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

function PublicRoute({ children }) {
    const user = localStorage.getItem("hairloon_user");
    if (user) {
        return <Navigate to="/home" replace />;
    }
    return children;
}

function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/home" replace />}
            />
        </Routes>
    );
}

export default App;