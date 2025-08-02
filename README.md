**Overview of Implementation**


This project is a React Native media feed app featuring efficient display, interactive preview, and smooth full-screen viewing of both images and videos. The codebase is organized with a modular architecture for maximum maintainability, separating UI, business logic, API, and utility code. Key features include:

Optimized media fetching with paginated REST API from Pexels.

Fast and responsive scrolling (via @shopify/flash-list).

Lazy loading and memory-efficient handling of images (react-native-fast-image) and videos (react-native-video).

Video playback paused/resumed based on visibility for battery and bandwidth savings.

Clean UI/UX with error handling, loaders, and retry.

# Getting Started

**Instructions to Run the App**

1. Clone the repository
2. Install dependencies
    cd <project-directory>
      npm install
   cd ios && pod install
3. Run the app
   npm start 
   or
   # For Android
   npx react-native run-android
   # For iOS
   npx react-native run-ios

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.



**Media Handling & Performance Techniques**

Lazy Loading & Virtualization: Utilizes @shopify/flash-list for large list rendering, drastically reducing memory usage vs. vanilla FlatList.

Image Optimization: Uses react-native-fast-image for better caching, resize modes, and lower flicker than standard Image component.

Efficient Video Playback: Videos are loaded and played only when visible on screen; playback is paused automatically when scrolled off-screen or in background. Posters/thumbnails are displayed as placeholders during loading.

**API & Data Handling:**

API calls encapsulated in /api layer for separation from UI logic.

Pagination with “infinite scroll” and proper end detection.


**Memoization:** List items, and full-screen viewers are wrapped with React.memo and custom areEqual checks to minimize unnecessary renders.

**Resource Management:** Effects clean up correctly to avoid memory leaks (especially during async operations and component unmount).


**Challenges Faced During Development**
Balancing Performance vs. User Experience: Handling videos efficiently in a scrollable feed, ensuring only visible videos/frames consume resources, and preventing jank or memory leaks required careful coordination of viewability events and playback state.

Concurrent API Calls/Pagination: Ensuring pagination requests (especially fast scroll + fast network) never duplicate, while still surfacing errors and supporting retry flows.


Media Type Abstraction: Media objects from the API vary in structure—especially between photos, videos, and collections of each—requiring robust extraction and utility logic to always display the right asset without UI glitches.

Full-Screen Experience: Implementing a seamless transition from feed to full-screen preview, managing current indices, snap-to-item behavior, and modal navigation, all while preserving the full viewable state and avoiding React navigation complexity.


