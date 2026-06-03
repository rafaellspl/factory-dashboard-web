import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/workflows/workflow-runner.component').then(
        (m) => m.WorkflowRunnerComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
