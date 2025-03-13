import { useAuth } from "@/context/AuthContext";
import React, { useEffect } from "react";
import PostCard from "../feeds/Posts/PostCard";

const MyPosts = () => {
    const {posts} = useAuth();
    useEffect(() => {

    }, [posts]);
  return (
    <div>
      <PostCard />
    </div>
  );
};

export default MyPosts;
