import { MagnifyingGlassIcon, PaintBrushIcon } from 'phosphor-react-native';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ExploreStackParamList, RootTabParamList } from './types';
import { SearchScreen } from '@screens/SearchScreen';
import { RepoDetailScreen } from '@screens/RepoDetailScreen';
import { IssuesScreen } from '@screens/IssuesScreen';
import { ShowcaseScreen } from '@screens/ShowcaseScreen';
import { useThemeMode } from '@theme/ThemeModeContext';
import { darkColors, lightColors } from '@ds/tokens';

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
              <MagnifyingGlassIcon size={size} color={color} weight="regular" />
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
              <PaintBrushIcon size={size} color={color} weight="regular" />
            ),
          }}
        />
      </RootTab.Navigator>
    </NavigationContainer>
  );
}
