import { HapticTab } from "@/components/haptic-tab";
import { Typography } from "@/components/ui/typography";
import { useColors } from "@/hooks/useColors";
import { storage } from "@/lib/storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminTabsLayout() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  // const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  // useEffect(() => {
  //   storage.getBoolean("isAdmin").then(setIsAdmin);
  // }, []);

  // if (isAdmin === undefined) return null;
  // if (!isAdmin) return <Redirect href="/admin/login" />;

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
          title: "Dashboard",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="h-10 w-16 items-center flex-row justify-center rounded-full">
              <Ionicons size={20} name={focused ? "grid" : "grid-outline"} color={color} />
            </View>
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
              <MaterialCommunityIcons size={20} name={focused ? "account-group" : "account-group-outline"} color={color} />
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
        name="products"
        options={{
          title: "Products",
          tabBarLabel: ({ focused, children }) => (
            <Typography variant="label" weight={focused ? "semibold" : "regular"} color={c.textSecondary} className="mt-2">
              {children}
            </Typography>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ backgroundColor: focused ? c.primary + "20" : "transparent" }} className="h-10 w-16 items-center flex-row justify-center rounded-full">
              <Ionicons size={20} name={focused ? "bag" : "bag-outline"} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
