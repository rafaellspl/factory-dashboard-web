import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowStatusComponent } from './workflow-status.component';

describe('WorkflowStatusComponent', () => {
  let fixture: ComponentFixture<WorkflowStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowStatusComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkflowStatusComponent);
    fixture.componentRef.setInput('run', {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      issueKey: 'FA-5',
      issueType: 'Story',
      labels: ['backend'],
      jiraStatus: 'In Review',
      repoTargets: ['api', 'web'],
      branchName: 'feature/fa-5-cross',
      prUrls: [],
      reviewResult: 'approved',
      qaResult: 'passed',
      messages: ['[Cross.md] Applied cross-cutting changes.'],
      currentNode: 'Completed',
      dryRun: true,
      isCompleted: true,
      createdAt: '2026-06-03T12:00:00Z',
      updatedAt: '2026-06-03T12:00:01Z',
    });
    fixture.detectChanges();
  });

  it('renders issue key and node badge', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h2')?.textContent).toContain('FA-5');
    expect(el.querySelector('[data-node="Completed"]')).toBeTruthy();
  });

  it('lists workflow messages', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[data-testid="workflow-messages"] li')?.textContent).toContain(
      'Cross.md',
    );
  });
});
