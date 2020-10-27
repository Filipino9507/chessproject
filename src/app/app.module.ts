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
import { PlayAIModule } from './pages/play-ai/play-ai.module';
import { PlayBoardModule } from './components/play-board/play-board.module';

import { PlayAIComponent } from './pages/play-ai/play-ai.component';
import { OptionsComponent } from './pages/options/options.component';
import { HomeComponent } from './pages/home/home.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AboutComponent } from './pages/about/about.component';
import { PlayOptionsComponent } from './components/play-options/play-options.component';
import { PlayBoardComponent } from './components/play-board/play-board.component';

@NgModule({
  declarations: [
    AppComponent,
    OptionsComponent,
    PlayAIComponent,
    HomeComponent,
    PageNotFoundComponent,
    AboutComponent,
    PlayOptionsComponent,
    PlayBoardComponent,
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
    PlayAIModule,
    PlayBoardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
