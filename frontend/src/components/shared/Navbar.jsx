import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "sonner";
import { setUser, setAuth, setToken } from "@/redux/authSlice";

const Navbar = () => {
  const user = useSelector((store) => store.auth.user);
  const auth = useSelector((store) => store.auth.auth);
  const token = useSelector((store) => store.auth.token);
  // console.log({
  //   user,
  //   auth,
  //   token,
  // });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      dispatch(setUser(null));
      dispatch(setAuth(false));
      dispatch(setToken(null));
      toast.success("Logout Successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <Link to="/">
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </Link>
        <div className="flex items-center gap-5">
          <ul className="flex font-medium items-center gap-5 ">
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="/jobs">
              <li>Jobs</li>
            </Link>
            <Link to="/applications">
              <li>Applications</li>
            </Link>
          </ul>
          {!user ? (
            <div className="flex items-center gap-5">
              <Link to="/login">
                <Button variant={"outline"}>login</Button>
              </Link>
              <Link to="/signup">
                <Button variant={"outline"}>Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>

                  <div>
                    <h4 className="font-medium">hello</h4>
                    <p className="text-sm text-muted-foreground"></p>
                  </div>
                </div>
                <div className="flex flex-col items-start text-gray-600">
                  <Link to="/profile">
                    <Button variant="link">Profile</Button>
                  </Link>
                  <Button variant="link" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
