import { useState } from "react";
import axiosInstance from "../../Utils/AxiosConfig";

const useSearch = () => {
  const [searchResults, setSearchResults] = useState([]);

  const searchUsers = async (keyword) => {
    if (!keyword?.trim()) { setSearchResults([]); return; }
    try {
      const { data } = await axiosInstance.get(`/user/all?search=${keyword}`);
      setSearchResults(data);
    } catch (error) {
      console.error("searchUsers:", error?.response?.data?.message);
    }
  };

  return {
    searchResults,
    setSearchResults,
    searchUsers,
  };
};

export default useSearch;