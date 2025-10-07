import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Send, Reply, Person } from '@mui/icons-material';
import { blogApi } from '../../api/blog.api';
import { colors, borderRadius } from '../../utils/designTokens';
import { useToast } from '../../contexts/ToastContext';

const CommentsSection = ({ postSlug }) => {
  const { showToast } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  });

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getComments(postSlug);
      if (response.success) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, parentCommentId = null) => {
    e.preventDefault();
    
    if (!formData.content.trim() || !formData.authorName.trim() || !formData.authorEmail.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const response = await blogApi.createComment(postSlug, {
        ...formData,
        parentCommentId
      });
      
      if (response.success) {
        showToast('Comment submitted successfully! It will appear after approval.', 'success');
        setFormData({ authorName: '', authorEmail: '', content: '' });
        setReplyingTo(null);
      }
    } catch (error) {
      showToast(error.message || 'Failed to submit comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment, depth = 0) => {
    const isReplying = replyingTo === comment.id;

    return (
      <Box key={comment.id} sx={{ ml: depth > 0 ? { xs: 2, md: 4 } : 0, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar sx={{ background: colors.neutral[400], width: 40, height: 40 }}>
            <Person />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {comment.authorName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: colors.neutral[700], lineHeight: 1.7, mb: 1.5 }}>
              {comment.content}
            </Typography>
            
            {depth < 2 && (
              <Button
                size="small"
                startIcon={<Reply sx={{ fontSize: 16 }} />}
                onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                sx={{
                  color: colors.neutral[600],
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  p: 0,
                  minWidth: 0
                }}
              >
                {isReplying ? 'Cancel' : 'Reply'}
              </Button>
            )}

            {isReplying && (
              <Box component="form" onSubmit={(e) => handleSubmit(e, comment.id)} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Write your reply..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  sx={{ mb: 1.5 }}
                  size="small"
                />
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <TextField
                    placeholder="Your name"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    type="email"
                    placeholder="Your email"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    size="small"
                    sx={{
                      background: colors.neutral[900],
                      '&:hover': {
                        background: colors.neutral[800]
                      }
                    }}
                  >
                    {submitting ? <CircularProgress size={16} /> : 'Reply'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {comment.replies && comment.replies.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Comments ({comments.length})
      </Typography>

      {/* New Comment Form */}
      <Box sx={{ mb: 4, pb: 4, borderBottom: `1px solid ${colors.neutral[200]}` }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Leave a Comment
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your thoughts..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            sx={{ mb: 2 }}
            required
          />
          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              placeholder="Your name *"
              value={formData.authorName}
              onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
              sx={{ flex: 1, minWidth: 200 }}
              required
            />
            <TextField
              type="email"
              placeholder="Your email *"
              value={formData.authorEmail}
              onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
              sx={{ flex: 1, minWidth: 200 }}
              required
            />
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Your comment will be reviewed before being published.
          </Alert>
          <Button
            type="submit"
            variant="contained"
            endIcon={<Send />}
            disabled={submitting}
            sx={{
              background: colors.neutral[900],
              px: 4,
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: colors.neutral[800]
              }
            }}
          >
            {submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Post Comment'}
          </Button>
        </Box>
      </Box>

      {/* Comments List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
        </Box>
      ) : (
        <Box>
          {comments.map((comment) => renderComment(comment))}
        </Box>
      )}
    </Box>
  );
};

export default CommentsSection;
