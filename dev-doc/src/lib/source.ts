import React, { createElement } from 'react';
import { docs, meta } from '../../.source/server';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { loader } from 'fumadocs-core/source';
import * as LucideIcons from 'lucide-react';

export const source = loader({
  baseUrl: '/docs',
  source: toFumadocsSource(docs, meta),
  icon(iconName) {
    if (!iconName) return;
    const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
    if (IconComponent) {
      return createElement(IconComponent, { className: 'w-4 h-4 text-emerald-700/80 dark:text-emerald-400/80' });
    }
  },
});
