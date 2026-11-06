import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  useTheme,
  type Theme,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Appearance,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from "react-native";

// Repro: on iOS 26, a visible native-stack header doesn't restyle when the app's
// light/dark appearance changes. See README.md.

type Params = { Home: undefined; SettingsView: undefined; SettingsScrollView: undefined };

const Stack = createNativeStackNavigator<Params>();

/** The app this was found in uses its own neutral palette instead of the defaults. */
const CUSTOM_LIGHT: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    card: "#ffffff",
    text: "#0a0a0a",
    border: "#e5e5e5",
    primary: "#171717",
  },
};
const CUSTOM_DARK: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0a0a0a",
    card: "#171717",
    text: "#fafafa",
    border: "#262626",
    primary: "#e5e5e5",
  },
};

export default function App() {
  // The navigation theme follows the app's appearance, so a change re-renders
  // every header with the other theme's colours and style.
  const scheme = useColorScheme();
  const [customColours, setCustomColours] = useState(false);
  const theme = customColours
    ? scheme === "dark"
      ? CUSTOM_DARK
      : CUSTOM_LIGHT
    : scheme === "dark"
      ? DarkTheme
      : DefaultTheme;
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              customColours={customColours}
              onCustomColoursChange={setCustomColours}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="SettingsView"
          component={SettingsView}
          options={{ title: "Settings (View)" }}
        />
        <Stack.Screen
          name="SettingsScrollView"
          component={SettingsScrollView}
          options={{ title: "Settings (ScrollView)" }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function HomeScreen({
  navigation,
  customColours,
  onCustomColoursChange,
}: NativeStackScreenProps<Params, "Home"> & {
  customColours: boolean;
  onCustomColoursChange: (value: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SchemeLabel />
      <View style={styles.row}>
        <Text style={{ color: colors.text }}>Custom header colours</Text>
        <Switch value={customColours} onValueChange={onCustomColoursChange} />
      </View>
      <Button title="Open Settings (View)" onPress={() => navigation.navigate("SettingsView")} />
      <Button
        title="Open Settings (ScrollView)"
        onPress={() => navigation.navigate("SettingsScrollView")}
      />
    </View>
  );
}

/** Plain View content: the header never sits over scrolled content. */
function SettingsView() {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SchemeLabel />
      <AppearanceButtons />
    </View>
  );
}

/** ScrollView content under the header, as most real screens have. */
function SettingsScrollView() {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.scrollContent}
      contentInsetAdjustmentBehavior="automatic"
    >
      <SchemeLabel />
      <AppearanceButtons />
    </ScrollView>
  );
}

function AppearanceButtons() {
  return (
    <>
      <Button title="Light" onPress={() => Appearance.setColorScheme("light")} />
      <Button title="Dark" onPress={() => Appearance.setColorScheme("dark")} />
      <Button title="System" onPress={() => Appearance.setColorScheme("auto")} />
    </>
  );
}

/** Shows the app's current colour scheme, so the header can be compared with the content. */
function SchemeLabel() {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  return <Text style={{ color: colors.text }}>useColorScheme(): {String(scheme)}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  scrollContent: { alignItems: "center", gap: 12, padding: 24 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
});
