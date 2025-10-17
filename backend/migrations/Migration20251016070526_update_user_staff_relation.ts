import { Migration } from '@mikro-orm/migrations';

export class Migration20251016070526_update_user_staff_relation extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "staffs" drop constraint "staffs_user_id_foreign";`);

    this.addSql(`alter table "staffs" drop constraint "staffs_user_id_unique";`);

    this.addSql(`alter table "staffs" add constraint "staffs_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "staffs" drop constraint "staffs_user_id_foreign";`);

    this.addSql(`alter table "staffs" add constraint "staffs_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "staffs" add constraint "staffs_user_id_unique" unique ("user_id");`);
  }

}
