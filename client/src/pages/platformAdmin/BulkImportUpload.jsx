import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  CloudUpload,
  ArrowBack,
  Description,
  Download
} from '@mui/icons-material';
import { platformAdminApi } from '../../api/platformAdmin.api';
import { useToast } from '../../contexts/ToastContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useNavigate } from 'react-router';
import { COUNTRIES } from '../../constants/countries';

const BulkImportUpload = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [csvFile, setCsvFile] = useState(null);
  const [country, setCountry] = useState('United States');
  const [mode, setMode] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        showToast('Please select a CSV file', 'error');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast('File size should be less than 10MB', 'error');
        return;
      }
      setCsvFile(file);
      setError('');
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `Name,Address,Website,Student population,Campus housing
Harvard University,"Cambridge, Massachusetts 02138",www.harvard.edu,23000,Yes
MIT,"77 Massachusetts Avenue, Cambridge, MA 02139",web.mit.edu,11520,Yes
Stanford University,"450 Serra Mall, Stanford, California 94305",www.stanford.edu,17249,Yes`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'college_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    if (!country) {
      setError('Please select a country');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('csvFile', csvFile);
      formData.append('country', country);
      formData.append('mode', mode);

      const response = await platformAdminApi.bulkImportPreview(formData);

      if (response.success) {
        navigate('/platform-admin/colleges/bulk-import-preview', {
          state: {
            previewData: {
              toBeCreated: response.toBeCreated,
              toBeUpdated: response.toBeUpdated,
              skipped: response.skipped,
              errors: response.errors
            },
            uploadDetails: { country, mode }
          },
          replace: false
        });
      } else {
        setError('Failed to process CSV file');
      }
    } catch (err) {
      setError(err.message || 'Failed to process CSV file');
      showToast(err.message || 'Failed to process CSV file', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: '800px', width: '100%', mx: 'auto' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/platform-admin/colleges')}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 1)',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Bulk Import Colleges
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a CSV file to import multiple colleges
            </Typography>
          </Box>
        </Box>

        <Card
          sx={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  CSV Column Names (case-sensitive):
                </Typography>
                <Button
                  size="small"
                  startIcon={<Download />}
                  onClick={handleDownloadTemplate}
                  sx={{
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                    minHeight: 0,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
                    }
                  }}
                >
                  Download Template
                </Button>
              </Box>
              <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                <strong>Required:</strong> Name
              </Typography>
              <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                <strong>Optional:</strong> Address, Website, Student population, Campus housing
              </Typography>
              <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                - Address format: "Street, City, State ZIP" (e.g., "123 Main St, Boston, MA 02108")
              </Typography>
              <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                - Campus housing: "Yes" or "No"
              </Typography>
              <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                - Extra columns are ignored
              </Typography>
              <Typography variant="caption" component="div">
                - Maximum file size: 10MB
              </Typography>
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#475569' }}>
                  Country
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                >
                  {COUNTRIES.map((countryName) => (
                    <MenuItem key={countryName} value={countryName}>
                      {countryName}
                    </MenuItem>
                  ))}
                </TextField>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Select the country for address parsing
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#475569' }}>
                  Import Mode
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                >
                  <MenuItem value="auto">Auto - Add new and update existing</MenuItem>
                  <MenuItem value="add_only">Add Only - Skip existing colleges</MenuItem>
                  <MenuItem value="update_only">Update Only - Skip new colleges</MenuItem>
                </TextField>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Choose how to handle duplicates
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#475569' }}>
                  CSV File
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: csvFile ? '#10b981' : '#cbd5e1',
                    borderRadius: '12px',
                    p: 4,
                    textAlign: 'center',
                    background: csvFile ? 'rgba(16, 185, 129, 0.02)' : 'rgba(241, 245, 249, 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {csvFile ? (
                    <Box>
                      <Description sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {csvFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(csvFile.size / 1024).toFixed(2)} KB
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          component="label"
                          size="small"
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            '&:hover': {
                              borderColor: '#764ba2',
                              background: 'rgba(102, 126, 234, 0.04)'
                            }
                          }}
                        >
                          Change File
                          <input
                            type="file"
                            hidden
                            accept=".csv"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: '#94a3b8', mb: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Click to upload CSV file
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        or drag and drop
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: '#764ba2',
                            background: 'rgba(102, 126, 234, 0.04)'
                          }
                        }}
                      >
                        Choose File
                        <input
                          type="file"
                          hidden
                          accept=".csv"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/platform-admin/colleges')}
                  disabled={loading}
                  sx={{
                    borderColor: '#cbd5e1',
                    color: '#64748b',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#94a3b8',
                      background: 'rgba(100, 116, 139, 0.04)'
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !csvFile}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 600,
                    px: 4,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b42a0 100%)',
                    },
                    '&:disabled': {
                      background: '#e2e8f0',
                      color: '#94a3b8'
                    }
                  }}
                >
                  {loading ? 'Processing...' : 'Continue to Preview'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default BulkImportUpload;
