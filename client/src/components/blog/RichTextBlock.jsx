import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { colors } from '../../utils/designTokens';

const RichTextBlock = ({ data }) => {
  console.log('RichTextBlock data:', data);

  // Parse HTML and wrap in a styled container
  const renderHTML = useMemo(() => {
    if (!data?.body) return null;

    // If body is a string (CKEditor HTML), render it directly
    if (typeof data.body === 'string') {
      return (
        <Box
          sx={{
            mb: 4,
            // Typography styles
            '& p': {
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: colors.neutral[700],
              marginBottom: '1rem',
              marginTop: 0,
            },
            // Heading styles
            '& h1': {
              fontSize: '2.5rem',
              fontWeight: 700,
              marginTop: '2.5rem',
              marginBottom: '1rem',
              color: colors.neutral[900],
              lineHeight: 1.2,
            },
            '& h2': {
              fontSize: '2rem',
              fontWeight: 700,
              marginTop: '2rem',
              marginBottom: '1rem',
              color: colors.neutral[900],
              lineHeight: 1.2,
            },
            '& h3': {
              fontSize: '1.5rem',
              fontWeight: 600,
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              color: colors.neutral[900],
              lineHeight: 1.3,
            },
            '& h4': {
              fontSize: '1.25rem',
              fontWeight: 600,
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
              color: colors.neutral[900],
              lineHeight: 1.4,
            },
            '& h5': {
              fontSize: '1.125rem',
              fontWeight: 600,
              marginTop: '1rem',
              marginBottom: '0.5rem',
              color: colors.neutral[900],
              lineHeight: 1.4,
            },
            '& h6': {
              fontSize: '1rem',
              fontWeight: 600,
              marginTop: '0.75rem',
              marginBottom: '0.25rem',
              color: colors.neutral[900],
              lineHeight: 1.4,
            },
            // List styles
            '& ul, & ol': {
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
              marginTop: 0,
            },
            '& li': {
              fontSize: '1.125rem',
              lineHeight: 1.8,
              color: colors.neutral[700],
              marginBottom: '0.5rem',
            },
            '& li p': {
              marginBottom: '0.5rem',
            },
            // Link styles
            '& a': {
              color: '#8b5cf6',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': {
                color: '#ec4899',
                textDecoration: 'underline',
              },
            },
            // Blockquote styles
            '& blockquote': {
              borderLeft: `4px solid #8b5cf6`,
              paddingLeft: '1.5rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              marginTop: '1rem',
              marginBottom: '1rem',
              marginLeft: 0,
              marginRight: 0,
              background: 'rgba(139, 92, 246, 0.05)',
              fontStyle: 'italic',
              color: colors.neutral[700],
            },
            '& blockquote p': {
              marginBottom: '0.5rem',
              '&:last-child': {
                marginBottom: 0,
              },
            },
            // Code styles
            '& code': {
              background: colors.neutral[100],
              color: colors.neutral[900],
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              fontSize: '0.9em',
              fontFamily: 'monospace',
            },
            '& pre': {
              background: colors.neutral[900],
              color: colors.neutral[50],
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              marginBottom: '1rem',
              marginTop: '1rem',
            },
            '& pre code': {
              background: 'transparent',
              color: 'inherit',
              padding: 0,
              fontSize: '0.9rem',
            },
            // Image styles
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '8px',
              marginTop: '1rem',
              marginBottom: '1rem',
              display: 'block',
            },
            // Table styles
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1rem',
              marginBottom: '1rem',
              fontSize: '1rem',
            },
            '& th': {
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: 600,
              color: colors.neutral[900],
              borderBottom: `2px solid ${colors.neutral[200]}`,
            },
            '& td': {
              padding: '0.75rem',
              borderBottom: `1px solid ${colors.neutral[200]}`,
              color: colors.neutral[700],
            },
            '& tr:hover': {
              background: 'rgba(139, 92, 246, 0.02)',
            },
            // Horizontal rule
            '& hr': {
              border: 'none',
              borderTop: `1px solid ${colors.neutral[200]}`,
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            // Strong and emphasis
            '& strong': {
              fontWeight: 600,
              color: colors.neutral[900],
            },
            '& em': {
              fontStyle: 'italic',
            },
            // First paragraph no top margin
            '& > p:first-of-type': {
              marginTop: 0,
            },
            // Last element no bottom margin
            '& > *:last-child': {
              marginBottom: 0,
            },
          }}
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      );
    }

    // Legacy support: If body is still in blocks format (array), handle it
    // This ensures backward compatibility with existing content
    console.warn('RichTextBlock: Received blocks format instead of HTML. Consider migrating to CKEditor.');
    return null;
  }, [data?.body]);

  return renderHTML;
};

export default RichTextBlock;

