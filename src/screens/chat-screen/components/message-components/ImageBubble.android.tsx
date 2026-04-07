import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import { LightBox, LightBoxProps } from '@alantoa/lightbox';
import { Image } from 'expo-image';
import { tailwind } from '@/theme';

const AnimatedExpoImage = Animated.createAnimatedComponent(Image);

type ImageCellProps = {
  imageSrc: string;
};

type ImageContainerProps = Pick<ImageCellProps, 'imageSrc'> &
  Pick<LightBoxProps, 'width' | 'height'>;

export const ImageBubbleContainer = (props: ImageContainerProps) => {
  const { imageSrc, height: lightboxH, width: lightboxW } = props;
  const [naturalSize, setNaturalSize] = useState({ width: lightboxW, height: lightboxH });

  return (
    <LightBox
      width={lightboxW}
      height={lightboxH}
      imgLayout={naturalSize}
      tapToClose={true}>
      <AnimatedExpoImage
        source={{ uri: imageSrc }}
        contentFit="cover"
        onLoad={(e) => {
          if (e.source.width && e.source.height) {
            setNaturalSize({ width: e.source.width, height: e.source.height });
          }
        }}
        style={[tailwind.style('h-full w-full bg-gray-100 overflow-hidden')]}
      />
    </LightBox>
  );
};

export const ImageBubble = (props: ImageCellProps) => {
  const { imageSrc } = props;

  return (
    <React.Fragment>
      <ImageBubbleContainer {...{ imageSrc }} width={300} height={215} />
    </React.Fragment>
  );
};
