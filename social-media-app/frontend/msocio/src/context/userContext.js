import axios from "axios";

export const handleUserLike = async ({ postId, setPosts }) => {
    try {
        const response = await fetch(`http://localhost:8000/api/add-user-like/${postId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        // console.log("Like response:", data);

        if (!response.ok) {
            throw new Error(data.error || "Failed to like post");
        }

        // ✅ Update only the liked post
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === postId ? { ...post, like_count: data.like_count } : post
            )
        );

        return data;
    } catch (error) {
        console.error("Error liking post:", error);
    }
};


export const getUserPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated!");
      return;
    }
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/user-posts/",
        {
          headers: {
            Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
          },
        }
      );
      return response.data.posts; // Assuming setPosts is defined in your component
    } catch (error) {
      console.error(
        "Error fetching user posts:",
        error.response?.data || error.message
      );
    }
  };
