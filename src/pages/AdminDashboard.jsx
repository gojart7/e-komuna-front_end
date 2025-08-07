import { useState, useEffect, useRef } from "react";
import {
  Container,
  Navbar,
  Tab,
  Tabs,
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Card,
  Badge,
  Row,
  Col,
  Dropdown,
  InputGroup,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import "./AdminDashboard.css";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Building,
  Shield,
  Filter,
  RefreshCw,
  MoreVertical,
  Eye,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService";
import {
  getOfficers,
  createOfficer,
  updateOfficer,
  deleteOfficer,
} from "../services/officerService";
import {
  getAllCitizens,
  approveCitizen,
  rejectCitizen,
  updateCitizen,
} from "../services/citizenService";
import { globalSearch } from "../services/searchService";
import LogoutButton from "../components/LogoutButton";

function AdminDashboard() {
  const [citizens, setCitizens] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState("citizens");
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [visibleCitizens, setVisibleCitizens] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const citizensScrollRef = useRef(null);

  const showNotification = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  const validate = () => {
    const errs = {};
    if (currentTab === "departments") {
      if (!formData.name?.trim()) errs.name = "Department name is required";
    } else if (currentTab === "officers") {
      if (!formData.firstName?.trim()) {
        errs.firstName = "First Name is required";
      }
      if (!formData.lastName?.trim()) {
        errs.lastName = "Last Name is required";
      }
      if (!formData.email?.trim()) {
        errs.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = "Invalid email format";
      }
      if (!formData.departmentId) {
        errs.departmentId = "Department is required";
      }
    } else if (currentTab === "citizens") {
      if (!formData.firstName?.trim()) {
        errs.firstName = "First Name is required";
      }
      if (!formData.lastName?.trim()) {
        errs.lastName = "Last Name is required";
      }
      if (!formData.email?.trim()) {
        errs.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errs.email = "Invalid email format";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [departmentsData, officersData, citizensData] = await Promise.all([
        getDepartments(),
        getOfficers(),
        getAllCitizens(),
      ]);
      setDepartments(departmentsData);
      setOfficers(officersData);
      setCitizens(citizensData);
    } catch (err) {
      console.error("Failed to fetch data", err);
      showNotification("Failed to load data", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const div = citizensScrollRef.current;
      if (!div) return;
      const { scrollTop, scrollHeight, clientHeight } = div;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setVisibleCitizens((prev) =>
          prev + 10 > citizens.length ? citizens.length : prev + 10
        );
      }
    };

    const div = citizensScrollRef.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, [citizens.length]);

  // Search handler with debouncing
  const handleSearch = async () => {
    if (!searchKeyword.trim() && !searchStatus) {
      await fetchData();
      return;
    }

    setSearchLoading(true);
    try {
      const payload = {
        keyword: searchKeyword,
      };
      const results = await globalSearch(payload);
      setCitizens(results);
      setVisibleCitizens(10);
    } catch (err) {
      console.error("Global search failed", err);
      showNotification("Search failed", "danger");
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchKeyword.length > 1 || searchStatus) {
        handleSearch();
      } else if (searchKeyword.length === 0 && !searchStatus) {
        fetchData();
      }
    }, 500);
    return () => clearTimeout(id);
  }, [searchKeyword, searchStatus]);

  const handleClearSearch = async () => {
    setSearchKeyword("");
    setSearchStatus("");
    await fetchData();
  };

  const handleShowModal = (tab, index = null) => {
    setCurrentTab(tab);
    setEditIndex(index);

    if (index !== null) {
      const list =
        tab === "officers"
          ? officers
          : tab === "departments"
          ? departments
          : citizens;

      setFormData(list[index]);
    } else {
      const emptyForm =
        tab === "departments"
          ? { name: "" }
          : tab === "officers"
          ? {
              firstName: "",
              lastName: "",
              email: "",
              departmentId: "",
              isActive: true,
            }
          : {
              firstName: "",
              lastName: "",
              personalNumber: "",
              email: "",
            };

      setFormData(emptyForm);
    }

    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (currentTab === "departments") {
        if (editIndex !== null) {
          const deptToUpdate = departments[editIndex];
          const updated = await updateDepartment(deptToUpdate.id, formData);
          const updatedList = [...departments];
          updatedList[editIndex] = updated;
          setDepartments(updatedList);
          showNotification("Department updated successfully");
        } else {
          const newDept = await createDepartment(formData);
          setDepartments([...departments, newDept]);
          showNotification("Department created successfully");
        }
      } else if (currentTab === "officers") {
        if (editIndex !== null) {
          const officerToUpdate = officers[editIndex];
          await updateOfficer(officerToUpdate.id, formData);
          const updatedList = [...officers];
          updatedList[editIndex] = { ...officerToUpdate, ...formData };
          setOfficers(updatedList);
          showNotification("Officer updated successfully");
        } else {
          const newOfficer = await createOfficer(formData);
          setOfficers([...officers, newOfficer]);
          showNotification("Officer created successfully");
        }
      } else if (currentTab === "citizens") {
        if (editIndex !== null) {
          const citizenToUpdate = citizens[editIndex];
          const updatedData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            personalNumber: formData.personalNumber,
            email: formData.email,
          };
          const success = await updateCitizen(citizenToUpdate.id, updatedData);
          if (success) {
            const updatedList = [...citizens];
            updatedList[editIndex] = { ...citizenToUpdate, ...updatedData };
            setCitizens(updatedList);
            showNotification("Citizen updated successfully");
          }
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(`Failed to save ${currentTab}`, err);
      showNotification(`Failed to save ${currentTab}`, "danger");
    }
  };

  const handleDelete = async (tab, index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        if (tab === "departments") {
          const deptToDelete = departments[index];
          await deleteDepartment(deptToDelete.id);
          const updated = [...departments];
          updated.splice(index, 1);
          setDepartments(updated);
          showNotification("Department deleted successfully");
        } else if (tab === "officers") {
          const officerToDelete = officers[index];
          await deleteOfficer(officerToDelete.id);
          const updated = [...officers];
          updated.splice(index, 1);
          setOfficers(updated);
          showNotification("Officer deleted successfully");
        }
      } catch (err) {
        console.error("Failed to delete", err);
        showNotification("Failed to delete item", "danger");
      }
    }
  };

  const handleApprove = async (citizenId) => {
    try {
      await approveCitizen(citizenId);
      setCitizens((prevCitizens) =>
        prevCitizens.map((c) => (c.id === citizenId ? { ...c, status: 1 } : c))
      );
      showNotification("Citizen approved successfully");
    } catch (error) {
      console.error("Failed to approve user", error);
      showNotification("Failed to approve citizen", "danger");
    }
  };

  const handleReject = async (citizenId) => {
    try {
      await rejectCitizen(citizenId);
      setCitizens((prevCitizens) =>
        prevCitizens.map((c) => (c.id === citizenId ? { ...c, status: 2 } : c))
      );
      showNotification("Citizen rejected successfully");
    } catch (error) {
      console.error("Failed to reject user", error);
      showNotification("Failed to reject citizen", "danger");
    }
  };

  const getStatusBadge = (status) => {
    if (status === 1 || status === "Approved") {
      return <Badge bg="success">Approved</Badge>;
    } else if (status === 2 || status === "Rejected") {
      return <Badge bg="danger">Rejected</Badge>;
    } else {
      return (
        <Badge bg="warning" text="dark">
          Pending
        </Badge>
      );
    }
  };

  const getActionButtons = (item, index, tab) => {
    if (tab === "citizens" && item.status === "Pending") {
      return (
        <>
          <Button
            variant="outline-success"
            size="sm"
            className="me-2"
            onClick={() => handleApprove(item.id)}
          >
            <CheckCircle size={16} className="me-1" />
            Approve
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            className="me-2"
            onClick={() => handleReject(item.id)}
          >
            <XCircle size={16} className="me-1" />
            Reject
          </Button>
        </>
      );
    }

    return (
      <>
        <Button
          variant="outline-primary"
          size="sm"
          className="me-2"
          onClick={() => handleShowModal(tab, index)}
        >
          <Edit3 size={16} className="me-1" />
          Edit
        </Button>
        {tab !== "citizens" && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(tab, index)}
          >
            <Trash2 size={16} className="me-1" />
            Delete
          </Button>
        )}
      </>
    );
  };

  // Add stats calculation
  const stats = {
    totalCitizens: citizens.length,
    pendingCitizens: citizens.filter((c) => c.status === "Pending").length,
    approvedCitizens: citizens.filter((c) => c.status === 1).length,
    totalOfficers: officers.length,
    totalDepartments: departments.length,
  };

  if (loading) {
    return (
      <div
        className="admin-dashboard-modern d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-modern">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <LogoutButton />
      </div>

      {/* Statistics Cards */}
      <div className="stats-section mb-4">
        <Row className="g-3">
          <Col md={2} sm={4} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon citizens-icon">👥</div>
                <h3 className="stats-number">{stats.totalCitizens}</h3>
                <p className="stats-label">Total Citizens</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon pending-icon">⏳</div>
                <h3 className="stats-number">{stats.pendingCitizens}</h3>
                <p className="stats-label">Pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon approved-icon">✅</div>
                <h3 className="stats-number">{stats.approvedCitizens}</h3>
                <p className="stats-label">Approved</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon officers-icon">👮</div>
                <h3 className="stats-number">{stats.totalOfficers}</h3>
                <p className="stats-label">Officers</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon departments-icon">🏢</div>
                <h3 className="stats-number">{stats.totalDepartments}</h3>
                <p className="stats-label">Departments</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2} sm={4} xs={6}>
            <Card className="stats-card">
              <Card.Body className="text-center">
                <div className="stats-icon refresh-icon">🔄</div>
                <Button
                  variant="link"
                  onClick={fetchData}
                  className="refresh-btn p-0"
                >
                  Refresh
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="dashboard-content-card">
        <Tabs
          activeKey={currentTab}
          onSelect={(k) => setCurrentTab(k)}
          className="modern-tabs mb-4"
        >
          <Tab eventKey="citizens" title="Citizens">
            <div className="d-flex align-items-center mb-3 gap-2 flex-wrap">
              <Form.Control
                type="text"
                placeholder="Search citizens..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="modern-input"
                style={{ maxWidth: 250 }}
              />
              <Form.Select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="modern-input"
                style={{ maxWidth: 180 }}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="1">Approved</option>
                <option value="2">Rejected</option>
              </Form.Select>
              <Button
                variant="primary"
                onClick={handleClearSearch}
                disabled={!searchKeyword && !searchStatus}
                className="modern-btn"
              >
                Clear
              </Button>
              {searchLoading && <Spinner animation="border" size="sm" />}
            </div>
            <div className="table-container-no-scroll" ref={citizensScrollRef}>
              <Table hover className="modern-table" responsive>
                <thead className="sticky-header">
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Personal Number</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Requested At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.slice(0, visibleCitizens).map((item, index) => (
                    <tr key={item.id || index}>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.personalNumber}</td>
                      <td>{item.email}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>{new Date(item.requestedAt).toLocaleDateString()}</td>
                      <td>{getActionButtons(item, index, "citizens")}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
          <Tab eventKey="officers" title="Officers">
            <div className="d-flex justify-content-end mb-3">
              <Button
                variant="primary"
                onClick={() => handleShowModal("officers")}
                className="modern-btn"
              >
                Add Officer
              </Button>
            </div>
            <Table hover className="modern-table" responsive>
              <thead className="sticky-header">
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.email}</td>
                    <td>
                      {departments.find((d) => d.id === item.departmentId)
                        ?.name || "-"}
                    </td>
                    <td>{item.isActive ? "Active" : "Inactive"}</td>
                    <td>{getActionButtons(item, index, "officers")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="departments" title="Departments">
            <div className="d-flex justify-content-end mb-3">
              <Button
                variant="primary"
                onClick={() => handleShowModal("departments")}
                className="modern-btn"
              >
                Add Department
              </Button>
            </div>
            <Table hover className="modern-table" responsive>
              <thead className="sticky-header">
                <tr>
                  <th>Department Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.name}</td>
                    <td>{getActionButtons(item, index, "departments")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ borderBottom: "1px solid #e2e8f0" }}>
          <Modal.Title className="fw-bold">
            {editIndex !== null ? "Edit" : "Add"}{" "}
            {currentTab === "departments"
              ? "Department"
              : currentTab === "citizens"
              ? "Citizen"
              : "Officer"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mb-3">
              {Object.values(errors).map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </Alert>
          )}

          <Form>
            {/* Departments Form */}
            {currentTab === "departments" && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Department Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  isInvalid={!!errors.name}
                  style={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            {/* Officers Form */}
            {currentTab === "officers" && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      isInvalid={!!errors.firstName}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      isInvalid={!!errors.lastName}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      isInvalid={!!errors.email}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Department</Form.Label>
                    <Form.Select
                      value={formData.departmentId || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departmentId: Number(e.target.value),
                        })
                      }
                      isInvalid={!!errors.departmentId}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <option value="">Select Department</option>
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
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      checked={formData.isActive !== false}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="mt-4 pt-2"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* Citizens Form */}
            {currentTab === "citizens" && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">First Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.firstName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      isInvalid={!!errors.firstName}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.lastName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      isInvalid={!!errors.lastName}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Personal Number
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.personalNumber || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          personalNumber: e.target.value,
                        })
                      }
                      isInvalid={!!errors.personalNumber}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      isInvalid={!!errors.email}
                      style={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer style={{ borderTop: "1px solid #e2e8f0" }}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              borderRadius: "8px",
              border: "none",
              padding: "0.5rem 1rem",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            style={{
              borderRadius: "8px",
              border: "none",
              padding: "0.5rem 1rem",
            }}
          >
            {editIndex !== null ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "success" ? "text-white" : ""}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default AdminDashboard;
