import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./HomePage.css"; // Custom styles

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="overlay">
        <Container className="min-vh-100 d-flex flex-column justify-content-center align-items-center">
          <h1 className="text-white text-center mb-5 display-4 fw-bold">
            Welcome to the E-Municipal
          </h1>

          <Row className="w-100 justify-content-center">
            <Col xs={10} sm={8} md={6} lg={4} className="mb-4">
              <Card className="text-center custom-card enlarged-card">
                <Card.Body>
                  <Card.Title className="fs-4 mb-4">
                    Officer Log In Page
                  </Card.Title>
                  <Card.Text>Click here to log in as an officer!</Card.Text>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={() => navigate("/officer-login")}
                  >
                    Go
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={10} sm={8} md={6} lg={4} className="mb-4">
              <Card className="text-center custom-card enlarged-card">
                <Card.Body>
                  <Card.Title className="fs-4 mb-4">
                    Citizen Log In Page
                  </Card.Title>
                  <Card.Text>Click here to log in as a citizen!</Card.Text>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={() => navigate("/citizen-login")}
                  >
                    Go
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={10} sm={8} md={6} lg={4}>
              <Card className="text-center custom-card enlarged-card">
                <Card.Body>
                  <Card.Title className="fs-4 mb-4">
                    Citizen Sign Up Page
                  </Card.Title>
                  <Card.Text>Dont have an account? Sign Up here!</Card.Text>
                  <Button
                    variant="warning"
                    className="w-100"
                    onClick={() => navigate("/citizen-signup")}
                  >
                    Go
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
