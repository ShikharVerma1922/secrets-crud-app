import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import { FaRegBookmark, FaBookmark } from "react-icons/fa";

const BookmarkButton = ({ postId, onBookmarksUpdated }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const userId = localStorage.getItem("userId");

  const checkIfBookmarked = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookmarks/${postId}/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookmark status");
      }

      const data = await response.json();
      setIsBookmarked(data.isBookmarked); // Set bookmark status based on fetched data
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookmarkCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${postId}/bookmarks/count`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookmark count");
      }

      const data = await response.json();
      onBookmarksUpdated(data.totalBookmarks);
    } catch (err) {
      console.error(err);
      setError("Error fetching bookmark count");
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await fetch("http://localhost:3000/bookmarks", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: localStorage.getItem("userId"), // Assuming userId is stored in localStorage
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to bookmark the post");
      }

      setIsBookmarked(true); // Set the bookmark state to true
      fetchBookmarkCount();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBookmark = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/bookmarks/${postId}/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove bookmark");
      }

      setIsBookmarked(false); // Update the state to reflect the removal
      fetchBookmarkCount();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkIfBookmarked();
    fetchBookmarkCount();
  }, [postId]);

  return (
    <button
      onClick={isBookmarked ? handleRemoveBookmark : handleBookmark}
      className="border-0 rounded-pill like_dislike"
      style={{ backgroundColor: "transparent" }}
    >
      {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
    </button>
  );
};

export default BookmarkButton;
