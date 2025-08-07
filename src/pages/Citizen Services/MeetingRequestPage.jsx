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
import { requestMeeting, getDepartments } from "../../services/meetingService";
import BurgerMenu from "../../components/BurgerMenu";
import "./MeetingRequestPage.css";

const MeetingRequestPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestedDate: "",
    departmentId: "",
  });

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await getDepartments();
        setDepartments(result);
      } catch {
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
    if (!validate()) return;

    setSubmitting(true);
    try {
      await requestMeeting(formData);
      setToastMessage("Meeting request submitted successfully!");
      setToastVariant("success");
      setShowToast(true);
      setFormData({
        title: "",
        description: "",
        requestedDate: "",
        departmentId: "",
      });
    } catch (error) {
      setToastMessage("Failed to submit meeting request.");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="meeting-request-modern">
      {/* Modern Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h2>Request a Meeting</h2>
          </div>
          <div className="header-right">
            <BurgerMenu />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content-card">
        <Form onSubmit={handleSubmit} className="meeting-form">
          <Form.Group className="mb-4">
            <Form.Label className="form-label">Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter meeting title"
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
              placeholder="Enter meeting description"
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
          bg={toastVariant}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white text-center">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default MeetingRequestPage;
