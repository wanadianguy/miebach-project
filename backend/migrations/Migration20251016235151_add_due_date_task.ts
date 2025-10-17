import { Migration } from '@mikro-orm/migrations';

export class Migration20251016235151_add_due_date_task extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "tasks" add column "due_date" timestamptz not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "tasks" drop column "due_date";`);
  }

}
