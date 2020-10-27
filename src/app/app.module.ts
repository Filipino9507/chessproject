import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { 
  NbThemeModule, 
  NbLayoutModule,
  NbCardModule,
  NbIconModule, 
  NbSidebarModule, 
  NbMenuModule, 
  NbButtonModule,
  NbSelectModule
} from '@nebular/theme';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PlayAIComponent } from './play-ai/play-ai.component';
import { OptionsComponent } from './options/options.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PlayAIModule } from './play-ai/play-ai.module';

@NgModule({
  declarations: [
    AppComponent,
    OptionsComponent,
    PlayAIComponent,
    HomeComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbIconModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
    NbEvaIconsModule,
    PlayAIModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
