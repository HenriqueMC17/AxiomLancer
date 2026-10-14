import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  HeroSectionComponent,
  SocialProofComponent,
  PersonaSelectorComponent,
  BentoFeaturesComponent,
  TechSpecsComponent,
  RoiCalculatorComponent,
  PanicSandboxComponent,
  PricingMatrixComponent,
  FaqAccordionComponent,
  LandingFooterComponent,
} from '../../features/landing/components';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    SocialProofComponent,
    PersonaSelectorComponent,
    BentoFeaturesComponent,
    TechSpecsComponent,
    RoiCalculatorComponent,
    PanicSandboxComponent,
    PricingMatrixComponent,
    FaqAccordionComponent,
    LandingFooterComponent,
  ],
  template: `
    <app-hero-section />
    <app-social-proof />
    <app-persona-selector />
    <app-bento-features />
    <app-tech-specs />
    <app-roi-calculator />
    <app-panic-sandbox />
    <app-pricing-matrix />
    <app-faq-accordion />
    <app-landing-footer />
  `,
})
export class LandingPageComponent {}
