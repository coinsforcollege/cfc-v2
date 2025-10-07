import type { Schema, Struct } from '@strapi/strapi';

export interface ContentCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_content_cta_banners';
  info: {
    description: 'Call-to-action banner with button';
    displayName: 'CTA Banner';
    icon: 'bullhorn';
  };
  attributes: {
    backgroundColor: Schema.Attribute.Enumeration<
      [
        'primary',
        'secondary',
        'success',
        'warning',
        'gradient-purple',
        'gradient-blue',
      ]
    > &
      Schema.Attribute.DefaultTo<'gradient-purple'>;
    buttonText: Schema.Attribute.String & Schema.Attribute.Required;
    buttonUrl: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentImage extends Struct.ComponentSchema {
  collectionName: 'components_content_images';
  info: {
    description: 'Single image with caption';
    displayName: 'Image';
    icon: 'picture';
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    width: Schema.Attribute.Enumeration<['full', 'large', 'medium', 'small']> &
      Schema.Attribute.DefaultTo<'full'>;
  };
}

export interface ContentImageSlider extends Struct.ComponentSchema {
  collectionName: 'components_content_image_sliders';
  info: {
    description: 'Multiple images in a slider/carousel';
    displayName: 'Image Slider';
    icon: 'images';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    interval: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3000>;
  };
}

export interface ContentQuote extends Struct.ComponentSchema {
  collectionName: 'components_content_quotes';
  info: {
    description: 'Blockquote with author attribution';
    displayName: 'Quote';
    icon: 'quote-right';
  };
  attributes: {
    author: Schema.Attribute.String;
    authorTitle: Schema.Attribute.String;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ContentRichText extends Struct.ComponentSchema {
  collectionName: 'components_content_text_blocks';
  info: {
    description: 'Text content with visual editor';
    displayName: 'Text Block';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface ContentTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_content_editor_blocks';
  info: {
    description: 'Text content with visual editor';
    displayName: 'Text Block';
    icon: 'align-left';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
  };
}

export interface ContentVideo extends Struct.ComponentSchema {
  collectionName: 'components_content_videos';
  info: {
    description: 'YouTube or Vimeo video embed';
    displayName: 'Video';
    icon: 'play-circle';
  };
  attributes: {
    aspectRatio: Schema.Attribute.Enumeration<['16:9', '4:3', '1:1']> &
      Schema.Attribute.DefaultTo<'16:9'>;
    title: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SeoMetaTags extends Struct.ComponentSchema {
  collectionName: 'components_seo_meta_tags';
  info: {
    description: 'SEO meta tags';
    displayName: 'Meta Tags';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.cta-banner': ContentCtaBanner;
      'content.image': ContentImage;
      'content.image-slider': ContentImageSlider;
      'content.quote': ContentQuote;
      'content.rich-text': ContentRichText;
      'content.text-block': ContentTextBlock;
      'content.video': ContentVideo;
      'seo.meta-tags': SeoMetaTags;
    }
  }
}
