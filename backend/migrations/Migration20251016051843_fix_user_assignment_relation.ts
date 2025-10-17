import { Migration } from '@mikro-orm/migrations';

export class Migration20251016051843_fix_user_assignment_relation extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "assignments" drop constraint "assignments_user_id_unique";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "assignments" add constraint "assignments_user_id_unique" unique ("user_id");`);
  }

}
