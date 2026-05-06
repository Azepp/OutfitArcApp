import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { MaterialCommunityIcons, SimpleLineIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const c = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: c.backgroundSecondary,
          height: 70 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderColor: c.textSecondary + "20",
        },
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="h-10 w-16 items-center flex-row justify-center rounded-full">
              {focused ? <Octicons size={20} name="home-fill" color={color} /> : <Octicons size={20} name="home" color={color} />}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="outfits"
        options={{
          title: "Outfits",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="h-10 w-16 items-center flex-row justify-center rounded-full">
              <Ionicons size={20} name={focused ? "shirt" : "shirt-outline"} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="trending"
        options={{
          title: "Trending",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: () => (
            <LinearGradient
              colors={["#ff9a00", "#ff0000", "#ff5a00"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                backgroundColor: c.primary,
                width: 80,
                height: 80,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 40,
                shadowColor: c.primary,
                borderWidth: 4,
                borderColor: c.borderSecondary,
              }}
            >
              <LinearGradient
                colors={["#ff9a00", "#ff5a00", "#ff0000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  backgroundColor: c.primary,
                  width: 60,
                  height: 60,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SimpleLineIcons size={28} name="fire" color="#fff" />
              </LinearGradient>
            </LinearGradient>
          ),
        }}
      />

      <Tabs.Screen
        name="series"
        options={{
          title: "Series",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="h-10 w-16 items-center flex-row justify-center rounded-full">
              <Ionicons size={20} name={focused ? "layers" : "layers-outline"} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="characters"
        options={{
          title: "Characters",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="h-10 w-16 items-center flex-row justify-center rounded-full">
              <MaterialCommunityIcons size={20} name={focused ? "invoice-list" : "invoice-list-outline"} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
