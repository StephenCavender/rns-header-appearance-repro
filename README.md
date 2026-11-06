# iOS 26: transparent native-stack header over a ScrollView doesn't restyle on an appearance change

Minimal repro for react-native-screens. On iOS 26, when a screen has a transparent header (`headerTransparent: true`, which Expo Router's native stack uses by default on iOS 26) and a `ScrollView` under it, the header keeps its previous light/dark style after the app's appearance changes. The back button and title lag one change behind. The same screen with a plain `View` restyles correctly.

Expo SDK 58, React Native 0.88.1, react-native-screens 4.30.1, `@react-navigation/native-stack` 7.21.0, New Architecture. Everything is in [`App.tsx`](App.tsx): a native stack with transparent headers whose navigation theme follows `useColorScheme()`, and Light / Dark / System buttons that call `Appearance.setColorScheme`.

## Run

```sh
bun install
bunx expo start   # open it in Expo Go on an iOS 26 device
```

## Steps

1. With the device in light mode, tap **Open ScrollView screen**.
2. Tap **Dark**. The content turns dark; the header's back button and title keep the light style.
3. Tap **Light**, then **Dark** again. Each change shows the header in the style of the change before it.
4. Go back and open the screen again: the header now matches the current appearance.
5. Repeat on **Open View screen**: the header restyles with each change.

**Expected:** the header restyles together with the content, as it does over a plain `View`.

## Already tried

In the app this was found in (Expo Router's native stack, same versions):

- `headerTintColor` / `headerTitleStyle.color` set to `PlatformColor("label")`, so the colours resolve against the current trait collection.
- The same, plus `unstable_nativeProps.headerConfig.experimental_userInterfaceStyle: "unspecified"`, so the header follows the window's style instead of setting its own.
- Updating the navigation theme only after `Appearance`'s change event, once the window has the new style.

None of these changes the result. An opaque header (Expo Router's `enableLegacyHeaderAppearance()`) restyles correctly.
