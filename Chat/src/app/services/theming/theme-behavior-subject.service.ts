import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeBehaviorSubjectService {

  appTheme = new BehaviorSubject(false);

  constructor() { }

  invertAppTheme() {
    this.appTheme.next(!this.appTheme.value);
  }
}
