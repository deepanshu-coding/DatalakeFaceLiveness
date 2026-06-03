import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import StatusScreen from './screens/StatusScreen';
import DatabaseService from './services/DatabaseService';

const Stack = createStackNavigator();

const App: React.FC = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    await DatabaseService.init();
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
            shadowOpacity: 0,
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#E1DFDD'
          },
          headerTitleStyle: {
            color: '#323130',
            fontSize: 18,
            fontWeight: '600'
          },
          headerTintColor: '#0078D4',
          headerBackTitle: 'Back'
        }}>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Datalake Liveness' }}
        />
        <Stack.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Face Verification' }}
        />
        <Stack.Screen 
          name="Status" 
          component={StatusScreen} 
          options={{ title: 'Sync Status' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
