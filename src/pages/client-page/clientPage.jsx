import { Route, Routes } from "react-router-dom";
import Header       from "../../components/Header/header";
import Footer       from "../../components/Footer/footer";
import HomePage     from "./homePage";
import About        from "./about";
import Contact      from "./contact";
import RoomSearch   from "./roomSearch";
import Gallery      from "./gallery";
import Register     from "./register";
import Profile      from "./profile";
import FeedbackPage from "./feedback";


export function CustomerPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/"         element={<HomePage />}     />
          <Route path="/about"    element={<About />}        />
          <Route path="/contact"  element={<Contact />}      />
          <Route path="/rooms"    element={<RoomSearch />}   />
          <Route path="/gallery"  element={<Gallery />}      />
          <Route path="/register" element={<Register />}     />
          <Route path="/profile"  element={<Profile />}      />
          <Route path="/feedback" element={<FeedbackPage />} />
       
        </Routes>
      </div>
      <Footer />
    </div>
  );
}