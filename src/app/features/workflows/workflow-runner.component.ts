import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { WorkflowRun } from '../../core/models/workflow-run.model';
import { WorkflowApiService } from '../../core/services/workflow-api.service';
import { WorkflowStatusComponent } from './workflow-status.component';

const ISSUE_KEY_PATTERN = /^[A-Z]+-\d+$/;

@Component({
  selector: 'app-workflow-runner',
  imports: [ReactiveFormsModule, WorkflowStatusComponent],
  templateUrl: './workflow-runner.component.html',
  styleUrl: './workflow-runner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowRunnerComponent {
  private readonly workflowApi = inject(WorkflowApiService);

  protected readonly run = signal<WorkflowRun | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly form = new FormGroup({
    issueKey: new FormControl('FA-5', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(ISSUE_KEY_PATTERN),
        Validators.maxLength(32),
      ],
    }),
    labels: new FormControl('backend', { nonNullable: true }),
    dryRun: new FormControl(true, { nonNullable: true }),
  });

  protected load(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { issueKey } = this.form.getRawValue();
    this.workflowApi.getByIssueKey(issueKey).subscribe({
      next: (workflow) => {
        this.run.set(workflow);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.run.set(null);
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  protected createAndDryRun(): void {
    if (this.form.invalid) {
      return;
    }

    const { issueKey, labels, dryRun } = this.form.getRawValue();
    const labelList = labels
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    this.loading.set(true);
    this.error.set(null);

    this.workflowApi
      .create({ issueKey, labels: labelList, dryRun })
      .subscribe({
        next: () => {
          this.workflowApi.executeDryRun(issueKey).subscribe({
            next: (workflow) => {
              this.run.set(workflow);
              this.loading.set(false);
            },
            error: (err: Error) => {
              this.error.set(err.message);
              this.loading.set(false);
            },
          });
        },
        error: (err: Error) => {
          this.error.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
