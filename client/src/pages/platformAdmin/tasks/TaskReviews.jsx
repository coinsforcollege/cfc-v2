import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Check,
  Close,
  Visibility,
  Person,
  AccessTime,
  Assignment,
  AttachFile,
  Image as ImageIcon,
  VideoFile,
  Description
} from '@mui/icons-material';
import { platformAdminTaskApi } from '../../../api/platformAdminTask.api';

const TaskReviews = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ pending: 0, approvedToday: 0, rejectedToday: 0 });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, [page]);

  const fetchStats = async () => {
    try {
      const response = await platformAdminTaskApi.getReviewStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await platformAdminTaskApi.getPendingSubmissions({
        page,
        limit: 10,
        sort: 'createdAt',
        order: 'asc'
      });
      if (response.success) {
        setSubmissions(response.data || []);
        setTotalPages(response.pagination?.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await platformAdminTaskApi.approveSubmission(id);
      fetchSubmissions();
      fetchStats();
      setViewDialogOpen(false);
    } catch (error) {
      console.error('Error approving submission:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (submission) => {
    setSelectedSubmission(submission);
    setRejectFeedback('');
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    try {
      setActionLoading(true);
      await platformAdminTaskApi.rejectSubmission(selectedSubmission._id, rejectFeedback);
      fetchSubmissions();
      fetchStats();
      setRejectDialogOpen(false);
      setViewDialogOpen(false);
    } catch (error) {
      console.error('Error rejecting submission:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type === 'image') return <ImageIcon fontSize="small" />;
    if (type === 'video') return <VideoFile fontSize="small" />;
    return <Description fontSize="small" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
            Review Submissions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review and approve student task submissions
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, mb: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AccessTime sx={{ color: '#f59e0b' }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{stats.pending}</Typography>
                <Typography variant="body2" color="text.secondary">Pending Review</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Check sx={{ color: '#10b981' }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{stats.approvedToday}</Typography>
                <Typography variant="body2" color="text.secondary">Approved Today</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Close sx={{ color: '#ef4444' }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>{stats.rejectedToday}</Typography>
                <Typography variant="body2" color="text.secondary">Rejected Today</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* Submissions Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : submissions.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              No pending submissions to review
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Task</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Points</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Files</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Submitted</TableCell>
                      <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission._id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: '#6366f1', width: 36, height: 36 }}>
                              {submission.user?.name?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {submission.user?.name || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {submission.user?.email}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {submission.task?.thumbnail && (
                              <Box
                                component="img"
                                src={submission.task.thumbnail.startsWith('http')
                                  ? submission.task.thumbnail
                                  : `${import.meta.env.VITE_API_URL.replace('/api', '')}${submission.task.thumbnail}`}
                                sx={{ width: 40, height: 40, borderRadius: 1, objectFit: 'cover' }}
                              />
                            )}
                            <Box>
                              <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 200 }} noWrap>
                                {submission.task?.title}
                              </Typography>
                              <Chip
                                label={submission.task?.activity}
                                size="small"
                                sx={{ fontSize: '0.65rem', height: 20 }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${submission.task?.scholarshipPoints || 0} SP`}
                            size="small"
                            sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5}>
                            {submission.files?.length > 0 ? (
                              submission.files.slice(0, 3).map((file, idx) => (
                                <Box key={idx} sx={{ color: 'text.secondary' }}>
                                  {getFileIcon(file.type)}
                                </Box>
                              ))
                            ) : (
                              <Typography variant="caption" color="text.secondary">No files</Typography>
                            )}
                            {submission.files?.length > 3 && (
                              <Typography variant="caption" color="text.secondary">
                                +{submission.files.length - 3}
                              </Typography>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(submission.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleView(submission)}
                            title="View Details"
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleApprove(submission._id)}
                            title="Approve"
                            sx={{ color: '#10b981' }}
                            disabled={actionLoading}
                          >
                            <Check fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleRejectClick(submission)}
                            title="Reject"
                            sx={{ color: '#ef4444' }}
                            disabled={actionLoading}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                  color="primary"
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Submission Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Stack spacing={3}>
              {/* Student Info */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Student
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: '#6366f1' }}>
                    {selectedSubmission.user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={600}>{selectedSubmission.user?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedSubmission.user?.email} | {selectedSubmission.user?.phone}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Task Info */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Task
                </Typography>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {selectedSubmission.task?.thumbnail && (
                      <Box
                        component="img"
                        src={selectedSubmission.task.thumbnail.startsWith('http')
                          ? selectedSubmission.task.thumbnail
                          : `${import.meta.env.VITE_API_URL.replace('/api', '')}${selectedSubmission.task.thumbnail}`}
                        sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                      />
                    )}
                    <Box>
                      <Typography fontWeight={600}>{selectedSubmission.task?.title}</Typography>
                      <Stack direction="row" spacing={1} mt={0.5}>
                        <Chip label={selectedSubmission.task?.activity} size="small" />
                        <Chip
                          label={`${selectedSubmission.task?.scholarshipPoints || 0} SP`}
                          size="small"
                          sx={{ bgcolor: '#fef3c7', color: '#b45309' }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </Card>
              </Box>

              {/* Student Comment */}
              {selectedSubmission.comment && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Student Comment
                  </Typography>
                  <Card variant="outlined" sx={{ p: 2, bgcolor: '#f8fafc' }}>
                    <Typography>{selectedSubmission.comment}</Typography>
                  </Card>
                </Box>
              )}

              {/* Submitted Files */}
              {selectedSubmission.files?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Submitted Files ({selectedSubmission.files.length})
                  </Typography>
                  <Stack spacing={1}>
                    {selectedSubmission.files.map((file, idx) => (
                      <Card key={idx} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {getFileIcon(file.type)}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {file.name}
                            </Typography>
                            {file.size && (
                              <Typography variant="caption" color="text.secondary">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </Typography>
                            )}
                          </Box>
                          <Button
                            size="small"
                            href={file.url.startsWith('http')
                              ? file.url
                              : `${import.meta.env.VITE_API_URL.replace('/api', '')}${file.url}`}
                            target="_blank"
                          >
                            View
                          </Button>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Rejection History */}
              {selectedSubmission.rejectionHistory?.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Previous Rejections ({selectedSubmission.rejectionHistory.length})
                  </Typography>
                  <Stack spacing={1}>
                    {selectedSubmission.rejectionHistory.map((rejection, idx) => (
                      <Alert key={idx} severity="warning" sx={{ py: 0.5 }}>
                        <Typography variant="body2">
                          {rejection.feedback || 'No feedback provided'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(rejection.rejectedAt)}
                        </Typography>
                      </Alert>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Close />}
            onClick={() => handleRejectClick(selectedSubmission)}
            disabled={actionLoading}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Check />}
            onClick={() => handleApprove(selectedSubmission._id)}
            disabled={actionLoading}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Reject Submission
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide feedback to help the student improve their submission (optional).
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Enter feedback for the student..."
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRejectDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Reject Submission'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskReviews;
