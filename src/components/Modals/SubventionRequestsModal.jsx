import React from "react";
import { Modal, Table, Button, Badge } from "react-bootstrap";

const SubventionRequestsModal = ({
  show,
  onHide,
  subventionRequests,
  onStatusChange,
}) => {
  return (
    <Modal size="xl" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Subvention Requests
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="table-responsive">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Department ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subventionRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.title}</td>
                  <td>{request.description}</td>
                  <td>{request.departmentId}</td>
                  <td>{request.deadline}</td>
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

export default SubventionRequestsModal;
