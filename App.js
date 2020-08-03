import React, { useState } from 'react';
import { View, Text, I18nManager, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import AppContainer from './src/navigations/AppNavigation';
import FlashMessage from "react-native-flash-message";



export default function App() {
  return (
     <View style={{ flex: 1 }}>
      <AppContainer />
        <FlashMessage position="top" />    
      </View>
     
  )
}

