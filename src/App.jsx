import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import UserDetails from "./pages/UserDetails";
import TaskDetails from "./pages/TaskDetails";
import AppHistory from "./pages/AppHistory";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/new" element={<CreateUser />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/tasks/:taskId" element={<TaskDetails />} />
                <Route path="/history" element={<AppHistory />} />
            </Routes>
        </BrowserRouter>
    );
}