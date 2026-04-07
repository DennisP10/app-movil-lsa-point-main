import React from 'react';
import { StyleSheet } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { openURL } from '@/utils/urlUtils';

import { tailwind } from '@/theme';
import { MESSAGE_VARIANTS } from '@/constants';

type MarkdownBubbleProps = {
  messageContent: string;
  variant: string;
};

const variantTextMap = {
  [MESSAGE_VARIANTS.AGENT]: 'text-gray-950',
  [MESSAGE_VARIANTS.USER]: 'text-white',
  [MESSAGE_VARIANTS.BOT]: 'text-gray-950',
  [MESSAGE_VARIANTS.TEMPLATE]: 'text-gray-950',
  [MESSAGE_VARIANTS.ERROR]: 'text-white',
  [MESSAGE_VARIANTS.PRIVATE]: 'text-amber-950 font-inter-medium-24',
};

export const MarkdownBubble = (props: MarkdownBubbleProps) => {
  const { messageContent, variant } = props;
  const handleURL = (url: string) => {
    openURL({ URL: url });
    return true;
  };

  const textStyle = tailwind.style(variantTextMap[variant]);

  const styles = StyleSheet.create({
    text: {
      fontSize: 16,
      letterSpacing: 0.32,
      lineHeight: 22,
      ...textStyle,
    },
    strong: {
      fontFamily: 'Inter-600-20',
      fontWeight: '600',
    },
    em: {
      fontStyle: 'italic',
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 0,
      fontFamily: 'Inter-400-20',
    },
    bullet_list: {
      minWidth: 200,
    },
    ordered_list: {
      minWidth: 200,
    },
    list_item: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      ...textStyle,
    },
    blockquote: {
      backgroundColor: variant === MESSAGE_VARIANTS.USER ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.05)',
      borderColor: variant === MESSAGE_VARIANTS.USER ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
      borderLeftWidth: 4,
      marginLeft: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    code_inline: {
      backgroundColor: variant === MESSAGE_VARIANTS.USER ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
      color: variantTextMap[variant].includes('text-white') ? '#FFFFFF' : '#000000',
      borderRadius: 4,
      paddingHorizontal: 4,
      fontFamily: 'Inter-400-20',
    },
    code_block: {
      backgroundColor: variant === MESSAGE_VARIANTS.USER ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
      borderRadius: 4,
      padding: 8,
      fontFamily: 'Inter-400-20',
    },
    fence: {
      backgroundColor: variant === MESSAGE_VARIANTS.USER ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
      borderRadius: 4,
      padding: 8,
      fontFamily: 'Inter-400-20',
    },
    link: {
      color: variant === MESSAGE_VARIANTS.USER ? '#E0F2FE' : '#0284C7', // A lighter blue for the dark orange background, darker for light background
      textDecorationLine: 'underline',
    },
    bullet_list_icon: {
      marginLeft: 0,
      marginRight: 8,
      fontWeight: '900',
      ...textStyle,
    },
    ordered_list_icon: {
      marginLeft: 0,
      marginRight: 8,
      fontWeight: '900',
      ...textStyle,
    },
  });
  return (
    <Markdown
      mergeStyle
      markdownit={MarkdownIt({
        linkify: true,
        typographer: true,
      })}
      onLinkPress={handleURL}
      style={styles}>
      {messageContent}
    </Markdown>
  );
};
