import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { PlayComponent } from './pages/play.component';
import { OptionsComponent } from './pages/options.component';
import { AboutComponent } from './pages/about.component';
import { PageNotFoundComponent } from './pages/page-not-found.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'play', component: PlayComponent },
    { path: 'options', component: OptionsComponent },
    { path: 'about', component: AboutComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
