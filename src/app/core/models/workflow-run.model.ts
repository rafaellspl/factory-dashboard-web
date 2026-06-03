/** Aligned with FactoryAi.Application.Workflows.WorkflowRunDto (camelCase JSON). */
export type RepoTarget = 'orchestrator' | 'web' | 'api';

export type ReviewResult = 'pending' | 'approved' | 'rejected';

export type QaResult = 'pending' | 'passed' | 'failed';

export type AgentNode =
  | 'Po'
  | 'DevFrontend'
  | 'DevBackend'
  | 'DevCross'
  | 'Reviewer'
  | 'Qa'
  | 'Completed';

export interface WorkflowRun {
  id: string;
  issueKey: string;
  issueType: string;
  labels: string[];
  jiraStatus: string;
  repoTargets: RepoTarget[];
  branchName: string;
  prUrls: string[];
  reviewResult: ReviewResult;
  qaResult: QaResult;
  messages: string[];
  currentNode: AgentNode;
  dryRun: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowRunRequest {
  issueKey: string;
  labels?: string[];
  dryRun: boolean;
}

export interface ApiErrorBody {
  error: string;
}
