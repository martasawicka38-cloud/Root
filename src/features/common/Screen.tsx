import { PropsWithChildren } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { colors } from "../../styles/tokens";

type ScreenProps = PropsWithChildren<{
  padded?: boolean;
}>;

export function Screen({ children, padded = true }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <View style={styles.mobileContainer}>
          <ScrollView
            contentContainerStyle={[styles.content, padded && styles.padded]}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.slate100,
  },
  root: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.slate100,
  },
  mobileContainer: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    backgroundColor: colors.white,
    overflow: Platform.OS === "web" ? "hidden" : "visible",
  },
  content: {
    flexGrow: 1,
  },
  padded: {
    padding: 16,
    gap: 12,
  },
});
