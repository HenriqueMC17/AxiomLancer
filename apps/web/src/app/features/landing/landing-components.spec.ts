import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HeroSectionComponent } from './components/hero-section.component';
import { SocialProofComponent } from './components/social-proof.component';
import { PersonaSelectorComponent } from './components/persona-selector.component';
import { BentoFeaturesComponent } from './components/bento-features.component';
import { RoiCalculatorComponent } from './components/roi-calculator.component';
import { PanicSandboxComponent } from './components/panic-sandbox.component';
import { PricingMatrixComponent } from './components/pricing-matrix.component';
import { LandingFooterComponent } from './components/landing-footer.component';

describe('Landing Feature Components', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroSectionComponent,
        SocialProofComponent,
        PersonaSelectorComponent,
        BentoFeaturesComponent,
        RoiCalculatorComponent,
        PanicSandboxComponent,
        PricingMatrixComponent,
        LandingFooterComponent,
      ],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should create HeroSectionComponent and render headline', () => {
    const fixture = TestBed.createComponent(HeroSectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Transforme código e design');
  });

  it('should create SocialProofComponent with metrics', () => {
    const fixture = TestBed.createComponent(SocialProofComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('-82%');
    expect(compiled.textContent).toContain('12ms');
  });

  it('should create PersonaSelectorComponent and allow switching personas', () => {
    const fixture = TestBed.createComponent(PersonaSelectorComponent);
    const comp = fixture.componentInstance;
    expect(comp.personas.length).toBe(3);
    expect(comp.selectedPersona().id).toBe('dev');

    comp.selectedPersona.set(comp.personas[1]);
    fixture.detectChanges();
    expect(comp.selectedPersona().id).toBe('designer');
  });

  it('should calculate annual time waste and savings in RoiCalculatorComponent', () => {
    const fixture = TestBed.createComponent(RoiCalculatorComponent);
    const comp = fixture.componentInstance;
    comp.hourlyRate.set(100);
    comp.hoursPerMonth.set(10);
    expect(comp.annualTimeWaste()).toBe(12000);
    expect(comp.annualSavings()).toBe(Math.round(12000 * 0.82 - 49.9 * 12));
  });

  it('should toggle safe mode in PanicSandboxComponent', () => {
    const fixture = TestBed.createComponent(PanicSandboxComponent);
    const comp = fixture.componentInstance;
    expect(comp.isSandboxPanicActive()).toBe(false);
    comp.toggleSandboxPanic();
    expect(comp.isSandboxPanicActive()).toBe(true);
    comp.toggleSandboxPanic();
    expect(comp.isSandboxPanicActive()).toBe(false);
  });
});
