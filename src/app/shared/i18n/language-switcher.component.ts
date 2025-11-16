import { NgFor } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslationService, LanguageCode } from './translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="lang-switcher">
      <span
        class="indicator"
        [style.transform]="
          'translateX(' + (currentLanguage() === languages[0] ? '0%' : '100%') + ')'
        "
      ></span>
      <ng-container *ngFor="let option of languages">
        <button type="button" [class.active]="currentLanguage() === option" (click)="changeLanguage(option)">
          {{ option.toUpperCase() }}
        </button>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .lang-switcher {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        background: rgba(233, 247, 238, 0.8);
        border-radius: 999px;
        padding: 0.2rem;
        min-width: 110px;
        border: 1px solid rgba(25, 94, 61, 0.15);
      }
      .indicator {
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
        width: calc(50% - 0.2rem);
        height: calc(100% - 0.4rem);
        background: #4abf77;
        border-radius: 999px;
        transition: transform 0.15s ease;
        z-index: 1;
      }
      button {
        position: relative;
        z-index: 2;
        border: none;
        background: transparent;
        color: #155b3c;
        border-radius: 999px;
        padding: 0.35rem 0;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      button.active {
        color: #fff;
      }
    `
  ]
})
export class LanguageSwitcherComponent {
  private readonly translation = inject(TranslationService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly languages: LanguageCode[] = this.translation.availableLanguages;
  protected readonly currentLanguage = signal<LanguageCode>(this.translation.currentLanguage);

  constructor() {
    this.translation.language$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => this.currentLanguage.set(lang));
  }

  async changeLanguage(lang: LanguageCode): Promise<void> {
    await this.translation.setLanguage(lang);
  }
}
