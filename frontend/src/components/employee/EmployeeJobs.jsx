import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchJobByText } from "@/redux/jobSlice";
import EmployeeJobsTable from "./EmployeeJobsTable";
import Usegetallemployeejobs from "@/hooks/usegetallemployeejobs";

const EmployeeJobs = () => {
  Usegetallemployeejobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/employee/jobs/create")}>
            New Jobs
          </Button>
        </div>
        <EmployeeJobsTable />
      </div>
    </div>
  );
};

export default EmployeeJobs;
