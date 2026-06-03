import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_CONFIG } from '../config/api.config';
import { WorkflowApiService } from './workflow-api.service';

describe('WorkflowApiService', () => {
  let service: WorkflowApiService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:5000';
  const sampleRun = {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    issueKey: 'FA-5',
    issueType: 'Story',
    labels: ['backend'],
    jiraStatus: 'To Do',
    repoTargets: [] as const,
    branchName: '',
    prUrls: [],
    reviewResult: 'pending' as const,
    qaResult: 'pending' as const,
    messages: [],
    currentNode: 'Po' as const,
    dryRun: true,
    isCompleted: false,
    createdAt: '2026-06-03T12:00:00Z',
    updatedAt: '2026-06-03T12:00:00Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WorkflowApiService,
        { provide: API_CONFIG, useValue: { baseUrl } },
      ],
    });

    service = TestBed.inject(WorkflowApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('creates a workflow run', () => {
    service
      .create({ issueKey: 'FA-5', labels: ['backend'], dryRun: true })
      .subscribe((run) => expect(run.issueKey).toBe('FA-5'));

    const req = httpMock.expectOne(`${baseUrl}/api/workflows`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      issueKey: 'FA-5',
      labels: ['backend'],
      dryRun: true,
    });
    req.flush(sampleRun);
  });

  it('gets workflow by issue key', () => {
    service.getByIssueKey('FA-5').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/workflows/FA-5`);
    expect(req.request.method).toBe('GET');
    req.flush(sampleRun);
  });

  it('executes dry run', () => {
    service.executeDryRun('FA-5').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/workflows/FA-5/dry-run`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...sampleRun, currentNode: 'Completed', isCompleted: true });
  });

  it('maps validation errors from 400 array body', () => {
    let message = '';
    service.getByIssueKey('bad').subscribe({
      error: (err: Error) => (message = err.message),
    });

    const req = httpMock.expectOne(`${baseUrl}/api/workflows/bad`);
    req.flush(['Issue key must match pattern PROJECT-123.'], {
      status: 400,
      statusText: 'Bad Request',
    });

    expect(message).toContain('PROJECT-123');
  });
});
