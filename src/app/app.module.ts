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
    NbSelectModule,
    NbDialogModule
} from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

import { PlayComponent } from './pages/play.component';
import { OptionsComponent } from './pages/options.component';
import { HomeComponent } from './pages/home.component';
import { PageNotFoundComponent } from './pages/page-not-found.component';
import { AboutComponent } from './pages/about.component';
import { PlayOptionsComponent } from './components/play-options.component';
import { PlayBoardComponent } from './components/play-board.component';
import { PromotionDialogComponent } from './components/promotion-dialog.component';
import { PlayEndGameComponent } from './components/play-end-game.component';

@NgModule({
    declarations: [
        AppComponent,
        OptionsComponent,
        PlayComponent,
        HomeComponent,
        PageNotFoundComponent,
        AboutComponent,
        PlayOptionsComponent,
        PlayBoardComponent,
        PromotionDialogComponent,
        PlayEndGameComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NbIconModule,
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbThemeModule.forRoot({ name: 'dark' }),
        NbDialogModule.forRoot(),
        NbLayoutModule,
        NbCardModule,
        NbButtonModule,
        NbSelectModule,
        NbEvaIconsModule,
        PagesModule,
        ComponentsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
