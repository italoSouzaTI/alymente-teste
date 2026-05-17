import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MagnifyingGlass, PaintBrush } from 'phosphor-react-native';
import type { ExploreStackParamList, RootTabParamList } from './types';
import { SearchScreen } from '../../presentation/screens/SearchScreen';
import { RepoDetailScreen } from '../../presentation/screens/RepoDetailScreen';
import { IssuesScreen } from '../../presentation/screens/IssuesScreen';
import { ShowcaseScreen } from '../../presentation/screens/ShowcaseScreen';
import { useThemeMode } from '../../presentation/theme/ThemeModeContext';
import { darkColors, lightColors } from '../../presentation/components/ds/tokens';

const ExploreStack = createNativeStackNavigator<ExploreStackParamList>();
const RootTab = createBottomTabNavigator<RootTabParamList>();

function ExploreNavigator() {
  const { isDark } = useThemeMode();
  const c = isDark ? darkColors : lightColors;

  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: c.surfaceWhite },
        headerTintColor: c.primaryAction,
        headerTitleStyle: { color: c.onSurface, fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <ExploreStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'GitHub Explorer' }}
      />
      <ExploreStack.Screen
        name="RepoDetail"
        component={RepoDetailScreen}
        options={({ route }) => ({ title: route.params.repoName })}
      />
      <ExploreStack.Screen
        name="Issues"
        component={IssuesScreen}
        options={({ route }) => ({ title: `Issues · ${route.params.repoName}` })}
      />
    </ExploreStack.Navigator>
  );
}

export function RootNavigator() {
  const { isDark } = useThemeMode();
  const c = isDark ? darkColors : lightColors;
  const base = isDark ? DarkTheme : DefaultTheme;

  const navTheme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: c.primaryAction,
      background: c.background,
      card: c.surfaceWhite,
      text: c.onSurface,
      border: c.outlineVariant,
      notification: c.error,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <RootTab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: c.surfaceWhite,
            borderTopColor: c.outlineVariant,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: c.primaryAction,
          tabBarInactiveTintColor: c.onSurfaceVariant,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
          headerShown: false,
        }}
      >
        <RootTab.Screen
          name="Explore"
          component={ExploreNavigator}
          options={{
            title: 'Explorar',
            tabBarIcon: ({ color, size }) => (
              <MagnifyingGlass size={size} color={color} weight="regular" />
            ),
          }}
        />
        <RootTab.Screen
          name="Showcase"
          component={ShowcaseScreen}
          options={{
            title: 'Design System',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <PaintBrush size={size} color={color} weight="regular" />
            ),
          }}
        />
      </RootTab.Navigator>
    </NavigationContainer>
  );
}
