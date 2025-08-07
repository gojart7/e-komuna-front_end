// src/pages/BirthCertificateList.jsx
import {
  getCitizenCertificates,
  payCertificate,
  allowedCurrencies,
  markCertificateAsPaid,
  downloadCertificate,
  requestCertificate,
} from "../services/certificateService";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Badge,
  Modal,
  Spinner,
} from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BurgerMenu from "../components/BurgerMenu";
import "./BirthCertificate.css";

export default function BirthCertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [paying, setPaying] = useState(false);
  const [currencyError, setCurrencyError] = useState("");

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestError, setRequestError] = useState("");

  const citizenId = localStorage.getItem("citizenId");

  useEffect(() => {
    const loadCertificates = async () => {
      try {
        const data = await getCitizenCertificates(citizenId);
        setCertificates(data);
      } catch (error) {
        alert("Failed to load certificates.");
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [citizenId]);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleOpenPayModal = (cert) => {
    setSelectedCert(cert);
    setAmount(""); // Reset
    setCurrency(""); // Reset
    setShowPayModal(true);
  };

  const handleClosePayModal = () => {
    setSelectedCert(null);
    setAmount("");
    setCurrency("");
    setShowPayModal(false);
  };

  return (
    <div className="birth-certificate-modern">
      {/* Modern Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="d-flex align-items-center gap-3">
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleGoBack}
                className="back-btn"
              >
                &larr; Back
              </Button>
              <Button
                variant="light"
                size="sm"
                onClick={() => setShowRequestModal(true)}
                className="request-btn"
              >
                + Request Certificate
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
          <h3 className="section-title">Birth Certificates</h3>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center min-vh-50">
            <Spinner animation="border" variant="primary" role="status" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No certificates found.</p>
          </div>
        ) : (
          <div className="certificates-list">
            {certificates.map((cert) => (
              <Card key={cert.id} className="certificate-card mb-3">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col>
                      <h5 className="mb-1 certificate-title">
                        {cert.certificateType}
                      </h5>
                      <small className="text-muted">
                        Requested At:{" "}
                        {new Date(cert.requestedAt).toLocaleString()}
                      </small>
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center gap-2">
                      {cert.isPaid ? (
                        <Badge bg="success" className="status-badge paid">
                          <CheckCircleFill /> Paid
                        </Badge>
                      ) : (
                        <Badge bg="danger" className="status-badge unpaid">
                          <XCircleFill /> Not Paid
                        </Badge>
                      )}
                    </Col>
                    <Col xs="auto" className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleOpenPayModal(cert)}
                        className="action-btn"
                      >
                        Pay
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={async () => {
                          try {
                            await markCertificateAsPaid(cert.id);
                            toast.success("Marked as paid!");
                            const updatedList = await getCitizenCertificates(
                              citizenId
                            );
                            setCertificates(updatedList);
                          } catch (error) {
                            toast.error(
                              "Failed to mark as paid: " + error.message
                            );
                          }
                        }}
                        className="action-btn"
                      >
                        Mark as Paid
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={async () => {
                          try {
                            await downloadCertificate(cert.id);
                            toast.success("Download started!");
                          } catch (error) {
                            toast.error(
                              "Failed to download certificate: " + error.message
                            );
                          }
                        }}
                        className="action-btn"
                      >
                        Download
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal show={showPayModal} onHide={handleClosePayModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pay Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCert && (
            <>
              <p>
                You're about to pay for:{" "}
                <strong>{selectedCert.certificateType}</strong>
              </p>
              <p>
                Request Date:{" "}
                {new Date(selectedCert.requestedAt).toLocaleString()}
              </p>
              <div className="mb-3">
                <label className="form-label">Amount:</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Currency:</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="">Select currency</option>
                  {allowedCurrencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
              {currencyError && (
                <div className="alert alert-danger">{currencyError}</div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePayModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (!amount || !currency) {
                setCurrencyError("Please fill in all fields.");
                return;
              }
              setCurrencyError("");
              setPaying(true);
              try {
                await payCertificate(selectedCert.id, amount, currency);
                toast.success("Payment successful!");
                handleClosePayModal();
                const updatedList = await getCitizenCertificates(citizenId);
                setCertificates(updatedList);
              } catch (error) {
                toast.error("Payment failed: " + error.message);
              } finally {
                setPaying(false);
              }
            }}
            disabled={paying}
          >
            {paying ? "Processing..." : "Pay"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRequestModal}
        onHide={() => setShowRequestModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Request Certificate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Certificate Type:</label>
            <select
              className="form-select"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="">Select certificate type</option>
              <option value="Birth">Birth Certificate</option>
              <option value="Death">Death Certificate</option>
              <option value="Marriage">Marriage Certificate</option>
            </select>
          </div>
          {requestError && (
            <div className="alert alert-danger">{requestError}</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRequestModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (!requestType) {
                setRequestError("Please select a certificate type.");
                return;
              }
              setRequestError("");
              setRequesting(true);
              try {
                await requestCertificate(citizenId, requestType);
                toast.success("Certificate request submitted!");
                setShowRequestModal(false);
                const updatedList = await getCitizenCertificates(citizenId);
                setCertificates(updatedList);
              } catch (error) {
                toast.error("Request failed: " + error.message);
              } finally {
                setRequesting(false);
              }
            }}
            disabled={requesting}
          >
            {requesting ? "Submitting..." : "Submit Request"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" />
    </div>
  );
}
