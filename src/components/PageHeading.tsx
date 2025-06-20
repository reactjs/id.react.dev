/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import Breadcrumbs from 'components/Breadcrumbs';
import Tag from 'components/Tag';
import {H1} from './MDX/Heading';
import type {RouteTag, RouteItem} from './Layout/getRouteMeta';
import * as React from 'react';
import {IconCanary} from './Icon/IconCanary';
import {IconExperimental} from './Icon/IconExperimental';

interface PageHeadingProps {
  title: string;
  version?: 'experimental' | 'canary';
  experimental?: boolean;
  status?: string;
  description?: string;
  tags?: RouteTag[];
  breadcrumbs: RouteItem[];
}

function PageHeading({
  title,
  status,
  version,
  tags = [],
  breadcrumbs,
}: PageHeadingProps) {
  return (
    <div className="px-5 sm:px-12 pt-3.5">
      <div className="max-w-4xl ms-0 2xl:mx-auto">
        {breadcrumbs ? <Breadcrumbs breadcrumbs={breadcrumbs} /> : null}
        <H1 className="mt-0 text-primary dark:text-primary-dark -mx-.5 break-words">
          {title}
          {version === 'canary' && (
            <IconCanary
              title=" - Fitur ini tersedia di rilis Canary terbaru React"
              className="ms-4 mt-1 text-gray-50 dark:text-gray-40 inline-block w-6 h-6 align-[-1px]"
            />
          )}
          {version === 'experimental' && (
            <IconExperimental
              title=" - Fitur ini tersedia di rilis Eksperimental terbaru React"
              className="ms-4 mt-1 text-gray-50 dark:text-gray-40 inline-block w-6 h-6 align-[-1px]"
            />
          )}
          {status ? <em>—{status}</em> : ''}
        </H1>
        {tags?.length > 0 && (
          <div className="mt-4">
            {tags.map((tag) => (
              <Tag key={tag} variant={tag as RouteTag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeading;
