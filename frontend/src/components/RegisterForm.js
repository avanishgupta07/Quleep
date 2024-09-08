import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterForm.css'; // Make sure to import your CSS file

function RegisterForm() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Default to empty string
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://quleep-181r.onrender.com/api/register', { name, dob, email, password, role });
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/users');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <Card className="register-card mx-auto">
        <Card.Body>
          <Card.Title className="text-center mb-4">Register</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control 
                type="date" 
                placeholder="Date of Birth" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control 
                as="select" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required
              >
                <option value="">Select role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">Register</Button>
          </Form>
          <div className="text-center mt-3">
            Already have an account? <Link to="/login" className="text-link">Login here</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default RegisterForm;
