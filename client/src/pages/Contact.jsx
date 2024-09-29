import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import Footer from "../components/Footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real application, form data would be sent to the server here.
    setSubmitted(true);
  };

  return (
    <div id="root">
      <main>
        <Container className="mt-5">
          <Card className="shadow p-4" style={{ backgroundColor: "#f9f9f9" }}>
            <Card.Body className="d-flex flex-column align-items-center">
              <h1
                className="text-center mb-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Contact Us
              </h1>
              {submitted ? (
                <p
                  className="text-center"
                  style={{ fontSize: "18px", fontFamily: "Arial, sans-serif" }}
                >
                  Thank you for reaching out! We’ll get back to you as soon as
                  possible.
                </p>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="name"
                      value={name}
                      placeholder="Your Name"
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control
                      type="email"
                      id="email"
                      value={email}
                      placeholder="your-email@example.com"
                      className="form-control"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="message">Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      id="message"
                      rows={5}
                      value={message}
                      placeholder="Write your message here..."
                      className="form-control"
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        backgroundColor: "#007BFF",
                        borderColor: "#007BFF",
                      }}
                    >
                      Send Message
                    </Button>
                  </div>
                </Form>
              )}

              <p
                className="text-center mt-4"
                style={{ fontSize: "16px", fontFamily: "Arial, sans-serif" }}
              >
                Or contact us at <strong>support@secretsapp.com</strong>
              </p>
            </Card.Body>
          </Card>
        </Container>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Contact;
