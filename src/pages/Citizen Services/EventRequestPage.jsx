import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getDepartments } from "../../services/meetingService";
import { requestOrganizing } from "../../services/organizingService";
import BurgerMenu from "../../components/BurgerMenu";
import "./EventRequestPage.css";

const EventRequestPage = () => {
  const citizenId = localStorage.getItem("citizenId");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestedDate: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.length > 150)
      newErrors.title = "Title must be 150 characters or less";

    if (formData.description.length > 500)
      newErrors.description = "Description must be 500 characters or less";

    if (!formData.requestedDate)
      newErrors.requestedDate = "Requested date is required";

    if (!formData.departmentId)
      newErrors.departmentId = "Department is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await requestOrganizing({
        ...formData,
        citizenId,
        departmentId: Number(formData.departmentId),
      });
      setShowToast(true);
      setFormData({
        title: "",
        description: "",
        requestedDate: "",
        departmentId: "",
      });
    } catch (err) {
      setSubmitError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="event-request-modern">
      {/* Modern Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h2>Request Event Permission</h2>
          </div>
          <div className="header-right">
            <BurgerMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content-card">
        <Form onSubmit={handleSubmit} className="event-form">
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              isInvalid={!!errors.title}
              disabled={submitting}
              className="form-control-modern"
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="form-label">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter event description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              isInvalid={!!errors.description}
              disabled={submitting}
              className="form-control-modern"
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="form-label">Requested Date *</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, requestedDate: e.target.value })
                  }
                  isInvalid={!!errors.requestedDate}
                  disabled={submitting}
                  className="form-control-modern"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.requestedDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="form-label">Department *</Form.Label>
                <Form.Select
                  value={formData.departmentId}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentId: e.target.value })
                  }
                  isInvalid={!!errors.departmentId}
                  disabled={submitting}
                  className="form-control-modern"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.departmentId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {submitError && (
            <div className="alert alert-danger mb-4">{submitError}</div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-5">
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/citizen-dashboard")}
              disabled={submitting}
              className="back-btn"
            >
              Back to Dashboard
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="submit-btn"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </Form>
      </div>

      {/* Toast Notification */}
      <ToastContainer position="top-center" className="mt-4">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white text-center">
            Event permission request submitted successfully!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default EventRequestPage;
