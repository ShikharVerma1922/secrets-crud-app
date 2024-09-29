import React, { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import {
  Card,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
} from "react-bootstrap"; // Import necessary Bootstrap components
import LikeDislikeButton from "./LikeDislikeButton";
import CommentsButton from "./Comments";
import BookmarkButton from "./BookmarkButton";

const UserPosts = ({ newPost, allPost }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const [likesCount, setLikesCount] = useState({});
  const [commentsCount, setCommentsCount] = useState({});
  const [bookmarksCount, setBookmarksCount] = useState({});
  const [sortOrder, setSortOrder] = useState("recent");

  // Callback to update likes count from LikeDislikeButton
  const handleLikesUpdate = (postId, likes) => {
    setLikesCount((prev) => ({ ...prev, [postId]: likes }));
  };
  const handleCommentsUpdate = (postId, comments) => {
    setCommentsCount((prev) => ({ ...prev, [postId]: comments }));
  };
  const handleBookmarksUpdate = (postId, bookmarks) => {
    setBookmarksCount((prev) => ({ ...prev, [postId]: bookmarks }));
  };

  const getShortTimeAgo = (date) => {
    const distance = formatDistanceToNowStrict(new Date(date), {
      addSuffix: true,
    });

    if (distance.includes("minute")) {
      return `${distance.replace(" minutes", "m")}`;
    } else if (distance.includes("hour")) {
      return `${distance.replace(" hours", "h")}`;
    } else if (distance.includes("day")) {
      return `${distance.replace(" days", "d")}`;
    } else if (distance.includes("month")) {
      return `${distance.replace(" months", "mo")}`;
    } else if (distance.includes("year")) {
      return `${distance.replace(" years", "y")}`;
    }
    return distance;
  };

  useEffect(() => {
    // Initialize likesCount with initial values from posts
    const initialLikesCount = {};
    posts.forEach((post) => {
      initialLikesCount[post.id] = 0; // Set default likes count to 0
    });
    setLikesCount(initialLikesCount);
  }, []);

  useEffect(() => {
    const fetchPosts = async (order) => {
      try {
        const response = await fetch(
          allPost
            ? `https://secrets-server-fgfd.onrender.com/all-posts/${order}`
            : `https://secrets-server-fgfd.onrender.com/posts/${userId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data); // Set the fetched posts in state
      } catch (err) {
        console.error(err);
        setError(err.message); // Handle errors
      }
    };

    fetchPosts(sortOrder);
  }, [userId, newPost, sortOrder]);

  const handleSelect = (eventKey) => {
    setSortOrder(eventKey);
  };

  return (
    <Container className="post-tile-width">
      {error && <div className="alert alert-danger">{error}</div>}
      {!allPost && <h3>Your Posts</h3>}
      {allPost && (
        <div>
          <DropdownButton
            id="dropdown-basic-button"
            variant="outline-secondary"
            title={`Sort by: ${
              sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)
            }`}
            onSelect={handleSelect}
            className="mb-3"
          >
            <Dropdown.Item eventKey="recent">Recent</Dropdown.Item>
            <Dropdown.Item eventKey="top">Top</Dropdown.Item>
          </DropdownButton>
        </div>
      )}
      <Row>
        {posts.length === 0 ? (
          <div style={{}}>
            <p style={{ fontSize: "20px" }}>No posts found.</p>
            <p style={{ fontSize: "30px", textAlign: "center", color: "gray" }}>
              Start with Sharing a Secret
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Col key={post.id} md={12} className="mb-4">
              <Card>
                <Card.Header
                  className="text-muted d-flex justify-content-between"
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  <div className="d-flex justify-content-start gap-1 text-muted">
                    <small>@{post.anonymous_name}</small> <br />
                    <small>•</small>
                    <small>{getShortTimeAgo(post.created_at)}</small>
                  </div>
                  <span>
                    {new Date(post.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </Card.Header>
                <Card.Body>
                  <Card.Text style={{ whiteSpace: "pre-wrap" }}>
                    {post.content}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">
                      🗣️ {likesCount[post.id] || 0} whispers
                    </span>
                    <div className="d-flex gap-1">
                      <span className="text-muted">
                        {commentsCount[post.id] || 0} comments
                      </span>
                      <span>·</span>
                      <span className="text-muted">
                        {bookmarksCount[post.id] || 0} saved
                      </span>
                    </div>
                  </div>
                  <Card.Footer
                    className="text-muted d-flex justify-content-around pb-0 px-0"
                    style={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <LikeDislikeButton
                      postId={post.id}
                      onLikesUpdated={(likes) =>
                        handleLikesUpdate(post.id, likes)
                      }
                    />

                    <CommentsButton
                      post={post}
                      onCommentsUpdated={(comments) =>
                        handleCommentsUpdate(post.id, comments)
                      }
                    />
                    <BookmarkButton
                      postId={post.id}
                      onBookmarksUpdated={(bookmarks) =>
                        handleBookmarksUpdate(post.id, bookmarks)
                      }
                    />
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default UserPosts;
