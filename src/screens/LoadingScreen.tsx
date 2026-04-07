import React from 'react';
import { View, Image } from 'react-native';
import { Spinner } from '../components-next/spinner';
import { tailwind } from '../theme';

const logo = require('../assets/images/logo.png');

const LoadingScreen = () => {
  return (
    <View style={tailwind.style('flex-1 items-center justify-center bg-white')}>
      <Image
        source={logo}
        style={{ width: 120, height: 120, marginBottom: 24 }}
        resizeMode="contain"
      />
      <Spinner size={40} stroke="#F27D27" />
    </View>
  );
};

export default LoadingScreen;
