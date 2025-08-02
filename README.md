This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

Media Handling & Performance Techniques
Lazy Loading & Virtualization: Utilizes @shopify/flash-list for large list rendering, drastically reducing memory usage vs. vanilla FlatList.

Image Optimization: Uses react-native-fast-image for better caching, resize modes, and lower flicker than standard Image component.

Efficient Video Playback: Videos are loaded and played only when visible on screen; playback is paused automatically when scrolled off-screen or in background. Posters/thumbnails are displayed as placeholders during loading.

API & Data Handling:

API calls encapsulated in /api layer for separation from UI logic.

Pagination with “infinite scroll” and proper end detection.


Memoization: List items, and full-screen viewers are wrapped with React.memo and custom areEqual checks to minimize unnecessary renders.

Resource Management: Effects clean up correctly to avoid memory leaks (especially during async operations and component unmount).


Challenges Faced During Development
Balancing Performance vs. User Experience: Handling videos efficiently in a scrollable feed, ensuring only visible videos/frames consume resources, and preventing jank or memory leaks required careful coordination of viewability events and playback state.

Concurrent API Calls/Pagination: Ensuring pagination requests (especially fast scroll + fast network) never duplicate, while still surfacing errors and supporting retry flows.


Media Type Abstraction: Media objects from the API vary in structure—especially between photos, videos, and collections of each—requiring robust extraction and utility logic to always display the right asset without UI glitches.

Full-Screen Experience: Implementing a seamless transition from feed to full-screen preview, managing current indices, snap-to-item behavior, and modal navigation, all while preserving the full viewable state and avoiding React navigation complexity.


