import { Migration } from '@mikro-orm/migrations';

export class Migration20251013204849_add_user extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "user_role" as enum ('manager', 'contributor');`);
    this.addSql(`create table "users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role" "user_role" not null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop type "user_role";`);
  }

}
