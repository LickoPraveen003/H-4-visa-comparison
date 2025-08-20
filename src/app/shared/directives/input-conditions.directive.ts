import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputConditions]'
})
export class InputConditionsDirective {
  @Input() inputConditions: string = '';

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;
    const input = event.target as HTMLInputElement;
    const value = input.value;

    switch (this.inputConditions) {

      case 'onlyNumber':
        if ((!this.isNumberKey(key) && !this.isControlKey(key)) || this.isOnlySpaces(key, value)) {
          event.preventDefault();
        }
        break;

      case 'alphaWithSpace':
        if ((!this.isAlphaKey(key) && key !== ' ' && !this.isControlKey(key)) || this.isOnlySpaces(key, value)) {
          event.preventDefault();
        }
        break;

      case 'alphanumericWithSpace':
        if ((!this.isAlphanumericKey(key) && key !== ' ' && !this.isControlKey(key)) || this.isOnlySpaces(key, value)) {
          event.preventDefault();
        }
        break;

      case 'alphaWithoutSpace':
        if ((!this.isAlphaKey(key) && !this.isControlKey(key)) || this.isOnlySpaces(key, value)) {
          event.preventDefault();
        }
        break;

      case 'alphanumericWithoutSpace':
        if ((!this.isAlphanumericKey(key) && !this.isControlKey(key)) || this.isOnlySpaces(key, value)) {
          event.preventDefault();
        }
        break;


      default:
        break;
    }
  }

  private isNumberKey(key: string): boolean {
    return /^[0-9]$/.test(key);
  }

  private isAlphaKey(key: string): boolean {
    return /^[a-zA-Z]$/.test(key);
  }

  private isAlphanumericKey(key: string): boolean {
    return /^[a-zA-Z0-9]$/.test(key);
  }

  private isControlKey(key: string): boolean {
    const controlKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
    return controlKeys.includes(key);
  }

  /**
   * Prevents entering space as first character or if only spaces are being entered
   */
  private isOnlySpaces(key: string, currentValue: string): boolean {
    return key === ' ' && currentValue.trim() === '';
  }
}
