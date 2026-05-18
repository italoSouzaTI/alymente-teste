import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ExploreStackParamList } from './types';
import { SearchScreen } from '@screens/SearchScreen';
import { RepoDetailScreen } from '@screens/RepoDetailScreen';
import { IssuesScreen } from '@screens/IssuesScreen';
import { useThemeMode } from '@theme/ThemeModeContext';
import { darkColors, lightColors } from '@ds/tokens';

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreNavigator() {
  const { isDark } = useThemeMode();
  const c = isDark ? darkColors : lightColors;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: c.surfaceWhite },
        headerTintColor: c.primaryAction,
        headerTitleStyle: { color: c.onSurface, fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'GitHub Explorer' }} />
      <Stack.Screen
        name="RepoDetail"
        component={RepoDetailScreen}
        options={({ route }) => ({ title: route.params.repoName })}
      />
      <Stack.Screen
        name="Issues"
        component={IssuesScreen}
        options={({ route }) => ({ title: `Issues · ${route.params.repoName}` })}
      />
    </Stack.Navigator>
  );
}
