import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import {
  FaUserCircle,
  FaHandHoldingUsd,
  FaComments,
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import EventRequestModal from "../components/Modals/EventRequestModal";
import SubventionRequestsModal from "../components/Modals/SubventionRequestsModal";
import MeetingRequestsModal from "../components/Modals/MeetingRequestModal";
import LogoutButton from "../components/LogoutButton";
import "./OfficerDashboard.css";

const API_BASE_URL = "https://localhost:7060/api";

const OfficerDashboard = () => {
  const [showSubventionModal, setShowSubventionModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [officerInfo, setOfficerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [subventionRequests, setSubventionRequests] = useState([]);
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [eventRequests, setEventRequests] = useState([]);

  // Calculate statistics
  const stats = {
    totalRequests:
      subventionRequests.length + meetingRequests.length + eventRequests.length,
    pendingRequests: [
      ...subventionRequests.filter((req) => req.status === "Pending"),
      ...meetingRequests.filter((req) => req.status === "Pending"),
      ...eventRequests.filter((req) => req.status === "Pending"),
    ].length,
    approvedRequests: [
      ...subventionRequests.filter((req) => req.status === "Approved"),
      ...meetingRequests.filter((req) => req.status === "Approved"),
      ...eventRequests.filter((req) => req.status === "Approved"),
    ].length,
    rejectedRequests: [
      ...subventionRequests.filter((req) => req.status === "Rejected"),
      ...meetingRequests.filter((req) => req.status === "Rejected"),
      ...eventRequests.filter((req) => req.status === "Rejected"),
    ].length,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setOfficerInfo(decoded);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Fetch all data in parallel
        Promise.all([
          axios.get(`${API_BASE_URL}/Subvention`, config),
          axios.get(`${API_BASE_URL}/MeetingRequest/my`, config),
          axios.get(`${API_BASE_URL}/OrganizingRequest`, config),
        ])
          .then(([subventionsRes, meetingsRes, eventsRes]) => {
            setSubventionRequests(subventionsRes.data);
            setMeetingRequests(meetingsRes.data);
            setEventRequests(eventsRes.data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error fetching data", err);
            setLoading(false);
          });
      } catch (error) {
        console.error("Invalid token", error);
        setLoading(false);
      }
    }
  }, []);

  const updateRequestStatus = (id, status) => {
    setSubventionRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const updateMeetingStatus = (id, status) => {
    setMeetingRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const updateEventStatus = (id, status) => {
    setEventRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  if (loading) {
    return (
      <div
        className="officer-dashboard-modern d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="officer-dashboard-modern">
      {/* Modern Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h2>Welcome back, Officer!</h2>
            <p className="mb-0 opacity-75">
              Manage citizen requests and services
            </p>
          </div>
          <div className="header-right">
            <LogoutButton />
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
                  <FaClipboardList />
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
          <h3 className="section-title">Request Management</h3>
        </div>

        <Row className="g-4">
          <Col md={4}>
            <Card className="service-card">
              <Card.Body className="text-center">
                <div className="service-icon">
                  <FaHandHoldingUsd />
                </div>
                <Card.Title>Subvention Requests</Card.Title>
                <Card.Text>
                  View and manage citizen subvention funding requests.
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => setShowSubventionModal(true)}
                  className="modern-btn"
                >
                  Manage Requests
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="service-card">
              <Card.Body className="text-center">
                <div className="service-icon">
                  <FaComments />
                </div>
                <Card.Title>Meeting Requests</Card.Title>
                <Card.Text>View and manage citizen meeting requests.</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => setShowMeetingModal(true)}
                  className="modern-btn"
                >
                  Manage Requests
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="service-card">
              <Card.Body className="text-center">
                <div className="service-icon">
                  <FaCalendarAlt />
                </div>
                <Card.Title>Event Requests</Card.Title>
                <Card.Text>
                  View and manage citizen event participation or organization
                  requests.
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => setShowEventModal(true)}
                  className="modern-btn"
                >
                  Manage Requests
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modals */}
      <SubventionRequestsModal
        show={showSubventionModal}
        onHide={() => setShowSubventionModal(false)}
        subventionRequests={subventionRequests}
        onStatusChange={updateRequestStatus}
      />

      <MeetingRequestsModal
        show={showMeetingModal}
        onHide={() => setShowMeetingModal(false)}
        meetingRequests={meetingRequests}
        onStatusChange={updateMeetingStatus}
      />

      <EventRequestModal
        show={showEventModal}
        onHide={() => setShowEventModal(false)}
        eventRequests={eventRequests}
        onStatusChange={updateEventStatus}
      />
    </div>
  );
};

export default OfficerDashboard;
