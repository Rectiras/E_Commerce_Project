import React from 'react';
import {ActivityIndicator, SafeAreaView, View} from 'react-native';

function SplashScreen() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#343a40" />
      </View>
    </SafeAreaView>
  );
}

export default SplashScreen;
