import React from "react";
import { Modal, Button } from "react-bootstrap";

const OfficerProfileModal = ({ show, onHide, officerInfo }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Officer Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>
          <strong>First Name:</strong> <br></br>{officerInfo.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> <br></br>{officerInfo.lastName}
        </p>
        <p>
          <strong>Email:</strong> <br></br>{officerInfo.email}
        </p>
        <p>
          <strong>Department:</strong><br></br> {officerInfo.department}
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfficerProfileModal;
