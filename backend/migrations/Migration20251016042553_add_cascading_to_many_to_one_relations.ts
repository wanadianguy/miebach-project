import { Migration } from '@mikro-orm/migrations';

export class Migration20251016042553_add_cascading_to_many_to_one_relations extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "phases" drop constraint "phases_project_id_foreign";`);

    this.addSql(`alter table "invoices" drop constraint "invoices_project_id_foreign";`);

    this.addSql(`alter table "tasks" drop constraint "tasks_phase_id_foreign";`);

    this.addSql(`alter table "timeEntries" drop constraint "timeEntries_user_id_foreign";`);
    this.addSql(`alter table "timeEntries" drop constraint "timeEntries_task_id_foreign";`);

    this.addSql(`alter table "staffs" drop constraint "staffs_project_id_foreign";`);

    this.addSql(`alter table "assignments" drop constraint "assignments_task_id_foreign";`);
    this.addSql(`alter table "assignments" drop constraint "assignments_user_id_foreign";`);

    this.addSql(`alter table "phases" add constraint "phases_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "invoices" add constraint "invoices_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "tasks" add constraint "tasks_phase_id_foreign" foreign key ("phase_id") references "phases" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "timeEntries" add constraint "timeEntries_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "timeEntries" add constraint "timeEntries_task_id_foreign" foreign key ("task_id") references "tasks" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "staffs" add constraint "staffs_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "assignments" add constraint "assignments_task_id_foreign" foreign key ("task_id") references "tasks" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "assignments" add constraint "assignments_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "phases" drop constraint "phases_project_id_foreign";`);

    this.addSql(`alter table "invoices" drop constraint "invoices_project_id_foreign";`);

    this.addSql(`alter table "tasks" drop constraint "tasks_phase_id_foreign";`);

    this.addSql(`alter table "timeEntries" drop constraint "timeEntries_user_id_foreign";`);
    this.addSql(`alter table "timeEntries" drop constraint "timeEntries_task_id_foreign";`);

    this.addSql(`alter table "staffs" drop constraint "staffs_project_id_foreign";`);

    this.addSql(`alter table "assignments" drop constraint "assignments_task_id_foreign";`);
    this.addSql(`alter table "assignments" drop constraint "assignments_user_id_foreign";`);

    this.addSql(`alter table "phases" add constraint "phases_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;`);

    this.addSql(`alter table "invoices" add constraint "invoices_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;`);

    this.addSql(`alter table "tasks" add constraint "tasks_phase_id_foreign" foreign key ("phase_id") references "phases" ("id") on update cascade;`);

    this.addSql(`alter table "timeEntries" add constraint "timeEntries_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "timeEntries" add constraint "timeEntries_task_id_foreign" foreign key ("task_id") references "tasks" ("id") on update cascade;`);

    this.addSql(`alter table "staffs" add constraint "staffs_project_id_foreign" foreign key ("project_id") references "projects" ("id") on update cascade;`);

    this.addSql(`alter table "assignments" add constraint "assignments_task_id_foreign" foreign key ("task_id") references "tasks" ("id") on update cascade;`);
    this.addSql(`alter table "assignments" add constraint "assignments_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  }

}
