import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormValidation } from '@shared/models/form-validation.model';

@Injectable({ providedIn: 'root' })
export class FormHandlerService<T> {

  private readonly submitSignal = new Subject<void>();
  public readonly submitSignal$ = this.submitSignal.asObservable();

  private readonly registeredIds = new Set<string>();

  private readonly models = new Map<string, T | undefined>();
  private readonly modelsSubject = new BehaviorSubject<Map<string, T | undefined>>(new Map());
  public readonly models$ = this.modelsSubject.asObservable();

  private readonly results = new Map<string, FormValidation<T>>();
  private readonly resultsSubject = new BehaviorSubject<Map<string, FormValidation<T>>>(new Map());
  public readonly results$ = this.resultsSubject.asObservable();

  public registerChild(id: string): void {
    this.registeredIds.add(id);
  }

  public unregisterChild(id: string): void {
    this.registeredIds.delete(id);
    this.models.delete(id);
    this.results.delete(id);
    this.emitModelChanges();
    this.emitResultChanges();
  }

  public getExpectedIds(): string[] {
    return Array.from(this.registeredIds);
  }

  public isIdRegistered(id: string): boolean {
    return this.registeredIds.has(id);
  }

  public clear(): void {
    this.models.clear();
    this.results.clear();
    this.emitModelChanges();
    this.emitResultChanges();
  }

  public setModel(id: string, data?: T): void {
    this.models.set(id, data);
    this.emitModelChanges();
  }

  public submitResult(id: string, isValid: boolean, data?: T): void {
    this.results.set(id, { isValid, data });
    this.emitResultChanges();
  }

  public sendSubmitSignal(): void {
    this.results.clear();
    this.emitResultChanges();
    this.submitSignal.next();
  }

  private emitModelChanges(): void {
    this.modelsSubject.next(new Map(this.models));
  }

  private emitResultChanges(): void {
    this.resultsSubject.next(new Map(this.results));
  }
}
