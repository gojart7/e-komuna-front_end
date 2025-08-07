import React, { useEffect, useState } from "react";
import {
  Card,
  Spinner,
  Container,
  Alert,
  Row,
  Col,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import { getAvailableSubventions } from "../../services/subventionService";
import { applyForSubvention } from "../../services/subventionService";
import { getAppliedSubventions } from "../../services/subventionService";
import BurgerMenu from "../../components/BurgerMenu";
import { useNavigate } from "react-router-dom";
import "./Subventions.css";

export default function Subventions() {
  const [subventions, setSubventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSubvention, setSelectedSubvention] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");
  const [applied, setApplied] = useState([]);
  const [appliedLoading, setAppliedLoading] = useState(true);
  const [appliedError, setAppliedError] = useState("");
  const [showAppliedModal, setShowAppliedModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubventions = async () => {
      try {
        const result = await getAvailableSubventions();
        setSubventions(result);
      } catch (err) {
        setError("Failed to load subventions.");
      } finally {
        setLoading(false);
      }
    };
    const fetchApplied = async () => {
      try {
        const result = await getAppliedSubventions();
        setApplied(result);
      } catch (err) {
        setAppliedError("Failed to load your applications.");
      } finally {
        setAppliedLoading(false);
      }
    };
    fetchSubventions();
    fetchApplied();
  }, []);

  const handleApplyClick = (subvention) => {
    setSelectedSubvention(subvention);
    setShowConfirm(true);
    setApplyError("");
    setApplySuccess("");
  };

  const handleConfirmApply = async () => {
    setApplying(true);
    setApplyError("");
    setApplySuccess("");
    try {
      const response = await applyForSubvention(selectedSubvention.id);
      if (
        response &&
        typeof response === "object" &&
        response.message === "Already applied for this subvention."
      ) {
        setApplyError("Already applied for this subvention.");
        setShowConfirm(false);
      } else {
        setApplySuccess("Successfully applied for subvention!");
        setShowConfirm(false);
      }
    } catch (err) {
      const backendMsg = err?.response?.data?.message || err?.message || "";
      if (
        backendMsg &&
        backendMsg.toLowerCase().includes("already applied for this subvention")
      ) {
        setApplyError("Already applied for this subvention.");
        setShowConfirm(false);
      } else {
        setApplyError("Failed to apply for subvention.");
      }
    } finally {
      setApplying(false);
    }
  };

  const handleShowAppliedModal = async () => {
    setShowAppliedModal(true);
    setAppliedLoading(true);
    setAppliedError("");
    try {
      const result = await getAppliedSubventions();
      setApplied(result);
    } catch (err) {
      setAppliedError("Failed to load your applications.");
    } finally {
      setAppliedLoading(false);
    }
  };

  return (
    <div className="subventions-modern">
      {/* Modern Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => navigate("/citizen-dashboard")}
                className="back-btn"
              >
                &larr; Back
              </Button>
              <Button
                variant="light"
                size="sm"
                onClick={handleShowAppliedModal}
                className="applications-btn"
              >
                My Applications
              </Button>
            </div>
          </div>
          <div className="header-right">
            <BurgerMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="section-title">Available Subventions</h3>
        </div>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}
        {applyError && <Alert variant="danger">{applyError}</Alert>}
        {applySuccess && <Alert variant="success">{applySuccess}</Alert>}

        {!loading && !error && subventions.length === 0 && (
          <Alert variant="info">No subventions available.</Alert>
        )}

        {!loading && subventions.length > 0 && (
          <Row xs={1} md={2} lg={3} className="g-4">
            {subventions.map((subvention, index) => (
              <Col key={subvention.id || index}>
                <Card className="subvention-card">
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      <Card.Title className="subvention-title">
                        {subvention.title || "N/A"}
                      </Card.Title>
                      {subvention.deadline && (
                        <Badge className="deadline-badge">
                          {new Date(subvention.deadline).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                    <Card.Text className="subvention-description">
                      {subvention.description || "No description provided."}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-end mt-auto">
                      <Badge className="amount-badge">
                        {subvention.amount || "N/A"}
                      </Badge>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApplyClick(subvention)}
                        className="apply-btn"
                      >
                        Apply
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Applied Subventions Modal */}
      <Modal
        show={showAppliedModal}
        onHide={() => setShowAppliedModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>My Applications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {appliedLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : appliedError ? (
            <Alert variant="danger">{appliedError}</Alert>
          ) : applied.length === 0 ? (
            <Alert variant="info">No applications found.</Alert>
          ) : (
            <div className="applied-list">
              {applied.map((app, index) => (
                <Card key={app.id || index} className="applied-card mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{app.subventionTitle || "N/A"}</h6>
                        <small className="text-muted">
                          Applied:{" "}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </small>
                      </div>
                      <Badge
                        className={`status-badge ${app.status?.toLowerCase()}`}
                      >
                        {app.status || "Pending"}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubvention && (
            <>
              <p>
                Are you sure you want to apply for:{" "}
                <strong>{selectedSubvention.title}</strong>?
              </p>
              <p>
                Amount: <strong>{selectedSubvention.amount}</strong>
              </p>
              <p>
                Deadline:{" "}
                {selectedSubvention.deadline &&
                  new Date(selectedSubvention.deadline).toLocaleDateString()}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirm(false)}
            className="modal-btn"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmApply}
            disabled={applying}
            className="modal-btn confirm-btn"
          >
            {applying ? "Applying..." : "Confirm Application"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
