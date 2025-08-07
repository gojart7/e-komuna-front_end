import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../services/addressService";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  FaMapMarkerAlt,
  FaCrosshairs,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "./CitizenAddressMap.css";

delete L.Icon.Default.prototype._getIconUrl; // fix default icons on parcel/webpack
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icon for "You are here"
const userLocationIcon = L.divIcon({
  className: "custom-user-location-icon",
  html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Custom icon for address markers
const addressIcon = L.divIcon({
  className: "custom-address-icon",
  html: '<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Helper component to recenter map on user location change
function RecenterMapOnUser({ userLocation }) {
  const map = useMap();
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation, map]);
  return null;
}

// Helper component to pan map to a target location
function PanToTargetLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.setView([target.lat, target.lng], 15);
    }
  }, [target, map]);
  return null;
}

const CitizenAddressMap = ({ citizenId }) => {
  const [addresses, setAddresses] = useState([]);
  const [adding, setAdding] = useState(null); // { lat, lng }
  const [label, setLabel] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, getUserRole } = useAuth();
  const [resetMapView, setResetMapView] = useState(false);
  const [panToLocation, setPanToLocation] = useState(null);

  /** fetch once */
  useEffect(() => {
    // Only fetch addresses if user is authenticated and is a citizen
    if (isAuthenticated() && getUserRole() === "Citizen" && citizenId) {
      (async () => {
        try {
          const addressesData = await getAddresses(citizenId);
          console.log("====================================");
          console.log("Fetched Addresses:", addressesData);
          console.log("====================================");
          setAddresses(Array.isArray(addressesData) ? addressesData : []);
        } catch (error) {
          console.error("Error fetching addresses:", error);
          setAddresses([]);
        }
      })();
    } else {
      setAddresses([]);
    }
  }, [citizenId, isAuthenticated, getUserRole]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Set default location (Pristina)
          setUserLocation({ lat: 42.66, lng: 21.16 });
        }
      );
    } else {
      // Set default location if geolocation is not supported
      setUserLocation({ lat: 42.66, lng: 21.16 });
    }
  }, []);

  /* Map click handler */
  const MapClick = () => {
    useMapEvents({
      click(e) {
        setAdding(e.latlng);
        setLabel("");
        setShowAddModal(true);
      },
    });
    return null;
  };

  /** helpers */
  const refresh = async () => {
    try {
      const addressesData = await getAddresses(citizenId);
      setAddresses(addressesData);
    } catch (error) {
      console.error("Error refreshing addresses:", error);
      setAddresses([]);
    }
  };

  const handleAdd = async () => {
    if (!label.trim()) {
      setError("Please enter a label for the address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await addAddress(citizenId, {
        label: label.trim(),
        latitude: adding.lat,
        longitude: adding.lng,
      });
      setAdding(null);
      setLabel("");
      setShowAddModal(false);
      refresh();
    } catch (error) {
      console.error("Error adding address:", error);
      setError("Failed to add address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setEditLabel(address.label);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!editLabel.trim()) {
      setError("Please enter a label for the address.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await updateAddress(citizenId, editingAddress.label, {
        label: editLabel.trim(),
        latitude: editingAddress.latitude,
        longitude: editingAddress.longitude,
      });
      setShowEditModal(false);
      setEditingAddress(null);
      setEditLabel("");
      refresh();
    } catch (error) {
      console.error("Error updating address:", error);
      setError("Failed to update address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (label) => {
    if (window.confirm(`Are you sure you want to delete "${label}"?`)) {
      try {
        await deleteAddress(citizenId, label);
        refresh();
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Failed to delete address. Please try again.");
      }
    }
  };

  // Don't render the map if user is not authenticated or not a citizen
  if (!isAuthenticated() || getUserRole() !== "Citizen") {
    return null;
  }

  return (
    <div className="map-container">
      {/* Map Controls */}
      <div className="map-controls mb-3">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="control-btn"
        >
          <FaPlus /> Add Address
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => userLocation && setPanToLocation(userLocation)}
          className="control-btn"
        >
          <FaCrosshairs /> My Location
        </Button>
      </div>

      {/* Map */}
      <div style={{ height: 400, position: "relative" }}>
        <MapContainer
          center={
            userLocation ? [userLocation.lat, userLocation.lng] : [42.66, 21.16]
          }
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <RecenterMapOnUser userLocation={userLocation} />
          <PanToTargetLocation target={panToLocation} />
          <MapClick />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* User's current location */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={userLocationIcon}
            >
              <Popup>
                <div className="text-center">
                  <FaMapMarkerAlt
                    className="text-primary mb-2"
                    style={{ fontSize: "1.5rem" }}
                  />
                  <strong>You are here</strong>
                  <br />
                  <small className="text-muted">
                    {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                  </small>
                </div>
              </Popup>
            </Marker>
          )}

          {/* existing addresses */}
          {addresses.map((a) => (
            <Marker
              key={a.label}
              position={[a.latitude, a.longitude]}
              icon={addressIcon}
            >
              <Popup>
                <div className="text-center">
                  <strong>{a.label}</strong>
                  <br />
                  <small className="text-muted">
                    {a.latitude.toFixed(6)}, {a.longitude.toFixed(6)}
                  </small>
                  <div className="mt-2 d-flex gap-2 justify-content-center">
                    <Button
                      size="sm"
                      variant="outline-warning"
                      onClick={() => handleEdit(a)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(a.label)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Add Address Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group>
            <Form.Label>Address Label</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address label (e.g., Home, Work, School)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
          </Form.Group>
          {adding && (
            <div className="mt-3">
              <small className="text-muted">
                Location: {adding.lat.toFixed(6)}, {adding.lng.toFixed(6)}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAdd}
            disabled={loading || !label.trim()}
          >
            {loading ? "Adding..." : "Add Address"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group>
            <Form.Label>Address Label</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address label"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUpdate()}
            />
          </Form.Group>
          {editingAddress && (
            <div className="mt-3">
              <small className="text-muted">
                Location: {editingAddress.latitude.toFixed(6)},{" "}
                {editingAddress.longitude.toFixed(6)}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={loading || !editLabel.trim()}
          >
            {loading ? "Updating..." : "Update Address"}
          </Button>
        </Modal.Footer>
      </Modal>

      <p className="text-muted mt-2">
        Click on map to add a new address. Use the controls above for quick
        actions.
      </p>
    </div>
  );
};

export default CitizenAddressMap;
