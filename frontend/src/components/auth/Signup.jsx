import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const Signup = () => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
    first: "",
    second: "",
    third: "",
    coverletter: "",
  });
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, resume: e.target.files?.[0] });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      formData.append(key, input[key]);
    });

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/api/user/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log("res", res);
      if (res.data.success == true) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>

          <div className="my-2">
            <Label>Name</Label>
            <Input
              type="text"
              value={input.name}
              name="name"
              onChange={changeEventHandler}
              placeholder="name"
            />
          </div>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="patel@gmail.com"
            />
          </div>
          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={input.phone}
              name="phone"
              onChange={changeEventHandler}
              placeholder="8080808080"
            />
          </div>
          <div className="my-2">
            <Label>Address</Label>
            <Input
              type="text"
              value={input.address}
              name="address"
              onChange={changeEventHandler}
              placeholder="bikaner"
            />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="78787878778"
            />
          </div>
          <div className="my-2">
            <Label>Role</Label>
            <Select
              onValueChange={(value) => setInput({ ...input, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jobseeker">Job Seeker</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {input.role === "jobseeker" && (
            <div>
              <div className="my-2">
                <Label>First Niche</Label>
                <Input
                  type="text"
                  value={input.first}
                  name="first"
                  onChange={changeEventHandler}
                  placeholder="Fullstack"
                />
              </div>
              <div className="my-2">
                <Label>Second Niche</Label>
                <Input
                  type="text"
                  value={input.second}
                  name="second"
                  onChange={changeEventHandler}
                  placeholder="SDE"
                />
              </div>
              <div className="my-2">
                <Label>Third Niche</Label>
                <Input
                  type="text"
                  value={input.third}
                  name="third"
                  onChange={changeEventHandler}
                  placeholder="MERN"
                />
              </div>
              <div className="my-2">
                <Label>Cover Letter</Label>
                <textarea
                  name="coverletter"
                  value={input.coverletter}
                  onChange={changeEventHandler}
                  placeholder="Cover letter"
                  className="w-full h-40 rounded-md border border-gray-200 focus:border-gray-400 focus:ring-0 focus:outline-none focus:ring-offset-0"
                ></textarea>
              </div>
              <div className="my-2">
                <Label>Upload Resume</Label>
                <Input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={changeFileHandler}
                />
              </div>
            </div>
          )}

          <div className="my-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Signup"}
            </Button>
          </div>
          <p className="text-center">
            Already have an account?{" "}
            <Link className="text-blue-700" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
