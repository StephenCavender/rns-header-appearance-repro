import { DarkTheme, DefaultTheme, NavigationContainer, useTheme } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Appearance, Button, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

// Repro: on iOS 26, a transparent native-stack header over a ScrollView doesn't
// restyle when the app's light/dark appearance changes. See README.md.

type Params = { Home: undefined; ScrollViewScreen: undefined; ViewScreen: undefined };

const Stack = createNativeStackNavigator<Params>();

export default function App() {
  // The navigation theme follows the app's appearance, so a change re-renders
  // every header with the other theme's style.
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* Transparent headers, as Expo Router's native stack uses on iOS 26. */}
      <Stack.Navigator screenOptions={{ headerTransparent: true }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="ScrollViewScreen"
          component={ScrollViewScreen}
          options={{ title: "ScrollView (bug)" }}
        />
        <Stack.Screen name="ViewScreen" component={ViewScreen} options={{ title: "View (works)" }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }: NativeStackScreenProps<Params, "Home">) {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SchemeLabel />
      <Button
        title="Open ScrollView screen"
        onPress={() => navigation.navigate("ScrollViewScreen")}
      />
      <Button title="Open View screen" onPress={() => navigation.navigate("ViewScreen")} />
    </View>
  );
}

/** The header sits over a ScrollView: it keeps the previous appearance after a change. */
function ScrollViewScreen() {
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

/** The same screen with a plain View: the header restyles correctly. */
function ViewScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SchemeLabel />
      <AppearanceButtons />
    </View>
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
});
