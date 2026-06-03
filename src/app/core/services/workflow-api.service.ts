import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { API_CONFIG } from '../config/api.config';
import {
  ApiErrorBody,
  CreateWorkflowRunRequest,
  WorkflowRun,
} from '../models/workflow-run.model';

@Injectable({ providedIn: 'root' })
export class WorkflowApiService {
  private readonly http = inject(HttpClient);
  private readonly apiConfig = inject(API_CONFIG);

  private workflowsUrl(): string {
    return `${this.apiConfig.baseUrl}/api/workflows`;
  }

  create(request: CreateWorkflowRunRequest): Observable<WorkflowRun> {
    return this.http
      .post<WorkflowRun>(this.workflowsUrl(), request)
      .pipe(catchError(this.handleError));
  }

  getByIssueKey(issueKey: string): Observable<WorkflowRun> {
    return this.http
      .get<WorkflowRun>(`${this.workflowsUrl()}/${encodeURIComponent(issueKey)}`)
      .pipe(catchError(this.handleError));
  }

  executeDryRun(issueKey: string): Observable<WorkflowRun> {
    return this.http
      .post<WorkflowRun>(
        `${this.workflowsUrl()}/${encodeURIComponent(issueKey)}/dry-run`,
        null,
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 400 && Array.isArray(error.error)) {
      return throwError(() => new Error(error.error.join('; ')));
    }

    const body = error.error as ApiErrorBody | string | null;
    const message =
      typeof body === 'object' && body !== null && 'error' in body
        ? body.error
        : error.message;

    return throwError(() => new Error(message));
  }
}
