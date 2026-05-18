import { MagnifyingGlassIcon, PaintBrushIcon } from 'phosphor-react-native';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from './types';
import { ShowcaseScreen } from '@screens/ShowcaseScreen';
import { useThemeMode } from '@theme/ThemeModeContext';
import { darkColors, lightColors } from '@ds/tokens';
import { ExploreNavigator } from './ExploreNavigator';

const Tab = createBottomTabNavigator<RootTabParamList>();

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
      <Tab.Navigator
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
        <Tab.Screen
          name="Explore"
          component={ExploreNavigator}
          options={{
            title: 'Explorar',
            tabBarIcon: ({ color, size }) => (
              <MagnifyingGlassIcon size={size} color={color} weight="regular" />
            ),
          }}
        />
        <Tab.Screen
          name="Showcase"
          component={ShowcaseScreen}
          options={{
            title: 'Design System',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <PaintBrushIcon size={size} color={color} weight="regular" />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
