import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private readonly translation = inject(TranslationService);

  transform(key: string, params?: Record<string, number | string>): string {
    let translated = this.translation.translate(key);
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translated = translated.replace(`{{${paramKey}}}`, String(value));
      });
    }
    return translated;
  }
}
