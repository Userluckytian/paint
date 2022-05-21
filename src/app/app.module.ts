import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { TestComponent } from './components/test/test.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent
  ],
  imports: [
    AppRoutes,
    BrowserModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
