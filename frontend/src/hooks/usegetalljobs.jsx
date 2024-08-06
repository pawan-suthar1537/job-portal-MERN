import { setAllJobs } from "@/redux/jobSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchQueries } = useSelector((store) => store.job); // Assuming `searchQueries` is an array of search options

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        let url = `${USER_API_END_POINT}/api/job/getall`;
        const params = new URLSearchParams();

        if (Array.isArray(searchQueries)) {
          searchQueries.forEach((query) => {
            if (query.enabled) {
              params.append(query.key, query.value);
            }
          });
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await axios.get(url, { withCredentials: true });

        if (res.data.status === "success") {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        dispatch(setAllJobs([]));
        console.error("Error fetching jobs:", error);
      }
    };

    fetchAllJobs();
  }, [searchQueries, dispatch]);
};

export default useGetAllJobs;
