import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../styles/tokens";

export default function WelcomeScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.phone}>
        <LinearGradient
          colors={["#4B5F2B", "#3A4A1F", "#293211"]}
          locations={[0, 0.4, 1]}
          style={styles.gradient}
        >
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/Firefly.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>Witaj w ROOT</Text>

              <Text style={styles.description}>
                Kazdy krok, kazda eko-deklaracja i kazda aktywnosc fizyczna
                przybliza Cie do lepszej wersji siebie i zdrowszej planety.
              </Text>

              <Pressable
                style={styles.button}
                onPress={() => router.push("/(auth)/register")}
              >
                <Text style={styles.buttonText}>Chodz dalej {">"}</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.slate100,
  },
  phone: {
    flex: 1,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 480 : undefined,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: 112,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 380,
    height: 380,
  },
  content: {
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.slate100,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: colors.slate100,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.85,
  },
  button: {
    backgroundColor: colors.slate100,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.brownDark,
  },
});
