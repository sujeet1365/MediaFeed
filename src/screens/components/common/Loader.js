import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Loader = () => (
  <View style={styles.centered}>
    <ActivityIndicator color="#0ab" size="large" />
  </View>
);

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Loader;
