
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { CategoryDetailComponent } from './components/category-detail.component';
import { WorkoutDetailComponent } from './components/workout-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:id', component: CategoryDetailComponent },
  { path: 'workout/:id', component: WorkoutDetailComponent },
  { path: '**', redirectTo: '' }
];
