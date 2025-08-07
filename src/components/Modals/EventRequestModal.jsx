// EventRequestsModal.jsx
import React from "react";
import { Modal, Table, Button, Badge } from "react-bootstrap";

const EventRequestModal = ({ show, onHide, eventRequests, onStatusChange }) => {
  return (
    <Modal size="xl" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Event Requests</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Requested Date</th>
                <th>Citizen ID</th>
                <th>Department ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.title}</td>
                  <td>{request.description}</td>
                  <td>{new Date(request.requestedDate).toLocaleDateString()}</td>
                  <td>{request.citizenId}</td>
                  <td>{request.departmentId}</td>
                  <td>
                    <Badge
                      bg={
                        request.status === "Approved"
                          ? "success"
                          : request.status === "Denied"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {request.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      disabled={request.status !== "Pending"}
                      onClick={() => onStatusChange(request.id, "Approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={request.status !== "Pending"}
                      onClick={() => onStatusChange(request.id, "Denied")}
                    >
                      Deny
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventRequestModal;
