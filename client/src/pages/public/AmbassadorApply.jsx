import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Alert,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  CircularProgress,
  Grid
} from '@mui/material';
import {
  Campaign,
  Public,
  PersonAdd,
  ContactSupport,
  Group,
  EmojiEvents,
  Stars,
  TrendingUp,
  AutoAwesome,
  CheckCircle,
  Send,
  Instagram,
  Twitter,
  LinkedIn
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ambassadorApi } from '../../api/ambassador.api';

const activities = [
  'Organize Events',
  'Social Media Marketing',
  'Content Creation',
  'Community Management',
  'Campus Outreach',
  'Workshop Facilitation'
];

const AmbassadorApply = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    yearOfStudy: '',
    major: '',
    leadershipExperience: '',
    campusInvolvement: '',
    whyAmbassador: '',
    socialMediaHandles: {
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    availability: {
      hoursPerWeek: '',
      preferredActivities: []
    },
    referredBy: '',
    additionalComments: '',
    agreeToTerms: false
  });

  useEffect(() => {
    // Check if user is logged in as student
    if (!user) {
      navigate('/auth/login/student');
      return;
    }
    if (user.role !== 'student') {
      navigate('/');
      return;
    }

    // Pre-fill user data
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    }));

    // Check if student already has an application
    checkExistingApplication();
  }, [user, navigate]);

  const checkExistingApplication = async () => {
    try {
      const response = await ambassadorApi.getMyApplication();
      if (response.success && response.data) {
        setExistingApplication(response.data);
      }
    } catch (error) {
      console.error('Error checking existing application:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleActivityChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        preferredActivities: typeof value === 'string' ? value.split(',') : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    if (formData.availability.preferredActivities.length === 0) {
      setError('Please select at least one preferred activity');
      return;
    }

    try {
      setLoading(true);
      const submitData = { ...formData };
      delete submitData.agreeToTerms;

      await ambassadorApi.submitApplication(submitData);
      setSuccess(true);
      window.scrollTo(0, 0);
      
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to submit application');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  // If already has an active application
  if (existingApplication && ['pending', 'under_review', 'approved'].includes(existingApplication.status)) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'white', pt: { xs: 12, md: 14 }, pb: 8 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 80, color: '#4ecdc4', mb: 3 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
              Application Already Submitted
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              You have already submitted an ambassador application. Status: <strong>{existingApplication.status.replace('_', ' ').toUpperCase()}</strong>
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Submitted on {new Date(existingApplication.submittedAt).toLocaleDateString()}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/student/dashboard')}>
              Go to Dashboard
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: 'white', pt: { xs: 12, md: 14 }, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert severity="success" sx={{ mb: 4, fontSize: '1.1rem' }}>
              <strong>Application Submitted Successfully!</strong> We'll review your application and get back to you soon. Redirecting to dashboard...
            </Alert>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                borderRadius: '50%',
                p: 3,
                boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)'
              }}>
                <Campaign sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Become a Campus Ambassador
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: '#718096',
                mb: 6,
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Lead the future of campus digital economies and build valuable leadership experience
            </Typography>
          </motion.div>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 6,
          alignItems: 'flex-start'
        }}>
          {/* Left Side - Info */}
          <Box sx={{ 
            flex: { lg: '0 0 400px' },
            width: { xs: '100%', lg: '400px' },
            position: { lg: 'sticky' },
            top: { lg: 100 }
          }}>
              {/* What You'll Get */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Paper sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Stars sx={{ color: '#8b5cf6', fontSize: 32 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      What You'll Get
                    </Typography>
                  </Box>
                  
                  <Stack spacing={2}>
                    {[
                      { icon: EmojiEvents, text: 'Exclusive perks and early access to features', color: '#f59e0b' },
                      { icon: TrendingUp, text: 'Leadership development and resume builder', color: '#8b5cf6' },
                      { icon: Group, text: 'Network with ambassadors nationwide', color: '#ec4899' },
                      { icon: AutoAwesome, text: 'Extra token rewards and bonuses', color: '#4ecdc4' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                          background: `${item.color}20`,
                          borderRadius: '50%',
                          p: 1,
                          display: 'flex'
                        }}>
                          <item.icon sx={{ color: item.color, fontSize: 20 }} />
                        </Box>
                        <Typography sx={{ color: '#2d3748' }}>{item.text}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                    Join the Movement
                  </Typography>
                  
                  <Stack spacing={2}>
                    {[
                      { label: 'Active Ambassadors', value: '250+' },
                      { label: 'Colleges Represented', value: '50+' },
                      { label: 'Events Organized', value: '500+' }
                    ].map((stat, index) => (
                      <Box key={index} sx={{ textAlign: 'center', p: 2, background: '#f7fafc', borderRadius: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </motion.div>
          </Box>

          {/* Right Side - Application Form */}
          <Box sx={{ 
            flex: 1,
            minWidth: 0,
            width: '100%'
          }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper sx={{ p: 5, borderRadius: 3, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Application Form
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                  Tell us about yourself and why you'd be a great ambassador
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    {/* Personal Information */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#8b5cf6' }}>
                        Personal Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth required>
                            <InputLabel>Year of Study</InputLabel>
                            <Select
                              name="yearOfStudy"
                              value={formData.yearOfStudy}
                              onChange={handleChange}
                              label="Year of Study"
                            >
                              <MenuItem value="1st Year">1st Year</MenuItem>
                              <MenuItem value="2nd Year">2nd Year</MenuItem>
                              <MenuItem value="3rd Year">3rd Year</MenuItem>
                              <MenuItem value="4th Year">4th Year</MenuItem>
                              <MenuItem value="Graduate">Graduate</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Major / Field of Study"
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Experience & Skills */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#ec4899' }}>
                        Experience & Skills
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Leadership Experience"
                          name="leadershipExperience"
                          value={formData.leadershipExperience}
                          onChange={handleChange}
                          multiline
                          rows={4}
                          required
                          helperText="Tell us about your leadership roles, clubs, or organizations you've been part of"
                        />
                        <TextField
                          fullWidth
                          label="Campus Involvement"
                          name="campusInvolvement"
                          value={formData.campusInvolvement}
                          onChange={handleChange}
                          multiline
                          rows={4}
                          required
                          helperText="Describe your involvement in campus activities, events, or communities"
                        />
                        <TextField
                          fullWidth
                          label="Why Do You Want to Be an Ambassador?"
                          name="whyAmbassador"
                          value={formData.whyAmbassador}
                          onChange={handleChange}
                          multiline
                          rows={4}
                          required
                          helperText="What excites you about this role? How will you make an impact?"
                        />
                      </Stack>
                    </Box>

                    {/* Social Media */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#4ecdc4' }}>
                        Social Media Presence
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Instagram Handle"
                          name="socialMediaHandles.instagram"
                          value={formData.socialMediaHandles.instagram}
                          onChange={handleChange}
                          placeholder="@yourhandle"
                          InputProps={{
                            startAdornment: <Instagram sx={{ color: '#E1306C', mr: 1 }} />
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Twitter/X Handle"
                          name="socialMediaHandles.twitter"
                          value={formData.socialMediaHandles.twitter}
                          onChange={handleChange}
                          placeholder="@yourhandle"
                          InputProps={{
                            startAdornment: <Twitter sx={{ color: '#1DA1F2', mr: 1 }} />
                          }}
                        />
                        <TextField
                          fullWidth
                          label="LinkedIn Profile"
                          name="socialMediaHandles.linkedin"
                          value={formData.socialMediaHandles.linkedin}
                          onChange={handleChange}
                          placeholder="linkedin.com/in/yourprofile"
                          InputProps={{
                            startAdornment: <LinkedIn sx={{ color: '#0077B5', mr: 1 }} />
                          }}
                        />
                      </Stack>
                    </Box>

                    {/* Availability */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#45b7d1' }}>
                        Availability & Interests
                      </Typography>
                      <Stack spacing={2}>
                        <FormControl fullWidth required>
                          <InputLabel>Hours Per Week</InputLabel>
                          <Select
                            name="availability.hoursPerWeek"
                            value={formData.availability.hoursPerWeek}
                            onChange={handleChange}
                            label="Hours Per Week"
                          >
                            <MenuItem value="5-10 hours">5-10 hours</MenuItem>
                            <MenuItem value="10-15 hours">10-15 hours</MenuItem>
                            <MenuItem value="15-20 hours">15-20 hours</MenuItem>
                            <MenuItem value="20+ hours">20+ hours</MenuItem>
                          </Select>
                        </FormControl>
                        
                        <FormControl fullWidth required>
                          <InputLabel>Preferred Activities</InputLabel>
                          <Select
                            multiple
                            value={formData.availability.preferredActivities}
                            onChange={handleActivityChange}
                            input={<OutlinedInput label="Preferred Activities" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {activities.map((activity) => (
                              <MenuItem key={activity} value={activity}>
                                {activity}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>Select all that interest you</FormHelperText>
                        </FormControl>
                      </Stack>
                    </Box>

                    {/* Additional Info */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#f59e0b' }}>
                        Additional Information
                      </Typography>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Referred By (Optional)"
                          name="referredBy"
                          value={formData.referredBy}
                          onChange={handleChange}
                          helperText="If someone referred you to this program, please mention their name"
                        />
                        <TextField
                          fullWidth
                          label="Additional Comments (Optional)"
                          name="additionalComments"
                          value={formData.additionalComments}
                          onChange={handleChange}
                          multiline
                          rows={3}
                          helperText="Anything else you'd like us to know?"
                        />
                      </Stack>
                    </Box>

                    {/* Terms */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.agreeToTerms}
                          onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                          required
                        />
                      }
                      label="I agree to the ambassador program terms and commit to representing Coins For College professionally"
                    />

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || success}
                      startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                      sx={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: 3,
                        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)',
                        '&:hover': {
                          boxShadow: '0 15px 40px rgba(139, 92, 246, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AmbassadorApply;

