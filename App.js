import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
     <NavigationContainer>
      <Stack.Navigator>
          
          <Stack.Screen
            name="PageHome"
            component={HomeScreen}
            options={{
              headerShown: true, title: 'Home',
              headerStyle: {
                backgroundColor: '#a32620', // Change background color to your desired color
              },
              headerTintColor: '#fff', // Set the color of the back button and title text
              headerTitleStyle: {
                fontWeight: '500', // Optional: Set title font weight to bold
              },
              headerBackTitleVisible: false,
            }}
          />
        </Stack.Navigator>
     </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
