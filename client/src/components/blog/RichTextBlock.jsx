import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/designTokens';

const RichTextBlock = ({ data }) => {
  console.log('RichTextBlock data:', data);
  
  const renderBlock = (block) => {
    if (!block || !block.type) return null;

    const renderChildren = (children) => {
      if (!children) return null;
      return children.map((child, idx) => {
        if (child.type === 'text') {
          let text = child.text;
          if (child.bold) text = <strong key={idx}>{text}</strong>;
          if (child.italic) text = <em key={idx}>{text}</em>;
          if (child.underline) text = <u key={idx}>{text}</u>;
          if (child.strikethrough) text = <s key={idx}>{text}</s>;
          if (child.code) text = <code key={idx}>{text}</code>;
          return text;
        }
        if (child.type === 'link') {
          return (
            <a key={idx} href={child.url} target="_blank" rel="noopener noreferrer">
              {renderChildren(child.children)}
            </a>
          );
        }
        return null;
      });
    };

    switch (block.type) {
      case 'paragraph':
        return (
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.125rem', 
              lineHeight: 1.8, 
              color: colors.neutral[700], 
              mb: 2 
            }}
          >
            {renderChildren(block.children)}
          </Typography>
        );
      
      case 'heading':
        const level = block.level || 1;
        const headingStyles = {
          1: { fontSize: '2.5rem', fontWeight: 700, mt: 5, mb: 2 },
          2: { fontSize: '2rem', fontWeight: 700, mt: 4, mb: 2 },
          3: { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 1.5 },
          4: { fontSize: '1.25rem', fontWeight: 600, mt: 2.5, mb: 1 },
          5: { fontSize: '1.125rem', fontWeight: 600, mt: 2, mb: 1 },
          6: { fontSize: '1rem', fontWeight: 600, mt: 1.5, mb: 0.5 }
        };
        return (
          <Typography 
            variant={`h${level}`}
            sx={{ 
              ...headingStyles[level],
              color: colors.neutral[900]
            }}
          >
            {renderChildren(block.children)}
          </Typography>
        );
      
      case 'list':
        const ListComponent = block.format === 'ordered' ? 'ol' : 'ul';
        return (
          <Box 
            component={ListComponent}
            sx={{ 
              pl: 3, 
              mb: 2,
              '& li': {
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: colors.neutral[700],
                mb: 0.5
              }
            }}
          >
            {block.children?.map((item, idx) => (
              <li key={idx}>
                {renderChildren(item.children)}
              </li>
            ))}
          </Box>
        );
      
      case 'quote':
        return (
          <Box 
            component="blockquote"
            sx={{ 
              borderLeft: `4px solid ${colors.primary[500]}`,
              pl: 3,
              py: 1,
              my: 2,
              background: colors.primary[50],
              fontStyle: 'italic',
              color: colors.neutral[700]
            }}
          >
            <Typography variant="body1" sx={{ fontSize: '1.125rem', lineHeight: 1.8 }}>
              {renderChildren(block.children)}
            </Typography>
          </Box>
        );
      
      case 'code':
        return (
          <Box 
            component="pre"
            sx={{ 
              background: colors.neutral[900],
              color: colors.neutral[50],
              p: 2,
              borderRadius: 2,
              overflow: 'auto',
              mb: 2,
              fontSize: '0.9rem',
              fontFamily: 'monospace'
            }}
          >
            <code>{block.children?.[0]?.text || ''}</code>
          </Box>
        );
      
      case 'image':
        return (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <img 
              src={block.image?.url} 
              alt={block.image?.alternativeText || ''} 
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (!data.body || !Array.isArray(data.body)) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      {data.body.map((block, index) => (
        <React.Fragment key={index}>
          {renderBlock(block)}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default RichTextBlock;

