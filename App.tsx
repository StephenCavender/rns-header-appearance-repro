import { DarkTheme, DefaultTheme, NavigationContainer, useTheme } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Appearance, Button, StyleSheet, Text, useColorScheme, View } from "react-native";

// Repro: on iOS 26, a visible native-stack header doesn't restyle when the app's
// light/dark appearance changes. See README.md.

type Params = { Home: undefined; Settings: undefined };

const Stack = createNativeStackNavigator<Params>();

export default function App() {
  // The navigation theme follows the app's appearance, so a change re-renders
  // every header with the other theme's colours and style.
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }: NativeStackScreenProps<Params, "Home">) {
  return (
    <Screen>
      <Button title="Open Settings" onPress={() => navigation.navigate("Settings")} />
    </Screen>
  );
}

function SettingsScreen() {
  return (
    <Screen>
      <Button title="Light" onPress={() => Appearance.setColorScheme("light")} />
      <Button title="Dark" onPress={() => Appearance.setColorScheme("dark")} />
      <Button title="System" onPress={() => Appearance.setColorScheme("auto")} />
    </Screen>
  );
}

/** Shows the app's current colour scheme, so the header can be compared with the content. */
function Screen({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>useColorScheme(): {String(scheme)}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
});
