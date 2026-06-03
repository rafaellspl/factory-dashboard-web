import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { WorkflowApiService } from '../../core/services/workflow-api.service';
import { WorkflowRunnerComponent } from './workflow-runner.component';

describe('WorkflowRunnerComponent', () => {
  let fixture: ComponentFixture<WorkflowRunnerComponent>;
  let api: jasmine.SpyObj<WorkflowApiService>;

  const completedRun = {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    issueKey: 'FA-5',
    issueType: 'Story',
    labels: ['backend'],
    jiraStatus: 'Done',
    repoTargets: ['api', 'web'] as const,
    branchName: 'feature/fa-5-cross',
    prUrls: [],
    reviewResult: 'approved' as const,
    qaResult: 'passed' as const,
    messages: [],
    currentNode: 'Completed' as const,
    dryRun: true,
    isCompleted: true,
    createdAt: '2026-06-03T12:00:00Z',
    updatedAt: '2026-06-03T12:00:01Z',
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj('WorkflowApiService', [
      'create',
      'getByIssueKey',
      'executeDryRun',
    ]);

    await TestBed.configureTestingModule({
      imports: [WorkflowRunnerComponent],
      providers: [{ provide: WorkflowApiService, useValue: api }],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowRunnerComponent);
    fixture.detectChanges();
  });

  it('loads an existing workflow', () => {
    api.getByIssueKey.and.returnValue(of(completedRun));

    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('button[type="button"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(api.getByIssueKey).toHaveBeenCalledWith('FA-5');
    expect(el.querySelector('[data-testid="workflow-status"]')).toBeTruthy();
  });

  it('creates and executes dry run', () => {
    api.create.and.returnValue(of(completedRun));
    api.executeDryRun.and.returnValue(of(completedRun));

    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(api.create).toHaveBeenCalled();
    expect(api.executeDryRun).toHaveBeenCalledWith('FA-5');
  });

  it('shows API errors', () => {
    api.getByIssueKey.and.returnValue(
      throwError(() => new Error('Workflow run for issue was not found.')),
    );

    const el: HTMLElement = fixture.nativeElement;
    (el.querySelector('button[type="button"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(el.querySelector('[data-testid="workflow-error"]')?.textContent).toContain(
      'not found',
    );
  });
});
