import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import UserDetails from "./pages/UserDetails";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/new" element={<CreateUser />} />
                <Route path="/users/:id" element={<UserDetails />} />
            </Routes>
        </BrowserRouter>
    );
}
