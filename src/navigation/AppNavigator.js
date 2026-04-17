import React from "react";
import { Pressable, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MapScreen from "../screens/MapScreen";
import CacheDetailScreen from "../screens/CacheDetailScreen";
import CreateCacheScreen from "../screens/CreateCacheScreen";
import JoinEventScreen from "../screens/JoinEventScreen";
import CreateEventCacheScreen from "../screens/CreateEventCacheScreen";

import CreateEventScreen from "../screens/CreateEventScreen";
import EventLeaderboardScreen from "../screens/EventLeaderboardScreen";

import * as CacheListScreenModule from "../screens/CacheListScreen";
import * as LeaderboardScreenModule from "../screens/LeaderboardScreen";
import * as ProfileScreenModule from "../screens/ProfileScreen";

const CacheListScreen =
  CacheListScreenModule.default || CacheListScreenModule.CacheListScreen;

const LeaderboardScreen =
  LeaderboardScreenModule.default || LeaderboardScreenModule.LeaderboardScreen;

const ProfileScreen =
  ProfileScreenModule.default || ProfileScreenModule.ProfileScreen;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1e2d3d",
        },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#1e2d3d",
          borderTopColor: "#2e4057",
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Caches" component={CacheListScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1e2d3d",
          },
          headerTintColor: "#fff",
          contentStyle: {
            backgroundColor: "#0f1b2d",
          },
        }}
      >
        <Stack.Screen
          name="HomeTabs"
          component={MainTabs}
          options={({ navigation }) => ({
            title: "GeoQuest",
            headerRight: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable
                  onPress={() => navigation.navigate("JoinEvent")}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1, marginRight: 15 },
                  ]}
                >
                  <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                    Join
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("CreateCache")}
                  style={({ pressed }) => [
                    { opacity: pressed ? 0.7 : 1, marginRight: 8 },
                  ]}
                >
                  <Text style={{ color: "#4CAF50", fontWeight: "bold" }}>
                    Create
                  </Text>
                </Pressable>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="CacheDetail"
          component={CacheDetailScreen}
          options={{ title: "Cache Details" }}
        />
        <Stack.Screen
          name="CreateCache"
          component={CreateCacheScreen}
          options={{ title: "Create Cache" }}
        />
        <Stack.Screen
          name="JoinEvent"
          component={JoinEventScreen}
          options={{ title: "Join Event" }}
        />
        <Stack.Screen
          name="CreateEventCache"
          component={CreateEventCacheScreen}
          options={{ title: "Create Event Cache" }}
        />

        {/* --- NEW STACK SCREENS FOR OPTION B --- */}
        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{ title: "Host an Event" }}
        />
        <Stack.Screen
          name="EventLeaderboard"
          component={EventLeaderboardScreen}
          options={{ title: "Event Rankings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}