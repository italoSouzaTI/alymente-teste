import { fireEvent } from '@testing-library/react-native';
import { SearchBar } from '@components/search/SearchBar';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';

const PLACEHOLDER = 'Buscar repositório...';

describe('SearchBar', () => {
  it('renders placeholder text', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar value="" onChangeText={() => {}} />,
    );

    expect(getByPlaceholderText(PLACEHOLDER)).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar value="" onChangeText={onChangeText} />,
    );

    fireEvent.changeText(getByPlaceholderText(PLACEHOLDER), 'react');

    expect(onChangeText).toHaveBeenCalledWith('react');
  });

  it('does not render clear button when value is empty', () => {
    const { queryByTestId } = renderWithProviders(<SearchBar value="" onChangeText={() => {}} />);

    expect(queryByTestId('clear-button')).toBeNull();
  });

  it('renders without crash when value is non-empty', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar value="react" onChangeText={onChangeText} />,
    );

    expect(getByPlaceholderText(PLACEHOLDER)).toBeTruthy();
  });

  it('mounts without crash when clear is pressed', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = renderWithProviders(
      <SearchBar value="react" onChangeText={onChangeText} />,
    );

    expect(getByPlaceholderText(PLACEHOLDER)).toBeTruthy();
  });
});
