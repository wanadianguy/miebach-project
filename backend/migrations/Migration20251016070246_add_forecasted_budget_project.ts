import { Migration } from '@mikro-orm/migrations';

export class Migration20251016070246_add_forecasted_budget_project extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "projects" add column "forecasted_budget" int not null default 0;`);
    this.addSql(`alter table "projects" alter column "budget" type int using ("budget"::int);`);
    this.addSql(`alter table "projects" alter column "budget" set default 0;`);

    this.addSql(`alter table "phases" alter column "budget" type int using ("budget"::int);`);
    this.addSql(`alter table "phases" alter column "budget" set default 0;`);

    this.addSql(`alter table "tasks" alter column "budget" type int using ("budget"::int);`);
    this.addSql(`alter table "tasks" alter column "budget" set default 0;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "projects" drop column "forecasted_budget";`);

    this.addSql(`alter table "projects" alter column "budget" drop default;`);
    this.addSql(`alter table "projects" alter column "budget" type int using ("budget"::int);`);

    this.addSql(`alter table "phases" alter column "budget" drop default;`);
    this.addSql(`alter table "phases" alter column "budget" type int using ("budget"::int);`);

    this.addSql(`alter table "tasks" alter column "budget" drop default;`);
    this.addSql(`alter table "tasks" alter column "budget" type int using ("budget"::int);`);
  }

}
