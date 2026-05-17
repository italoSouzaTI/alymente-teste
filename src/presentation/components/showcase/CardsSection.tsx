import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { spacing } from '@ds/tokens';
import { Card } from '@ds/Card';
import { Text } from '@ds/Text';
import { ShowcaseSection } from './ShowcaseSection';

export function CardsSection() {
  return (
    <ShowcaseSection title="CARDS">
      <View style={styles.col}>
        <Card>
          <Text variant="headlineSm">Card estático</Text>
          <Text variant="bodySm" color="muted">
            Sem ação — apenas exibe conteúdo com borda e fundo themed.
          </Text>
        </Card>

        <Card onPress={() => Alert.alert('Card pressionado!')}>
          <Text variant="headlineSm">Card pressable</Text>
          <Text variant="bodySm" color="muted">
            Pressione para ver a resposta. O fundo escurece suavemente no press.
          </Text>
        </Card>
      </View>
    </ShowcaseSection>
  );
}

const styles = StyleSheet.create({
  col: { gap: spacing.sm },
});
