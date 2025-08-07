import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import ServiceCard from "../components/SeviceCard";
import {
  FaFilePdf,
  FaHandHoldingUsd,
  FaComments,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BurgerMenu from "../components/BurgerMenu";
import CitizenAddressMap from "../components/CitizenAddressMap";
import { useAuth } from "../context/AuthContext";
import "./CitizenDashboard.css";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });

  // Get citizenId from auth context instead of localStorage
  const citizenId = user?.id;

  const services = [
    {
      title: "Birth Certificate",
      icon: <FaFilePdf />,
      action: () => navigate("/birth-certificate"),
      description: "Request birth certificate",
    },
    {
      title: "Subsidies Management",
      icon: <FaHandHoldingUsd />,
      action: () => navigate("/subventions"),
      description: "Apply for subsidies",
    },
    {
      title: "Meetings or Services",
      icon: <FaComments />,
      action: () => navigate("/meeting-request"),
      description: "Schedule meetings",
    },
    {
      title: "Event Permission Requests",
      icon: <FaCalendarAlt />,
      action: () => navigate("/event-request"),
      description: "Request event permissions",
    },
  ];

  // Simulate loading stats (you can replace this with actual API calls)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalRequests: 12,
        pendingRequests: 3,
        approvedRequests: 8,
        rejectedRequests: 1,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div
        className="citizen-dashboard-modern d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="citizen-dashboard-modern">
      {/* Modern Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h2>Welcome back, {user?.firstName || "Citizen"}!</h2>
            <p className="mb-0 opacity-75">Access your municipal services</p>
          </div>
          <div className="header-right">
            <BurgerMenu />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-section mb-4">
        <Row className="g-3">
          <Col md={3} sm={6} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon total-icon">
                  <FaUser />
                </div>
                <h3 className="stats-number">{stats.totalRequests}</h3>
                <p className="stats-label">Total Requests</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon pending-icon">
                  <FaClock />
                </div>
                <h3 className="stats-number">{stats.pendingRequests}</h3>
                <p className="stats-label">Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon approved-icon">
                  <FaCheckCircle />
                </div>
                <h3 className="stats-number">{stats.approvedRequests}</h3>
                <p className="stats-label">Approved</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} sm={6} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon rejected-icon">
                  <FaTimesCircle />
                </div>
                <h3 className="stats-number">{stats.rejectedRequests}</h3>
                <p className="stats-label">Rejected</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content Card */}
      <div className="dashboard-content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="section-title">Available Services</h3>
        </div>

        <Row className="g-4 mb-4">
          {services.map((service, index) => (
            <Col key={index} xs={12} sm={6} md={3}>
              <ServiceCard
                title={service.title}
                icon={service.icon}
                description={service.description}
                onClick={service.action}
              />
            </Col>
          ))}
        </Row>

        {/* Map Section */}
        <div className="map-section">
          <h3 className="section-title mb-3">Add your Location</h3>
          <Card className="map-card">
            <Card.Body className="p-0">
              <CitizenAddressMap citizenId={citizenId} />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
