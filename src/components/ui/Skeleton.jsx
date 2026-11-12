import React from 'react';

/* Esqueletos de carregamento. Substituem o spinner centralizado que
   ocupava 80vh: a página já nasce com a silhueta do conteúdo, então não há
   salto de layout quando os dados chegam. */
export function Skeleton({ className = '' }) {
  return <div className={`cc-skeleton rounded-lg ${className}`} aria-hidden="true" />;
}

export function SkeletonCard({ linhas = 2, className = '' }) {
  return (
    <div className={`cc-card-p space-y-4 ${className}`} aria-hidden="true">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-9 w-48" />
      {Array.from({ length: linhas - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-40" />
      ))}
    </div>
  );
}

export function SkeletonLista({ itens = 5 }) {
  return (
    <div className="cc-card divide-y divide-hairline" aria-hidden="true">
      {Array.from({ length: itens }).map((_, i) => (
        <div key={i} className="p-5 flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-[var(--cc-gap)]" role="status" aria-label="Carregando">
      <Skeleton className="h-4 w-72" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[var(--cc-gap-card)]">
        <SkeletonCard linhas={3} />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonLista itens={4} />
    </div>
  );
}
