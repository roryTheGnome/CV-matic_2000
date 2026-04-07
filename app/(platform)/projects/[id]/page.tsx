'use client';

import { useCurrentUser } from '@/lib/hooks/userHooks/useCurrentUser';
import { useProject } from '@/lib/hooks/projectHooks/useProject';
import { ActionsMenu } from '@/components/admin/ActionsMenu';

export default function ProjectDetails() {
  const { isLoading, error, project } = useProject();
  const { currentUserRole } = useCurrentUser();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading project</div>;
  if (!project) return null;

  const {
    id,
    name,
    domain,
    start_date,
    end_date,
    description,
    environment,
  } = project;

  return (
    <div className="">
      <div >

        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{name}</h2>
            <p className="text-sm text-muted-foreground">{domain}</p>
          </div>

          {currentUserRole === 'Admin' && (
            <ActionsMenu
              editType="PROJECT_EDIT"
              deleteType="PROJECT_DELETE"
              item={{ id, name }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 py-4 text-sm">
          <div>
            <p className="text-muted-foreground">Start date</p>
            <p className="font-medium">{start_date}</p>
          </div>

          <div>
            <p className="text-muted-foreground">End date</p>
            <p className="font-medium">
              {end_date ? end_date : 'Till now'}
            </p>
          </div>
        </div>

        {description && (
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {!!environment?.length && (
          <div className="px-6 pb-5">
            <div className="flex flex-wrap gap-2">
              {environment.map((env) => (
                <span
                  key={env}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {env}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}