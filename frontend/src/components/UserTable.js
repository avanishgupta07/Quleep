import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './UserTable.css';  // Import the custom CSS file

function UserTable() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', dob: '', email: '', password: '', role: '', status: 'Active' });
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://quleep-181r.onrender.com/api/users');
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusClass = (status) => {
    if (status === 'Active') return 'status-active';
    if (status === 'Suspended') return 'status-suspended';
    if (status === 'Inactive') return 'status-inactive';
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, dob: user.dob, email: user.email, password: '', role: user.role, status: user.status });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`https://quleep-181r.onrender.com/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        console.log("User deleted successfully");
      } else {
        console.log("Error deleting user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('https://quleep-181r.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating user:", errorData);
        throw new Error(errorData.error || 'Error creating user');
      }

      setSuccessMessage('User added successfully!');
      setFormData({ name: '', dob: '', email: '', password: '', role: '', status: 'Active' });
      setShowModal(false);
      await fetchUsers();  // Fetch users again to update the list
      console.log("User created successfully");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://quleep-181r.onrender.com/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating user:", errorData);
        throw new Error(errorData.error || 'Error updating user');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => (user._id === updatedUser._id ? updatedUser : user)));
      setSuccessMessage('User updated successfully!');
      setShowModal(false);
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
  <div>
    <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', color: '#111' }}>
  This is CRUD operation Table
</h1>
    <div className="user-table-container">
     
      <h2 className="mb-4">User Table</h2>
      <Button variant="primary" onClick={() => { setEditingUser(null); setFormData({ name: '', dob: '', email: '', password: '', role: '', status: 'Active' }); setShowModal(true); }}>
        Add User
        &nbsp;
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr No.</th>
            <th>Name</th>
            <th>Date Created</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{new Date(user.dob).toLocaleDateString()}</td>
              <td>{user.role}</td>
              <td>
                <span className={`status-dot ${getStatusClass(user.status)}`}></span>
                {user.status}
              </td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)}>Edit</Button>&nbsp;
                <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="danger" onClick={handleLogout}>Logout</Button>

      {/* Modal for creating and updating users */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date of birth"
                name="dob"
                value={formData.dob}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter role"
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={editingUser ? handleUpdate : handleCreate}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
            {successMessage && <Alert variant="success" className="mt-3">{successMessage}</Alert>}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  
  </div>
  );
}


export default UserTable;
