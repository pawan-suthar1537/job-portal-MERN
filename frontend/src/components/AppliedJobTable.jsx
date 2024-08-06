import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Posted by</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                You haven't applied to any job yet.
              </TableCell>
            </TableRow>
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob?._id}>
                <Link to={`/description/${appliedJob?.jobinfo?.jobid?._id}`}>
                  <TableCell className="text-nowrap">
                    {appliedJob?.createdAt?.split("T")[0]}
                  </TableCell>
                </Link>
                <TableCell className="text-nowrap">
                  {appliedJob.jobinfo?.jobtitle}
                </TableCell>
                <TableCell className="text-nowrap">
                  {appliedJob.jobinfo?.companyname}
                </TableCell>
                <TableCell className="text-right"></TableCell>
                <TableCell>{appliedJob.employeeinfo?.name}</TableCell>
                <TableCell>{appliedJob.employeeinfo?.email}</TableCell>
                <TableCell>{appliedJob.employeeinfo?.phone}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
