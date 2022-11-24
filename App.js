import React, { useState, useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import SplashScreen from "./containers/SplashScreen";
import RoomScreen from "./containers/RoomScreen";
import AroundMeScreen from "./containers/AroundMeScreen";
import MyProfilScreen from "./containers/MyProfilScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  // cette fonction sert a la création de compte et à la deconnexion, c'est l'équivalent de cookies
  const setToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const checkIfTokenExists = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);

      setIsLoading(false);
    };

    checkIfTokenExists();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Tab">
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignUp">
              {() => <SignUpScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <>
            <Stack.Screen name="Tab" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: "tomato",
                    tabBarInactiveTintColor: "gray",
                  }}
                >
                  {/***************** TAB SCREEN POUR HOME (HOME, PROFIL et ROOM) ***************/}

                  <Tab.Screen
                    name="TabHome"
                    options={{
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
                          headerShown
                          options={{
                            headerTitleStyle: { color: "#fff" },
                            headerTitle: (
                              props // AJOUT DU LOGO DANS LE HEADER
                            ) => (
                              <Image
                                style={{ width: 200, height: 40 }}
                                source={require("./assets/logo.png")}
                                resizeMode="contain"
                              />
                            ),
                            title: "My home",
                            headerStyle: { backgroundColor: "white" },
                            headerTitleStyle: { color: "white" },
                          }}
                        >
                          {() => <HomeScreen />}
                        </Stack.Screen>

                        <Stack.Screen
                          name="Profile"
                          options={{
                            title: "User Profile",
                          }}
                        >
                          {() => <ProfileScreen />}
                        </Stack.Screen>

                        <Stack.Screen
                          name="Room"
                          options={{
                            title: "Room",
                          }}
                        >
                          {() => <RoomScreen />}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>

                  {/***************** TAB SCREEN POUR AROUND ME  ***************/}

                  <Tab.Screen
                    name="TabAround"
                    options={{
                      tabBarLabel: "Around me",

                      tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                          name="map-marker-outline"
                          size={24}
                          color="grey"
                        />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="AroundMe"
                          options={{
                            title: "Around me",
                          }}
                        >
                          {() => <AroundMeScreen setToken={setToken} />}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>

                  {/***************** TAB SCREEN POUR MY PROFILE  ***************/}

                  <Tab.Screen
                    name="TabProfil"
                    options={{
                      tabBarLabel: "My profil",

                      tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={24} color="grey" />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="MyProfil"
                          options={{
                            title: "My profil",
                          }}
                        >
                          {() => <MyProfilScreen setToken={setToken} />}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>

                  {/***************** TAB SCREEN POUR SETTINGS  ***************/}

                  <Tab.Screen
                    name="TabSettings"
                    options={{
                      tabBarLabel: "Settings",
                      tabBarIcon: ({ color, size }) => (
                        <Ionicons
                          name={"ios-options"}
                          size={size}
                          color={color}
                        />
                      ),
                    }}
                  >
                    {() => (
                      <Stack.Navigator>
                        <Stack.Screen
                          name="Settings"
                          options={{
                            title: "Settings",
                          }}
                        >
                          {() => <SettingsScreen setToken={setToken} />}
                        </Stack.Screen>
                      </Stack.Navigator>
                    )}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  cover: { height: 300, width: 200, marginTop: 100 },
});
