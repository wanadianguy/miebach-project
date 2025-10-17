import { Migration } from '@mikro-orm/migrations';

export class Migration20251015201439_refactor_entities extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "staffs" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "role_name" varchar(255) not null, "hourly_rate" int not null, "forecasted_hours" int not null, "project_id" uuid not null, "user_id" uuid not null, constraint "staffs_pkey" primary key ("id"));`);
    this.addSql(`alter table "staffs" add constraint "staffs_user_id_unique" unique ("user_id");`);

    this.addSql(`create table "assignments" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "hourly_rate" int not null, "task_id" uuid not null, "user_id" uuid not null, constraint "assignments_pkey" primary key ("id"));`);
    this.addSql(`alter table "assignments" add constraint "assignments_user_id_unique" unique ("user_id");`);

    this.addSql(`alter table "staffs" add constraint "staffs_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;`);
    this.addSql(`alter table "staffs" add constraint "staffs_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "assignments" add constraint "assignments_task_id_foreign" foreign key ("task_id") references "tasks" ("id") on update cascade;`);
    this.addSql(`alter table "assignments" add constraint "assignments_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "projects" drop column "staffing";`);

    this.addSql(`alter table "tasks" drop column "assignments";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "staffs" cascade;`);

    this.addSql(`drop table if exists "assignments" cascade;`);

    this.addSql(`alter table "projects" add column "staffing" varchar(255) not null;`);

    this.addSql(`alter table "tasks" add column "assignments" varchar(255) not null;`);
  }

}
