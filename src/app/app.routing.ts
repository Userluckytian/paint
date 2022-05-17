import { Routes, RouterModule } from '@angular/router';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  {
    path: '',
    component: TestComponent
  },
];

export const AppRoutes = RouterModule.forChild(routes);
