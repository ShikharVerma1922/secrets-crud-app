import React from "react";
import { Container, Card } from "react-bootstrap"; // Assuming you're using react-bootstrap for styling
import Footer from "../components/Footer";

const About = () => {
  return (
    <div>
      <Container style={{ marginTop: "60px" }}>
        <Card className="shadow p-4" style={{ backgroundColor: "#f9f9f9" }}>
          <Card.Body>
            <h1
              className="text-center mb-4"
              style={{ fontFamily: "Georgia, serif" }}
            >
              About Secrets
            </h1>
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Welcome to <strong>Secrets</strong>, a platform where you can
              share your deepest thoughts and feelings anonymously. In a world
              full of social pressures, we believe that everyone deserves a
              space to express themselves without fear of judgment or
              consequences.
            </p>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                fontFamily: "Arial, sans-serif",
              }}
            >
              At Secrets, your identity is safe. We encourage open and honest
              conversations where you can be heard without revealing who you
              are. Share your experiences, vent your frustrations, or just speak
              your mind—all while maintaining complete anonymity.
            </p>

            <h3 className="mt-4" style={{ fontFamily: "Georgia, serif" }}>
              Our Mission
            </h3>
            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
              To provide a safe and private place where people can be truly
              authentic and share what's on their minds without any filters.
            </p>

            <h3 className="mt-4" style={{ fontFamily: "Georgia, serif" }}>
              How It Works
            </h3>
            <ul
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <li>
                <strong>Create an Account</strong>: All you need is a username
                and password. No need to share any personal details!
              </li>
              <li>
                <strong>Post Anonymously</strong>: Write down your thoughts or
                secrets without worrying about being recognized.
              </li>
              <li>
                <strong>Interact</strong>: Whisper (like), dislike, comment or
                bookmark a post to engage with the community without ever
                revealing yourself.
              </li>
            </ul>

            <h3 className="mt-4" style={{ fontFamily: "Georgia, serif" }}>
              Our Values
            </h3>
            <ul
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <li>
                <strong>Privacy</strong>: We value your anonymity above all.
                Your posts are yours, and no one will know who wrote them.
              </li>
              <li>
                <strong>Respect</strong>: Although anonymous, we ask all users
                to be respectful of others' thoughts and experiences.
              </li>
              <li>
                <strong>Community</strong>: While anonymous, our users are part
                of a larger, compassionate community. Your words could help
                someone feel less alone.
              </li>
            </ul>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Remember: <strong>No personal information</strong> should ever be
              shared in your posts, including names, contact info, or sensitive
              details.
            </p>

            <p
              className="mt-4 text-center"
              style={{ fontStyle: "italic", fontSize: "18px" }}
            >
              Thank you for being part of the <strong>Secrets</strong> family,
              where everyone has a voice, and every secret is safe.
            </p>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
};

export default About;
