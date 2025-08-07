// src/components/BurgerMenu.jsx
import React, { useState } from "react";
import { Button, Offcanvas, ListGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CalendarView from "../pages/CalendarView";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaCalendarAlt,
  FaSignOutAlt,
  FaUser,
  FaHome,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import "./BurgerMenu.css";

export default function BurgerMenu() {
  const [show, setShow] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpenCalendar = () => {
    setShowCalendar(true);
    setShow(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShow(false);
  };

  return (
    <>
      {/* Modern Burger Button */}
      <Button
        variant="outline-light"
        onClick={() => setShow(true)}
        className="burger-btn"
        size="sm"
      >
        <FaBars />
      </Button>

      {/* Modern Slide-out menu */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="end"
        backdrop={true}
        className="modern-offcanvas"
      >
        <Offcanvas.Header className="offcanvas-header-modern">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <h6 className="user-name">{user?.firstName || "User"}</h6>
              <small className="user-role">Citizen</small>
            </div>
          </div>
          <Button
            variant="link"
            onClick={() => setShow(false)}
            className="close-btn"
          >
            ×
          </Button>
        </Offcanvas.Header>

        <Offcanvas.Body className="offcanvas-body-modern">
          <ListGroup variant="flush" className="menu-list">
            <ListGroup.Item
              action
              onClick={handleOpenCalendar}
              className="menu-item"
            >
              <FaCalendarAlt className="menu-icon" />
              <span>Calendar</span>
            </ListGroup.Item>

            <div className="menu-divider"></div>

            <ListGroup.Item
              action
              onClick={handleLogout}
              className="menu-item logout-item"
            >
              <FaSignOutAlt className="menu-icon" />
              <span>Logout</span>
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Calendar Modal */}
      <Modal
        show={showCalendar}
        onHide={() => setShowCalendar(false)}
        centered
        size="lg"
        className="modern-modal"
      >
        <Modal.Header closeButton className="modal-header-modern">
          <Modal.Title>
            <FaCalendarAlt className="me-2" />
            My Calendar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-modern">
          <CalendarView />
        </Modal.Body>
      </Modal>
    </>
  );
}
