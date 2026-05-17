import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Stack interno da tab "Explorar"
export type ExploreStackParamList = {
  Search: undefined;
  RepoDetail: { owner: string; repo: string; repoName: string };
  Issues: { owner: string; repo: string; repoName: string };
};

// Tabs raiz
export type RootTabParamList = {
  Explore: undefined;
  Showcase: undefined;
};

// Props prontas para cada tela
export type SearchScreenProps = NativeStackScreenProps<ExploreStackParamList, 'Search'>;
export type RepoDetailScreenProps = NativeStackScreenProps<ExploreStackParamList, 'RepoDetail'>;
export type IssuesScreenProps = NativeStackScreenProps<ExploreStackParamList, 'Issues'>;
export type ShowcaseScreenProps = BottomTabScreenProps<RootTabParamList, 'Showcase'>;

// Navegação tipada para uso nos ViewModels / telas
export type ExploreNavigationProp = NativeStackNavigationProp<ExploreStackParamList>;
export type RootTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;
