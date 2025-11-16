import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type LanguageCode = 'es' | 'en';
type TranslationMap = Record<string, string>;

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly storageKey = 'ecosmart.language';
  private readonly languages: LanguageCode[] = ['es', 'en'];
  private readonly defaultLanguage: LanguageCode = 'es';

  private readonly languageSubject = new BehaviorSubject<LanguageCode>(this.loadInitialLanguage());
  private readonly translationsSubject = new BehaviorSubject<TranslationMap>({});

  readonly language$ = this.languageSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    void this.loadTranslations(this.languageSubject.value);
  }

  get availableLanguages(): LanguageCode[] {
    return this.languages;
  }

  get currentLanguage(): LanguageCode {
    return this.languageSubject.value;
  }

  translate(key: string): string {
    return this.translationsSubject.value[key] ?? key;
  }

  async setLanguage(lang: LanguageCode): Promise<void> {
    if (!this.languages.includes(lang) || lang === this.languageSubject.value) {
      return;
    }
    this.languageSubject.next(lang);
    this.persistLanguage(lang);
    await this.loadTranslations(lang);
  }

  private async loadTranslations(lang: LanguageCode): Promise<void> {
    const resourceUrl = `assets/i18n/${lang}.json`;
    const translations = await firstValueFrom(
      this.http.get<TranslationMap>(resourceUrl).pipe(
        catchError(() => {
          if (lang !== this.defaultLanguage) {
            this.languageSubject.next(this.defaultLanguage);
            return this.http.get<TranslationMap>(`assets/i18n/${this.defaultLanguage}.json`);
          }
          return of({});
        })
      )
    );
    this.translationsSubject.next(translations);
  }

  private loadInitialLanguage(): LanguageCode {
    if (typeof window === 'undefined') {
      return this.defaultLanguage;
    }
    const stored = window.localStorage.getItem(this.storageKey) as LanguageCode | null;
    if (stored && this.languages.includes(stored)) {
      return stored;
    }
    return this.defaultLanguage;
  }

  private persistLanguage(lang: LanguageCode): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(this.storageKey, lang);
    } catch {
      /* ignore storage persistence issues */
    }
  }
}
