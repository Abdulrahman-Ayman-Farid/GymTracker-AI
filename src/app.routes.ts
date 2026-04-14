
import { Routes } from '@angular/router';
import { WelcomeComponent } from './components/welcome.component';
import { HomeComponent } from './components/home.component';
import { CategoryDetailComponent } from './components/category-detail.component';
import { WorkoutDetailComponent } from './components/workout-detail.component';
import { RoutineDetailComponent } from './components/routine-detail.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'category/:id', component: CategoryDetailComponent },
  { path: 'workout/:id', component: WorkoutDetailComponent },
  { path: 'routine/:id', component: RoutineDetailComponent },
  { path: '**', redirectTo: '' }
];
