import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Job from "./Job";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/usegetalljobs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Browse = () => {
  const navigate = useNavigate();
  const isauth = useSelector((store) => store.auth.auth);

  if (!isauth) {
    toast.error("Please login to see Applications", {});
    navigate("/login");
  }
  useGetAllJobs();

  const dispatch = useDispatch();
  const { allJobs } = useSelector((store) => store.job);
  console.log("allJobs", allJobs);

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <h1 className="font-bold text-xl my-10">
          Search Results ({allJobs.length || 0})
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {Array.isArray(allJobs) &&
            allJobs.map((job) => <Job key={job._id} job={job} />)}
        </div>
      </div>
    </div>
  );
};

export default Browse;
