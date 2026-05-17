import React from 'react';
import { IssueItem } from '@components/issues/IssueItem';
import { renderWithProviders } from '../../../../test-utils/renderWithProviders';
import { makeIssue, makeLabel } from '../../../../test-utils/fixtures';

describe('IssueItem', () => {
  it('renders issue title', () => {
    const issue = makeIssue({ title: 'Fix memory leak in useEffect' });
    const { getByText } = renderWithProviders(<IssueItem issue={issue} />);

    expect(getByText('Fix memory leak in useEffect')).toBeTruthy();
  });

  it('renders issue number', () => {
    const issue = makeIssue({ number: 42 });
    const { getByText } = renderWithProviders(<IssueItem issue={issue} />);

    expect(getByText('#42')).toBeTruthy();
  });

  it('renders without crash when labels array is empty', () => {
    const issue = makeIssue({ labels: [] });

    expect(() => renderWithProviders(<IssueItem issue={issue} />)).not.toThrow();
  });

  it('renders label chips when labels are present', () => {
    const issue = makeIssue({
      labels: [makeLabel({ name: 'bug' }), makeLabel({ id: 2, name: 'enhancement' })],
    });
    const { getByText } = renderWithProviders(<IssueItem issue={issue} />);

    expect(getByText('bug')).toBeTruthy();
    expect(getByText('enhancement')).toBeTruthy();
  });

  it('renders author login', () => {
    const issue = makeIssue();
    const { getByText } = renderWithProviders(<IssueItem issue={issue} />);

    expect(getByText(issue.author.login)).toBeTruthy();
  });
});
