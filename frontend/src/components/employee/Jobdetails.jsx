import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Navbar from "../shared/Navbar";
import { Badge } from "../ui/badge";

const Jobdetails = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const token = useSelector((store) => store.auth.token);
  console.log("User from job description", user, token);

  const [isApplied, setIsApplied] = useState(false);

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverletter: "",
  });

  const params = useParams();
  const jobId = params.id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSingleJob = async () => {
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/api/job/getjob/${jobId}`
      );
      console.log("Single Job res", res);
      setSingleJob(res.data.job);
      dispatch(setSingleJob(res.data.job));
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      // Handle file inputs separately
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: files[0],
      }));
    } else {
      // Handle text inputs
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  console.log("User Details", userDetails);

  const applyJobHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in userDetails) {
      formData.append(key, userDetails[key]);
    }

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/api/application/post/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status === "success") {
        setIsApplied(true);

        toast.success(res.data.message);
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    fetchSingleJob();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 flex lg:flex-row gap-10">
        <div className="w-1/2 pr-4">
          <div>
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex items-center gap-2 mt-4">
              <Badge className={"text-blue-700 font-bold"} variant="ghost">
                {singleJob?.jobniches}
              </Badge>
              <Badge className={"text-[#F83002] font-bold"} variant="ghost">
                {singleJob?.jobtype}
              </Badge>
              <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
                {singleJob?.salary}Rs
              </Badge>
            </div>
          </div>
          <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
            Job Description
          </h1>
          <div className="my-4">
            <h1 className="font-bold my-1">
              Role:{" "}
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.title}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Location:{" "}
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.location}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Jobtype:{" "}
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.jobtype}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Description:{" "}
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.introduction}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Qualification required:{" "}
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.qualification} yrs
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Responsibility:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.responsibility} yrs
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Offers:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.offers} yrs
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Hiring multiple:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.hiringmultiple}
              </span>
            </h1>
            <h1 className="font-bold my-1">
              Salary:{" "}
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.salary}Rs
              </span>
            </h1>
            <div>
              <span className="font-bold my-1">Website</span>:
              {singleJob?.website?.url && (
                <a
                  href={singleJob?.website?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {singleJob?.website?.url}
                </a>
              )}
            </div>

            <h1 className="font-bold my-1">
              Posted Date:
              <span className="pl-4 font-normal text-gray-800">
                {singleJob?.jobposted.split("T")[0]}
              </span>
            </h1>
          </div>
        </div>
        <div className="w-1/2 pl- mt-[50px]">
          {user?.role === "jobseeker" && !isApplied && (
            <form onSubmit={applyJobHandler} className="flex flex-col gap-5">
              <Input
                name="name"
                type="text"
                placeholder="Name"
                value={userDetails.name}
                onChange={handleChange}
                required
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={userDetails.email}
                onChange={handleChange}
                required
              />
              <Input
                name="phone"
                type="text"
                placeholder="Phone"
                value={userDetails.phone}
                onChange={handleChange}
                required
              />
              <Input
                name="address"
                type="text"
                placeholder="Address"
                value={userDetails.address}
                onChange={handleChange}
                required
              />
              <Textarea
                name="coverletter"
                placeholder="Cover Letter"
                value={userDetails.coverletter}
                onChange={handleChange}
                required
              />
              {user?.resume && user?.resume.length > 0 && (
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    name="resume"
                    id="resume"
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
              <Button
                type="submit"
                className="rounded-lg mt-5 bg-[#7209b7] hover:bg-[#5f32ad]"
              >
                Apply Now
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobdetails;
