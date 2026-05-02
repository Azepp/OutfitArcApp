import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColors } from "@/hooks/useColors";
import { View } from "react-native";
import { Typography } from "@/components/ui/typography";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function TabLayout() {
  const c = useColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: c.backgroundSecondary,
          height: 80,
          paddingTop: 6,
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
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="py-1 px-4 rounded-full">
              {focused ? <Octicons size={24} name="home-fill" color={color} /> : <Octicons size={24} name="home" color={color} />}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="keuangan"
        options={{
          title: "Keuangan",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="py-1 px-4 rounded-full">
              <Ionicons size={24} name={focused ? "wallet" : "wallet-outline"} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="qris"
        options={{
          title: "QRIS",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: () => (
            <LinearGradient
              colors={["#44A9DD", "#0a7ea4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                backgroundColor: c.primary,
                width: 100,
                height: 75,
                borderRadius: 100,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 50,
                shadowColor: c.primary,
                borderWidth: 4,
                borderColor: c.borderSecondary,
              }}
            >
              <LinearGradient
                colors={["#0a7ea4", "#44A9DD"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  backgroundColor: c.primary,
                  width: 80,
                  height: 60,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign size={28} name="scan" color="#fff" />
              </LinearGradient>
            </LinearGradient>
          ),
        }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="py-1 px-4 rounded-full">
              <MaterialCommunityIcons size={24} name={focused ? "invoice-list" : "invoice-list-outline"} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="py-1 px-4 rounded-full">
              <MaterialIcons size={24} name={focused ? "person" : "person-outline"} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
