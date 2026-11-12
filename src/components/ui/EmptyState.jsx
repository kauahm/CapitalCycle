import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from './Button';

/* Estado vazio do painel: retângulo tracejado da referência, com ícone,
   título, explicação e uma única ação (link ou botão). */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  to,
  onAction,
  compact = false,
  className = '',
}) {
  return (
    <div className={`cc-empty ${compact ? 'p-8' : 'p-12'} flex flex-col items-center ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-surfaceLight text-textSecondary flex items-center justify-center mb-4">
          <Icon size={22} />
        </div>
      )}
      {title && <h3 className="text-base font-bold text-textMain mb-1.5">{title}</h3>}
      {description && (
        <p className="text-sm text-textSecondary max-w-md leading-relaxed">{description}</p>
      )}
      {actionLabel && to && (
        <Link
          to={to}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-indigo-300 transition-colors"
        >
          {actionLabel} <ArrowRight size={14} />
        </Link>
      )}
      {actionLabel && !to && onAction && (
        <Button className="mt-5" onClick={onAction} icon={ArrowRight}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
