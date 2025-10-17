import { Migration } from '@mikro-orm/migrations';

export class Migration20251016064612_add_status_phase_and_project extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "project_status" as enum ('planned', 'in progress', 'done');`);
    this.addSql(`create type "phase_status" as enum ('planned', 'in progress', 'done');`);
    this.addSql(`alter table "projects" add column "status" "project_status" not null default 'planned';`);

    this.addSql(`alter table "phases" add column "status" "phase_status" not null default 'planned';`);

    this.addSql(`alter table "tasks" alter column "status" type "task_status" using ("status"::"task_status");`);
    this.addSql(`alter table "tasks" alter column "status" set default 'planned';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "projects" drop column "status";`);

    this.addSql(`alter table "phases" drop column "status";`);

    this.addSql(`alter table "tasks" alter column "status" drop default;`);
    this.addSql(`alter table "tasks" alter column "status" type "task_status" using ("status"::"task_status");`);

    this.addSql(`drop type "project_status";`);
    this.addSql(`drop type "phase_status";`);
  }

}
