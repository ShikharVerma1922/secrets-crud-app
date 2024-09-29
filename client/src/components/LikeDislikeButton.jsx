import React, { useState, useEffect } from "react";
import { AiFillDislike, AiOutlineDislike } from "react-icons/ai";
import { RiSpeakFill, RiSpeakLine } from "react-icons/ri";

const LikeDislikeButton = ({ postId, onLikesUpdated }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const userId = localStorage.getItem("userId");

  // Fetch likes/dislikes data for the post
  const fetchLikesDislikes = async () => {
    const response = await fetch(
      `http://localhost:3000/posts/${postId}/likes_dislikes`
    );
    const data = await response.json();
    setLikes(data.likes);
    onLikesUpdated(data.likes);
    setDislikes(data.dislikes);
  };

  // Fetch user's reaction on mount
  const fetchUserReaction = async () => {
    const response = await fetch(
      `http://localhost:3000/posts/${postId}/reaction`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        credentials: "include",
      }
    );
    const data = await response.json();

    setUserReaction(
      data.reaction === true
        ? "like"
        : data.reaction === false
        ? "dislike"
        : null
    );
  };

  // Handle like or dislike click
  const handleReaction = async (reaction) => {
    const likeDislike = reaction === "like"; // true for like, false for dislike

    try {
      const response = await fetch(
        `http://localhost:3000/posts/${postId}/like_dislike`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ userId, likeDislike }),
        }
      );
      if (!response.ok) {
        const errorText = await response.json();
        console.error("Failed to post like/dislike. Response:", errorText);
        throw new Error("Failed to post like/dislike");
      }
      setUserReaction(reaction);
      fetchLikesDislikes();
    } catch (error) {
      console.error("Error during like/dislike submission:", error);
      // Handle errors (e.g., show a message to the user)
    }
  };

  useEffect(() => {
    fetchLikesDislikes();
    fetchUserReaction();
  }, [postId]);

  return (
    <div
      className="rounded-pill p-1 d-flex"
      style={{ width: "fit-content", backgroundColor: "transparent" }}
    >
      <button
        onClick={() => handleReaction("like")}
        style={{
          color: userReaction === "like" ? "black" : "gray",
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <div className="d-flex gap-1 align-items-center fw-bold border-end pe-1 like_dislike">
          <span style={{ fontSize: "20px" }}>
            {userReaction === "like" ? <RiSpeakFill /> : <RiSpeakLine />}
          </span>

          <span>Whisper</span>
        </div>
      </button>
      <button
        onClick={() => handleReaction("dislike")}
        style={{
          color: userReaction === "dislike" ? "black" : "gray",
          border: "none",
          backgroundColor: "transparent",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        <div className="like_dislike">
          {userReaction === "dislike" ? (
            <AiFillDislike />
          ) : (
            <AiOutlineDislike />
          )}
        </div>
      </button>
    </div>
  );
};

export default LikeDislikeButton;
