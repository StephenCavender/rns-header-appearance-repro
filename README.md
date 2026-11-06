# iOS 26: visible native-stack header doesn't restyle on an appearance change

Minimal repro for react-native-screens: on iOS 26 the header of the screen that's on screen keeps its old light/dark style (back button, title, bar) when the app's appearance changes. The screen content restyles at once; the header only catches up when the screen is shown again.

Expo SDK 58, React Native 0.88.1, react-native-screens 4.30.1, `@react-navigation/native-stack` 7. New Architecture. Everything is in [`App.tsx`](App.tsx): a two-screen native stack whose navigation theme follows `useColorScheme()`, and Light / Dark / System buttons that call `Appearance.setColorScheme`.

## Run

```sh
bun install
bunx expo start   # open it in Expo Go on an iOS 26 device
```

## Steps

1. Start with the device in light mode. Tap **Open Settings**.
2. Tap **Dark**. The content turns dark; the header's back button and title keep the light style.
3. Tap **Light**, then **Dark** again. Each change shows the header in the style of the change before it.
4. Go back and open Settings again: the header now matches the current appearance.
5. Tap **System**, then switch the device between light and dark mode (Control Center) while Settings is open. The header doesn't follow either.

**Expected:** the header restyles together with the content.

## Already tried

In the app this was found in (Expo Router's native stack, same versions):
- `headerTintColor` / `headerTitleStyle.color` set to `PlatformColor("label")`, so the colours resolve against the current trait collection.
- The same, plus `unstable_nativeProps.headerConfig.experimental_userInterfaceStyle: "unspecified"`, so the header follows the window's style instead of setting its own.
- Updating the navigation theme only after `Appearance`'s change event, once the window has the new style.

None of these changes the result. Recreating the screen (`navigation.replace` with no animation) fixes changes made from inside the app, but not a device appearance change.
