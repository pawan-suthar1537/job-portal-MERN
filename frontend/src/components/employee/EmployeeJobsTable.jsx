import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { DeleteIcon, Edit2, MoreHorizontal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { deleteJob } from "@/redux/jobSlice";
import Usegetallemployeejobs from "@/hooks/usegetallemployeejobs";

const EmployeeJobsTable = () => {
  Usegetallemployeejobs();

  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((store) => store.auth.token);

  useEffect(() => {
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);

  const deleteJobById = async (jobId) => {
    try {
      console.log("Attempting to delete job with ID:", jobId);
      console.log("Token being used:", token);

      const res = await axios.delete(
        `${USER_API_END_POINT}/api/job/delete/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );

      console.log("Delete Job Response", res);
      if (res.data.status === true) {
        dispatch(deleteJob(jobId));
        toast.success(res.data.message || "Job deleted successfully");
      }
    } catch (error) {
      console.error("Delete Job Error", error);
      toast.error(
        error.response.data.message ||
          `Failed to delete job ${jobId} with error ${error.message}`
      );
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Hiring Multiple</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job.companyname}</TableCell>
              <TableCell>{job.title}</TableCell>
              <TableCell>{job.jobposted.split("T")[0]}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.salary}</TableCell>
              <TableCell className="text-blue-600">
                <Link to={job.website.url} target="_blank">
                  {job.website.url}
                </Link>
              </TableCell>
              <TableCell>{job.hiringmultiple}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/employee/jobdetail/${job._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4 m-1" />
                      <span>View</span>
                    </div>
                    <div
                      className="flex items-center gap-2 w-fit cursor-pointer"
                      onClick={() => deleteJobById(job._id)}
                    >
                      <DeleteIcon className="w-4 m-1" />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeJobsTable;
