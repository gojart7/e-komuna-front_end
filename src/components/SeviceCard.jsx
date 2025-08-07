import React from "react";
import { Card } from "react-bootstrap";

const ServiceCard = ({ icon, title, description, onClick }) => {
  return (
    <Card onClick={onClick} className="service-card">
      <div className="service-icon">{icon}</div>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {description && <Card.Text>{description}</Card.Text>}
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;
