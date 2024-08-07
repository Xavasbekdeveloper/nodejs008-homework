import React from "react";
import { useGetProfileQuery } from "../../context/api/userApi";

const Profile = () => {
  const { data } = useGetProfileQuery();

  console.log(data);

  return <div>Profile</div>;
};

export default Profile;
