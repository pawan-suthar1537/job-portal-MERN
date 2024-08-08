import { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const hiringarray = ["Yes", "No"];
const jobtype = ["fulltime", "parttime", "internship"];

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    jobtype: "",
    location: "",
    requirements: "",
    companyname: "",
    introduction: "",
    responsibility: "",
    qualification: "",
    offers: "",
    salary: "",
    hiringmultiple: "",
    websiteurl: "",
    websitetitle: "",
    jobniches: "",
    newsletter: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectHiringMultipleHandler = (value) => {
    setInput({ ...input, hiringmultiple: value });
  };
  const selecthingjobtype = (value) => {
    setInput({ ...input, jobtype: value });
  };

  const toggleNewsletterHandler = (e) => {
    setInput({ ...input, newsletter: e.target.checked });
  };

  const token = useSelector((store) => store.auth.token);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/api/job/postjob`,
        input,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      if (res.data.status === "success") {
        toast.success(res.data.message);
        navigate("/employee/alljobs");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setInput({
        title: "",
        jobtype: "",
        location: "",
        requirements: "",
        companyname: "",
        introduction: "",
        responsibility: "",
        qualification: "",
        offers: "",
        salary: "",
        hiringmultiple: "",
        websiteurl: "",
        websitetitle: "",
        jobniches: "",
        newsletter: false,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 w-full max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Select onValueChange={selecthingjobtype}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {jobtype.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="companyname"
                value={input.companyname}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Introduction</Label>
              <Input
                type="text"
                name="introduction"
                value={input.introduction}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Responsibility</Label>
              <Input
                type="text"
                name="responsibility"
                value={input.responsibility}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Qualification</Label>
              <Input
                type="text"
                name="qualification"
                value={input.qualification}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Offers</Label>
              <Input
                type="text"
                name="offers"
                value={input.offers}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Website URL</Label>
              <Input
                type="text"
                name="websiteurl"
                value={input.websiteurl}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Website Title</Label>
              <Input
                type="text"
                name="websitetitle"
                value={input.websitetitle}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Job Niches</Label>
              <Input
                type="text"
                name="jobniches"
                value={input.jobniches}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Hiring Multiple</Label>
              <Select onValueChange={selectHiringMultipleHandler}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Hiring Multiple" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {hiringarray.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mr-10 ">Newsletter</Label>
              <input
                type="checkbox"
                name="newsletter"
                checked={input.newsletter}
                onChange={toggleNewsletterHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Job
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
