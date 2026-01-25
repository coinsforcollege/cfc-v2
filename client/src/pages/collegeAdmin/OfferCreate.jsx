import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  IconButton,
  Chip,
  Switch
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Add,
  Delete,
  Star
} from '@mui/icons-material';
import { collegeAdminApi } from '../../api/collegeAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { COUNTRIES } from '../../constants/countries';

const GRADE_LEVELS = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
  { value: '9', label: 'Grade 9' },
  { value: '10', label: 'Grade 10' },
  { value: '11', label: 'Grade 11' },
  { value: '12', label: 'Grade 12' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'];

const TARGETING_TYPES = [
  { value: 'all', label: 'All Students' },
  { value: 'country', label: 'By Country' },
  { value: 'gradeLevel', label: 'By Grade Level' },
  { value: 'pointsRange', label: 'By Scholarship Points' },
  { value: 'combined', label: 'Combined Criteria' },
];

// Common field height for consistency
const FIELD_HEIGHT = 56;

const OfferCreate = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [fetchingOffer, setFetchingOffer] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [formalLetter, setFormalLetter] = useState('');
  const [status, setStatus] = useState('draft');
  const [expiryDate, setExpiryDate] = useState('');
  const [isRecommended, setIsRecommended] = useState(false);

  // Required documents
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [newDocName, setNewDocName] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newDocRequired, setNewDocRequired] = useState(true);

  // Targeting
  const [targetingType, setTargetingType] = useState('all');
  const [targetCountries, setTargetCountries] = useState([]);
  const [targetGradeLevels, setTargetGradeLevels] = useState([]);
  const [minPoints, setMinPoints] = useState('');
  const [maxPoints, setMaxPoints] = useState('');

  useEffect(() => {
    if (!isEditing) {
      fetchLetterTemplate();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      fetchOfferDetails();
    }
  }, [id]);

  const fetchLetterTemplate = async () => {
    try {
      const response = await collegeAdminApi.getLetterTemplate();
      if (response.success) {
        setFormalLetter(response.data.template);
      }
    } catch (err) {
      console.error('Failed to fetch letter template:', err);
    }
  };

  const fetchOfferDetails = async () => {
    try {
      setFetchingOffer(true);
      setError('');
      const response = await collegeAdminApi.getOfferDetails(id);

      if (response.success) {
        const offer = response.data.offer;
        setTitle(offer.title || '');
        setTotalValue(offer.totalValue?.toString() || '');
        setCurrency(offer.currency || 'USD');
        setDescription(offer.description || '');
        setTerms(offer.terms || '');
        setFormalLetter(offer.formalLetter || '');
        setStatus(offer.status || 'draft');
        setExpiryDate(offer.expiryDate ? offer.expiryDate.split('T')[0] : '');
        setIsRecommended(offer.isRecommended || false);
        setRequiredDocuments(offer.requiredDocuments || []);

        const targeting = offer.targeting || { type: 'all' };
        setTargetingType(targeting.type || 'all');
        setTargetCountries(targeting.countries || []);
        setTargetGradeLevels(targeting.gradeLevels || []);
        setMinPoints(targeting.pointsRange?.min?.toString() || '');
        setMaxPoints(targeting.pointsRange?.max?.toString() || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load offer details');
      showToast(err.message || 'Failed to load offer details', 'error');
    } finally {
      setFetchingOffer(false);
    }
  };

  const handleAddDocument = () => {
    if (!newDocName.trim()) {
      showToast('Document name is required', 'error');
      return;
    }

    setRequiredDocuments([
      ...requiredDocuments,
      {
        name: newDocName.trim(),
        description: newDocDescription.trim(),
        required: newDocRequired
      }
    ]);
    setNewDocName('');
    setNewDocDescription('');
    setNewDocRequired(true);
  };

  const handleRemoveDocument = (index) => {
    setRequiredDocuments(requiredDocuments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    if (!totalValue || parseFloat(totalValue) < 0) {
      showToast('Valid scholarship value is required', 'error');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const targeting = { type: targetingType };

      if (targetingType === 'country' || targetingType === 'combined') {
        targeting.countries = targetCountries;
      }
      if (targetingType === 'gradeLevel' || targetingType === 'combined') {
        targeting.gradeLevels = targetGradeLevels;
      }
      if (targetingType === 'pointsRange' || targetingType === 'combined') {
        targeting.pointsRange = {
          min: minPoints ? parseFloat(minPoints) : null,
          max: maxPoints ? parseFloat(maxPoints) : null
        };
      }

      const offerData = {
        title: title.trim(),
        totalValue: parseFloat(totalValue),
        currency,
        description: description.trim(),
        terms: terms.trim(),
        formalLetter,
        requiredDocuments,
        targeting,
        status,
        expiryDate: expiryDate || null,
        isRecommended
      };

      let response;
      if (isEditing) {
        response = await collegeAdminApi.updateOffer(id, offerData);
      } else {
        response = await collegeAdminApi.createOffer(offerData);
      }

      if (response.success) {
        showToast(response.message || `Offer ${isEditing ? 'updated' : 'created'} successfully`, 'success');
        navigate('/college-admin/offers');
      }
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} offer`);
      showToast(err.message || `Failed to ${isEditing ? 'update' : 'create'} offer`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (fetchingOffer) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/college-admin/offers')}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {isEditing ? 'Edit Scholarship Offer' : 'Create Scholarship Offer'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditing ? 'Update offer details and settings' : 'Set up a new scholarship offer for students'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/college-admin/offers')}
              sx={{ height: 44, px: 3, borderColor: '#e2e8f0', color: '#64748b' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
              disabled={saving}
              onClick={handleSubmit}
              sx={{
                height: 44,
                px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
                }
              }}
            >
              {saving ? 'Saving...' : (isEditing ? 'Update Offer' : 'Create Offer')}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
            {/* Left Column - Main Content */}
            <Box sx={{ flex: '1 1 65%', minWidth: 0 }}>
              {/* Basic Information */}
              <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                    Basic Information
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      fullWidth
                      label="Offer Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      placeholder="e.g., Merit Scholarship for Outstanding Students"
                      sx={{ '& .MuiInputBase-root': { height: FIELD_HEIGHT } }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Scholarship Value"
                        type="number"
                        value={totalValue}
                        onChange={(e) => setTotalValue(e.target.value)}
                        required
                        placeholder="50000"
                        inputProps={{ min: 0, step: 100 }}
                        sx={{ flex: 1, '& .MuiInputBase-root': { height: FIELD_HEIGHT } }}
                      />
                      <FormControl sx={{ width: 120 }}>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={currency}
                          label="Currency"
                          onChange={(e) => setCurrency(e.target.value)}
                          sx={{ height: FIELD_HEIGHT }}
                        >
                          {CURRENCIES.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <TextField
                      fullWidth
                      label="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      multiline
                      rows={4}
                      placeholder="Brief description of the scholarship opportunity..."
                    />

                    <TextField
                      fullWidth
                      label="Terms and Conditions"
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      multiline
                      rows={4}
                      placeholder="Eligibility requirements, conditions, and any other terms..."
                    />
                  </Box>
                </CardContent>
              </Card>

              {/* Formal Letter */}
              <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    Formal Offer Letter
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    This letter will be sent to students. Use [Student Name] as a placeholder.
                  </Typography>
                  <TextField
                    fullWidth
                    value={formalLetter}
                    onChange={(e) => setFormalLetter(e.target.value)}
                    multiline
                    rows={12}
                    placeholder="Dear [Student Name],..."
                    sx={{
                      '& .MuiInputBase-root': {
                        fontFamily: 'Georgia, serif',
                        fontSize: '0.95rem',
                        lineHeight: 1.7
                      }
                    }}
                  />
                </CardContent>
              </Card>

              {/* Required Documents */}
              <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    Required Documents
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Documents students must submit to accept this offer
                  </Typography>

                  {/* Document List */}
                  {requiredDocuments.length > 0 && (
                    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {requiredDocuments.map((doc, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: 1.5,
                            bgcolor: '#f8fafc',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {doc.name}
                            </Typography>
                            {doc.required && (
                              <Chip
                                label="Required"
                                size="small"
                                sx={{
                                  height: 24,
                                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                                  color: '#ef4444',
                                  fontWeight: 600,
                                  fontSize: '0.7rem'
                                }}
                              />
                            )}
                            {doc.description && (
                              <Typography variant="body2" color="text.secondary">
                                - {doc.description}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveDocument(index)}
                            sx={{ color: '#ef4444' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Add Document Form */}
                  <Box sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 1.5,
                    bgcolor: '#fafafa',
                    border: '1px dashed #e2e8f0'
                  }}>
                    <TextField
                      label="Document Name"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="e.g., Transcript"
                      size="small"
                      sx={{ flex: 1, '& .MuiInputBase-root': { height: 40 } }}
                    />
                    <TextField
                      label="Description"
                      value={newDocDescription}
                      onChange={(e) => setNewDocDescription(e.target.value)}
                      placeholder="Optional details"
                      size="small"
                      sx={{ flex: 1, '& .MuiInputBase-root': { height: 40 } }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={newDocRequired}
                          onChange={(e) => setNewDocRequired(e.target.checked)}
                          size="small"
                        />
                      }
                      label={<Typography variant="body2">Required</Typography>}
                      sx={{ mx: 0 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      onClick={handleAddDocument}
                      sx={{
                        height: 40,
                        minWidth: 100,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          borderColor: '#5a67d8',
                          bgcolor: 'rgba(102, 126, 234, 0.04)'
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* Right Column - Settings */}
            <Box sx={{ flex: '1 1 35%', minWidth: 300 }}>
              {/* Status & Publishing */}
              <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#1e293b' }}>
                    Status & Publishing
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ height: FIELD_HEIGHT }}
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Expiry Date"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiInputBase-root': { height: FIELD_HEIGHT } }}
                    />

                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: 1.5,
                      bgcolor: isRecommended ? 'rgba(245, 158, 11, 0.08)' : '#f8fafc',
                      border: `1px solid ${isRecommended ? 'rgba(245, 158, 11, 0.3)' : '#e2e8f0'}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Star sx={{ color: '#f59e0b', fontSize: 22 }} />
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            Recommended
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            5 slots per month
                          </Typography>
                        </Box>
                      </Box>
                      <Switch
                        checked={isRecommended}
                        onChange={(e) => setIsRecommended(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#f59e0b',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#f59e0b',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Target Audience */}
              <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                    Target Audience
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Who should see this offer?
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormControl fullWidth>
                      <InputLabel>Targeting Type</InputLabel>
                      <Select
                        value={targetingType}
                        label="Targeting Type"
                        onChange={(e) => setTargetingType(e.target.value)}
                        sx={{ height: FIELD_HEIGHT }}
                      >
                        {TARGETING_TYPES.map((t) => (
                          <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {(targetingType === 'country' || targetingType === 'combined') && (
                      <FormControl fullWidth>
                        <InputLabel>Target Countries</InputLabel>
                        <Select
                          multiple
                          value={targetCountries}
                          label="Target Countries"
                          onChange={(e) => setTargetCountries(e.target.value)}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.slice(0, 2).map((value) => (
                                <Chip key={value} label={value} size="small" sx={{ height: 24 }} />
                              ))}
                              {selected.length > 2 && (
                                <Chip label={`+${selected.length - 2}`} size="small" sx={{ height: 24 }} />
                              )}
                            </Box>
                          )}
                          sx={{ minHeight: FIELD_HEIGHT }}
                          MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                        >
                          {COUNTRIES.map((c) => (
                            <MenuItem key={c} value={c}>{c}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {(targetingType === 'gradeLevel' || targetingType === 'combined') && (
                      <FormControl fullWidth>
                        <InputLabel>Target Grade Levels</InputLabel>
                        <Select
                          multiple
                          value={targetGradeLevels}
                          label="Target Grade Levels"
                          onChange={(e) => setTargetGradeLevels(e.target.value)}
                          renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.slice(0, 3).map((value) => (
                                <Chip key={value} label={`G${value}`} size="small" sx={{ height: 24 }} />
                              ))}
                              {selected.length > 3 && (
                                <Chip label={`+${selected.length - 3}`} size="small" sx={{ height: 24 }} />
                              )}
                            </Box>
                          )}
                          sx={{ minHeight: FIELD_HEIGHT }}
                        >
                          {GRADE_LEVELS.map((g) => (
                            <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}

                    {(targetingType === 'pointsRange' || targetingType === 'combined') && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Min Points"
                          type="number"
                          value={minPoints}
                          onChange={(e) => setMinPoints(e.target.value)}
                          placeholder="0"
                          inputProps={{ min: 0 }}
                          sx={{ '& .MuiInputBase-root': { height: FIELD_HEIGHT } }}
                        />
                        <TextField
                          fullWidth
                          label="Max Points"
                          type="number"
                          value={maxPoints}
                          onChange={(e) => setMaxPoints(e.target.value)}
                          placeholder="No limit"
                          inputProps={{ min: 0 }}
                          sx={{ '& .MuiInputBase-root': { height: FIELD_HEIGHT } }}
                        />
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', bgcolor: '#f8fafc' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#64748b' }}>
                    Tips for Better Offers
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <span>1.</span> Use clear, descriptive titles that explain the scholarship
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <span>2.</span> Include specific eligibility requirements in terms
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <span>3.</span> Personalize the formal letter with [Student Name]
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', gap: 1 }}>
                      <span>4.</span> Set realistic expiry dates to create urgency
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </form>
      </Box>
    </DashboardLayout>
  );
};

export default OfferCreate;
