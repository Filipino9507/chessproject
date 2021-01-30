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
    NbInputModule,
    NbSelectModule,
    NbDialogModule
} from '@nebular/theme';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NbEvaIconsModule } from '@nebular/eva-icons';
import { PagesModule } from './pages/pages.module';
import { ComponentsModule } from './components/components.module';

import { PlayComponent } from '@app/pages/play.component';
import { OptionsComponent } from '@app/pages/options.component';
import { HomeComponent } from '@app/pages/home.component';
import { PageNotFoundComponent } from '@app/pages/page-not-found.component';
import { AboutComponent } from '@app/pages/about.component';
import { PlayOptionsComponent } from '@app/components/play-options.component';
import { PlayBoardComponent } from '@app/components/play-board.component';
import { PromotionDialogComponent } from '@app/components/promotion-dialog.component';
import { PlayEndGameComponent } from '@app/components/play-end-game.component';

import { VarDirective } from '@app/directives/ng-var.directive';

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
        PlayEndGameComponent,
        VarDirective
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
        NbInputModule,
        NbSelectModule,
        NbEvaIconsModule,
        PagesModule,
        ComponentsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
