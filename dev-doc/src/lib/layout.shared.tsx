import React from 'react';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import AddisPayLogo from '@/components/AddisPayLogo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-3">
          <AddisPayLogo size="sm" href="" />
          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            Docs
          </span>
        </div>
      ),
      url: '/docs',
    },
    links: [
      {
        text: 'Architecture',
        url: '/docs/architecture',
      },
      {
        text: 'Frontend',
        url: '/docs/frontend/overview',
      },
      {
        text: 'Backend (Go)',
        url: '/docs/backend/overview',
      },
      {
        text: 'API Reference',
        url: '/docs/api-reference/overview',
      },
      {
        text: 'SRS Matrix',
        url: '/docs/srs-requirements/functional-requirements',
      },
      {
        text: 'DevOps',
        url: '/docs/deployment-devops/local-development',
      },
    ],
  };
}
