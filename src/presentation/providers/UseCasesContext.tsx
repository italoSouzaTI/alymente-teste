import React, { createContext, useContext } from 'react';
import type { SearchReposUseCase } from '@application/use-cases/SearchReposUseCase';
import type { GetRepoDetailsUseCase } from '@application/use-cases/GetRepoDetailsUseCase';
import type { GetRepoIssuesUseCase } from '@application/use-cases/GetRepoIssuesUseCase';

export interface UseCases {
  searchReposUseCase: SearchReposUseCase;
  getRepoDetailsUseCase: GetRepoDetailsUseCase;
  getRepoIssuesUseCase: GetRepoIssuesUseCase;
}

const UseCasesContext = createContext<UseCases | null>(null);

interface UseCasesProviderProps {
  value: UseCases;
  children: React.ReactNode;
}

export function UseCasesProvider({ value, children }: UseCasesProviderProps) {
  return <UseCasesContext.Provider value={value}>{children}</UseCasesContext.Provider>;
}

export function useUseCases(): UseCases {
  const ctx = useContext(UseCasesContext);
  if (ctx == null) throw new Error('useUseCases must be used inside UseCasesProvider');
  return ctx;
}
