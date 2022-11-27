import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Logo from "./components/Logo";

//containers
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import RoomScreen from "./containers/RoomScreen";
import AroundMeScreen from "./containers/AroundMeScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);

  // cette fonction sert a la création de compte et à la deconnexion, c'est l'équivalent de cookies
  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
      setUserToken(token);
    } else {
      await AsyncStorage.removeItem("userToken");
      setUserToken(null);
    }
  };

  // idem pour id qui nous servira dans ProfileScreen
  const setId = async (id) => {
    if (id) {
      await AsyncStorage.setItem("userId", id);
      setUserId(id);
    } else {
      await AsyncStorage.removeItem("userId");
      setUserId(null);
    }
  };

  useEffect(() => {
    // Recherche du token stocké pour naviguer vers les pages
    const checkIfTokenExists = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);
      setUserId(userId);
      setIsLoading(false);
    };

    checkIfTokenExists();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? null : userToken === null ? (
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignIn">
            {() => <SignInScreen setToken={setToken} setId={setId} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {() => <SignUpScreen setToken={setToken} setId={setId} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  // activeTintColor: "green",
                  // inactiveTintColor: "red",
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                  headerShown: false,
                }}
              >
                <Tab.Screen
                  name="HomeTab"
                  options={{
                    showLabel: false,
                    // tabBarShowLabel: false,

                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                        }}
                      >
                        {(props) => <HomeScreen {...props} />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Room"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                          headerBackVisible: false,
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="AroundMeTab"
                  options={{
                    tabBarLabel: "Around me",
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator screenOptions={{ headerShown: true }}>
                      <Stack.Screen
                        name="AroundMe"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                        }}
                      >
                        {(props) => <AroundMeScreen {...props} />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="Room"
                        component={RoomScreen}
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                        }}
                      />
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="ProfileTab"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="user" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator screenOptions={{ headerShown: true }}>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          headerTitle: () => <Logo size={"small"} />,
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            {...props}
                            userToken={userToken}
                            userId={userId}
                            setToken={setToken}
                            setId={setId}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
