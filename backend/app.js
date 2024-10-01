import express, { query } from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import cors from "cors";
import env from "dotenv";
import connectPgSimple from "connect-pg-simple";

const PgSession = connectPgSimple(session);

const port = 3000;
const app = express();
env.config();

app.use(
  cors({
    origin: ["https://secrets-crud-app-hzkt.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// app.use(
//   session({
//     secret: "TOPSECRETWORD",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // Set to true if using HTTPS
//       httpOnly: true, // Helps to mitigate XSS attacks
//       sameSite: "lax", // CSRF protection
//     },
//   })
// );

app.use(
  session({
    store: new PgSession({
      conObject: {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
        ssl: { rejectUnauthorized: false },
      },
    }),
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }, // Set to true in production when using HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // Proceed if the user is authenticated
  }
  res.status(401).json({ message: "Unauthorized" }); // Otherwise, respond with unauthorized
}

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: { rejectUnauthorized: false },
});

db.connect();

app.get("/users", isAuthenticated, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/user/:userId", isAuthenticated, async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/user/stats/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const secretsResult = await db.query(
      "SELECT COUNT(*) AS totalSecrets FROM posts WHERE user_id = $1",
      [userId]
    );
    const totalSecrets = parseInt(secretsResult.rows[0].totalsecrets, 10); //

    const likesResult = await db.query(
      `SELECT COUNT(*) AS totalLikes 
       FROM likes_dislikes 
       WHERE post_id IN (SELECT id FROM posts WHERE user_id = $1) 
       AND like_dislike = 'true'`,
      [userId]
    );
    const totalLikes = parseInt(likesResult.rows[0].totallikes, 10); // Get the count

    // Return the results as a JSON response
    res.status(200).json({
      totalSecrets,
      totalLikes,
    });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.put("/user/:userId/anonymous-name", isAuthenticated, async (req, res) => {
  const userId = req.params.userId;
  const { anonymousName } = req.body;

  try {
    const checkAnonymousNameResult = await db.query(
      "SELECT * FROM users WHERE anonymous_name = $1",
      [anonymousName]
    );
    if (checkAnonymousNameResult.rows.length > 0) {
      return res.status(401).json({ message: "Name already exists" });
    }
    const result = await db.query(
      "UPDATE users SET anonymous_name = $1 WHERE id = $2 RETURNING *",
      [anonymousName, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating anonymous name:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.delete("/delete/:userId", isAuthenticated, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query("DELETE FROM users WHERE id = $1", [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the session or cookie
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not destroy session" });
      }
      res.clearCookie("connect.sid"); // Adjust this according to your session cookie name
      res.status(200).json({ message: "Deleted Successfully" });
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/all-posts/:order", isAuthenticated, async (req, res) => {
  const order = req.params.order;

  try {
    let query;
    if (order === "recent") {
      query =
        "SELECT p.id, p.content, p.created_at, p.user_id, u.anonymous_name FROM posts p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC;";
    } else {
      query =
        "SELECT p.id,p.content,p.created_at, p.user_id,u.anonymous_name,COUNT(CASE WHEN ld.like_dislike = TRUE THEN 1 END) AS likes_count FROM posts p LEFT JOIN likes_dislikes ld ON p.id = ld.post_id LEFT JOIN users u ON p.user_id = u.id GROUP BY p.id, u.anonymous_name ORDER BY likes_count DESC , p.created_at DESC";
    }
    const result = await db.query(query);

    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.post("/post-secret", isAuthenticated, async (req, res) => {
  const content = req.body.content;
  const user_id = req.body.user_id;
  try {
    await db.query("INSERT INTO posts(content, user_id) VALUES($1, $2)", [
      content,
      user_id,
    ]);
    res.status(200).json({ message: "Posted successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/posts/:userId", isAuthenticated, async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await db.query(
      "SELECT p.id, p.content, p.created_at, p.user_id, u.anonymous_name FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE user_id = $1 ORDER BY p.created_at DESC;",
      [userId]
    );
    res.json(result.rows); // Send the posts as JSON
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.get("/posts/:postId/likes_dislikes", async (req, res) => {
  const { postId } = req.params;
  const result = await db.query(
    `
    SELECT
      SUM(CASE WHEN like_dislike THEN 1 ELSE 0 END) AS likes,
      SUM(CASE WHEN like_dislike = false THEN 1 ELSE 0 END) AS dislikes
    FROM likes_dislikes
    WHERE post_id = $1
  `,
    [postId]
  );
  res.status(200).json(result.rows[0]);
});

app.post("/posts/:postId/like_dislike", isAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const { userId, likeDislike } = req.body;

  try {
    const result = await db.query(
      `
    INSERT INTO likes_dislikes (user_id, post_id, like_dislike)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET like_dislike = EXCLUDED.like_dislike
  `,
      [userId, postId, likeDislike]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling like/dislike:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Get user's reaction for a specific post
app.post("/posts/:postId/reaction", isAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const result = await db.query(
    "SELECT like_dislike FROM likes_dislikes WHERE post_id = $1 AND user_id = $2",
    [postId, userId]
  );

  if (result.rows.length > 0) {
    return res.json({ reaction: result.rows[0].like_dislike });
  }
  return res.json({ reaction: null }); // No reaction found
});

app.get("/posts/:postId/comments", isAuthenticated, async (req, res) => {
  const { postId } = req.params;

  try {
    // Query to fetch comments with user info for the given post
    const result = await db.query(
      `SELECT c.id, c.comment_text, c.created_at, u.anonymous_name 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = $1
       ORDER BY c.created_at ASC`, // Order by creation time
      [postId]
    );

    // Send the result as a JSON response
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/posts/:postId/comments", isAuthenticated, async (req, res) => {
  const { postId } = req.params;
  const { comment_text, user_id } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO comments (post_id, user_id, comment_text, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [postId, user_id, comment_text]
    );

    res.status(201).json(result.rows[0]); // Return the newly added comment
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to get total comments for a post
app.get("/posts/:postId/comments/count", isAuthenticated, async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await db.query(
      "SELECT COUNT(*) AS total_comments FROM comments WHERE post_id = $1",
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const totalComments = parseInt(result.rows[0].total_comments, 10);
    res.status(200).json({ totalComments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to bookmark a post
app.post("/bookmarks", isAuthenticated, async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO bookmarks (post_id, user_id) VALUES ($1, $2) RETURNING *",
      [postId, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to check if a post is bookmarked by the user
app.get("/bookmarks/:postId/:userId", isAuthenticated, async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM bookmarks WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );

    res.status(200).json({
      isBookmarked: result.rows.length > 0, // True if bookmark exists
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to remove a bookmark
app.delete("/bookmarks/:postId/:userId", isAuthenticated, async (req, res) => {
  const { postId, userId } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM bookmarks WHERE post_id = $1 AND user_id = $2 RETURNING *",
      [postId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to get total bookmarks for a post
app.get("/posts/:postId/bookmarks/count", isAuthenticated, async (req, res) => {
  const { postId } = req.params;

  try {
    const result = await db.query(
      "SELECT COUNT(*) AS total_bookmarks FROM bookmarks WHERE post_id = $1",
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const totalBookmarks = parseInt(result.rows[0].total_bookmarks, 10);
    res.status(200).json({ totalBookmarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to get all bookmarks of a user
app.get("/users/:userId/bookmarks", isAuthenticated, async (req, res) => {
  const { userId } = req.params;

  try {
    const bookmarks = await db.query(
      `SELECT posts.id, posts.content, posts.created_at, users.anonymous_name FROM bookmarks JOIN posts ON bookmarks.post_id = posts.id JOIN users ON posts.user_id = users.id WHERE bookmarks.user_id = $1`,
      [userId]
    );
    res.json(bookmarks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching bookmarks" });
  }
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const anonymousName = req.body.anonymousName;
  try {
    const checkUsernameResult = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (checkUsernameResult.rows.length > 0) {
      return res
        .status(401)
        .json({ message: "Email already exists. Try logging in." });
    }
    const checkAnonymousNameResult = await db.query(
      "SELECT * FROM users WHERE anonymous_name = $1",
      [anonymousName]
    );
    if (checkAnonymousNameResult.rows.length > 0) {
      return res.status(401).json({ message: "Name already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users (username, password, anonymous_name) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, anonymousName]
    );
    const user = newUser.rows[0];

    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Login failed after registration." });
      }
      return res
        .status(200)
        .json({ message: "User registered successfully!", user });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// app.post("/login", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   try {
//     const result = await db.query("SELECT * FROM users WHERE username = $1", [
//       username,
//     ]);
//     if (result.rows.length > 0) {
//       const user = result.rows[0];
//       const storedHashedPassword = user.password;

//       bcrypt.compare(password, storedHashedPassword, (err, result) => {
//         if (err) {
//           console.error("Error comparing password:", err);
//         } else {
//           if (result) {
//             res.send("Login successful");
//           } else {
//             res.send("Incorrect password");
//           }
//         }
//       });
//     } else {
//       res.send("User not found");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

app.post("/login", (req, res, next) => {
  // console.log(req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

app.post("/logout", isAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not destroy session" });
      }
      res.clearCookie("connect.sid"); // Adjust this according to your session cookie name
      res.status(200).json({ message: "Logout Successfully" });
    });
  });
});

passport.use(
  new Strategy(async function verify(username, password, done) {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [
        username,
      ]);

      if (result.rows.length === 0) {
        // User not found
        return done(null, false, { message: "User not found" });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password); // Use await for better readability

      if (isMatch) {
        // Authentication successful
        return done(null, user);
      } else {
        // Password mismatch
        return done(null, false, { message: "Invalid password" });
      }
    } catch (error) {
      // Handle error
      console.error("Error during authentication:", error);
      return done(error);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id); // Store the user ID in the session
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      cb(null, result.rows[0]); // Retrieve the full user object
    } else {
      cb("User not found");
    }
  } catch (err) {
    cb(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
