import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PlayAIComponent } from './pages/play-ai/play-ai.component';
import { OptionsComponent } from './pages/options/options.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PlayAIModule } from './pages/play-ai/play-ai.module';
import { AboutComponent } from './pages/about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    OptionsComponent,
    PlayAIComponent,
    HomeComponent,
    PageNotFoundComponent,
    AboutComponent,
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
