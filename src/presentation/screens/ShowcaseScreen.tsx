import React from 'react';
import type { ShowcaseScreenProps } from '../../infrastructure/navigation/types';
import {
  AvatarsSection,
  BadgesSection,
  ButtonsSection,
  CardsSection,
  ColorPaletteSection,
  InputsSection,
  ShowcaseHeader,
  ShowcaseLayout,
  TypographySection,
} from '../components/showcase';

export function ShowcaseScreen(_: ShowcaseScreenProps) {
  return (
    <ShowcaseLayout>
      <ShowcaseHeader />
      <ColorPaletteSection />
      <TypographySection />
      <ButtonsSection />
      <InputsSection />
      <CardsSection />
      <BadgesSection />
      <AvatarsSection />
    </ShowcaseLayout>
  );
}
