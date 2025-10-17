import { Migration } from '@mikro-orm/migrations';

export class Migration20251015150506_add_all_remaining extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "task_status" as enum ('planned', 'in progress', 'done');`);
    this.addSql(`create table "projects" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "client_name" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "budget" int not null, "staffing" varchar(255) not null, constraint "projects_pkey" primary key ("id"));`);

    this.addSql(`create table "phases" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "budget" int not null, "project_id" uuid not null, constraint "phases_pkey" primary key ("id"));`);

    this.addSql(`create table "invoices" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "client_name" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "amount" int not null, "project_id" uuid not null, constraint "invoices_pkey" primary key ("id"));`);

    this.addSql(`create table "tasks" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "title" varchar(255) not null, "description" varchar(255) not null, "start_date" timestamptz not null, "end_date" timestamptz not null, "status" "task_status" not null, "budget" int not null, "assignments" varchar(255) not null, "phase_id" uuid not null, constraint "tasks_pkey" primary key ("id"));`);

    this.addSql(`create table "timeEntries" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "work_date" timestamptz not null, "hours" int not null, "is_billable" boolean not null, "user_id" uuid not null, "task_id" uuid not null, constraint "timeEntries_pkey" primary key ("id"));`);

    this.addSql(`alter table "phases" add constraint "phases_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;`);

    this.addSql(`alter table "invoices" add constraint "invoices_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;`);

    this.addSql(`alter table "tasks" add constraint "tasks_phase_id_foreign" foreign key ("phase_id") references "phases" ("id") on update cascade;`);

    this.addSql(`alter table "timeEntries" add constraint "timeEntries_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "timeEntries" add constraint "timeEntries_task_id_foreign" foreign key ("task_id") references "tasks" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "phases" drop constraint "phases_project_id_foreign";`);

    this.addSql(`alter table "invoices" drop constraint "invoices_project_id_foreign";`);

    this.addSql(`alter table "tasks" drop constraint "tasks_phase_id_foreign";`);

    this.addSql(`alter table "timeEntries" drop constraint "timeEntries_task_id_foreign";`);

    this.addSql(`drop table if exists "projects" cascade;`);

    this.addSql(`drop table if exists "phases" cascade;`);

    this.addSql(`drop table if exists "invoices" cascade;`);

    this.addSql(`drop table if exists "tasks" cascade;`);

    this.addSql(`drop table if exists "timeEntries" cascade;`);

    this.addSql(`drop type "task_status";`);
  }

}
