import { expect, test } from '@playwright/test';

const apiBase = process.env['E2E_API_URL'] ?? 'http://localhost:5000';

test.describe('Workflow graph (FA-5 contract)', () => {
  test.skip(
    !process.env['E2E_RUN_INTEGRATION'],
    'Set E2E_RUN_INTEGRATION=1 with API and web running',
  );

  test('dashboard loads workflow runner', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('workflow-runner')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Workflow Graph/i })).toBeVisible();
  });

  test('API contract: create and dry-run FA-5', async ({ request }) => {
    const issueKey = `FA-${Date.now() % 10000}`;

    const createResponse = await request.post(`${apiBase}/api/workflows`, {
      data: { issueKey, labels: ['backend'], dryRun: true },
    });
    expect(createResponse.status()).toBe(201);

    const created = await createResponse.json();
    expect(created.issueKey).toBe(issueKey);
    expect(created.currentNode).toBe('Po');

    const dryRunResponse = await request.post(
      `${apiBase}/api/workflows/${issueKey}/dry-run`,
    );
    expect(dryRunResponse.status()).toBe(200);

    const completed = await dryRunResponse.json();
    expect(completed.currentNode).toBe('Completed');
    expect(completed.repoTargets).toContain('api');
    expect(completed.repoTargets).toContain('web');
    expect(completed.branchName).toBe(`feature/${issueKey.toLowerCase()}-cross`);
  });
});
