import { useEffect } from "react";
import Navbar from "./shared/Navbar";
import HeroSection from "./HeroSection";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CategoryCarousel from "./CategoryCarousel ";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/usegetalljobs";

const Home = () => {
  useGetAllJobs();
  // const  user  = useSelector((store) => store.auth.user);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (user?.role === "recruiter") {
  //     navigate("/admin/companies");
  //   }
  // }, []);

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  );
};

export default Home;
