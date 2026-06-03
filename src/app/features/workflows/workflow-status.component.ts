import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { WorkflowRun } from '../../core/models/workflow-run.model';

@Component({
  selector: 'app-workflow-status',
  imports: [DatePipe],
  templateUrl: './workflow-status.component.html',
  styleUrl: './workflow-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowStatusComponent {
  readonly run = input.required<WorkflowRun>();

  protected repoTargetsLabel(targets: readonly string[]): string {
    return targets.length > 0 ? targets.join(', ') : '—';
  }
}
