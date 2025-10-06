import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth.api';
import { collegesApi } from '../../api/colleges.api';

const CollegeRegistration = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    collegeId: null
  });
  const [colleges, setColleges] = useState([]);
  const [collegeSearchLoading, setCollegeSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddCollegeDialog, setShowAddCollegeDialog] = useState(false);
  const [newCollege, setNewCollege] = useState({
    name: '',
    country: '',
    logo: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCollegeSearch = async (searchTerm) => {
    if (searchTerm.length < 2) return;
    
    setCollegeSearchLoading(true);
    try {
      const response = await collegesApi.search(searchTerm);
      if (response.success) {
        setColleges(response.data);
      }
    } catch (err) {
      console.error('College search error:', err);
    } finally {
      setCollegeSearchLoading(false);
    }
  };

  const handleAddCollege = () => {
    setShowAddCollegeDialog(false);
    // newCollege will be sent with registration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.collegeId && !newCollege.name) {
      setError('Please select or add a college');
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      if (formData.collegeId) {
        registrationData.collegeId = formData.collegeId;
      } else if (newCollege.name) {
        registrationData.newCollege = {
          name: newCollege.name,
          country: newCollege.country,
          logo: newCollege.logo || undefined
        };
      }

      const response = await authApi.registerCollege(registrationData);
      
      if (response.success) {
        login(response.data, response.token);
        navigate('/college-admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(155, 184, 224, 0.4) 0%, rgba(179, 154, 232, 0.3) 50%, rgba(230, 155, 184, 0.3) 100%)',
        px: 2,
        py: { xs: 12, md: 8 },
        mt: { xs: 8, md: 0 }
      }}
    >
      <Box
        sx={{
          maxWidth: { xs: '500px', md: '900px' },
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: { xs: '30px 20px', md: '40px' },
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            College Registration
          </Typography>
          
          <Typography
            sx={{
              color: '#718096',
            }}
          >
            Join our waitlist for free
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              mb: 2
            }}
          >
            <TextField
              fullWidth
              label="Admin Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ gridColumn: { xs: '1', md: 'span 2' } }}
            />
          </Box>

          {!newCollege.name ? (
            <Box sx={{ mb: 3 }}>
              <Autocomplete
                options={colleges}
                getOptionLabel={(option) => `${option.name} - ${option.country}`}
                loading={collegeSearchLoading}
                onInputChange={(e, value) => handleCollegeSearch(value)}
                onChange={(e, value) => setFormData({ ...formData, collegeId: value?._id || null })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Find Your College"
                    placeholder="Start typing..."
                    required={!newCollege.name}
                  />
                )}
              />
              <Button
                size="small"
                onClick={() => setShowAddCollegeDialog(true)}
                sx={{
                  mt: 1,
                  color: '#0EA5E9',
                  textTransform: 'none'
                }}
              >
                + College not found? Add new
              </Button>
            </Box>
          ) : (
            <Alert
              severity="info"
              sx={{ mb: 3 }}
              onClose={() => setNewCollege({ name: '', country: '', logo: '' })}
            >
              Adding new college: {newCollege.name} ({newCollege.country})
            </Alert>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)',
              color: '#ffffff',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)',
              },
              mb: 2
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                style={{
                  color: '#0EA5E9',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>

      {/* Add College Dialog */}
      <Dialog open={showAddCollegeDialog} onClose={() => setShowAddCollegeDialog(false)}>
        <DialogTitle>Add New College</DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: '400px' }}>
          <TextField
            fullWidth
            label="College Name"
            value={newCollege.name}
            onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Country"
            value={newCollege.country}
            onChange={(e) => setNewCollege({ ...newCollege, country: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Logo URL (Optional)"
            value={newCollege.logo}
            onChange={(e) => setNewCollege({ ...newCollege, logo: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddCollegeDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddCollege}
            disabled={!newCollege.name || !newCollege.country}
            variant="contained"
          >
            Add College
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollegeRegistration;

