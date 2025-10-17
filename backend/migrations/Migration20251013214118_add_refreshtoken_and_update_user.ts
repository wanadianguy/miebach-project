import { Migration } from '@mikro-orm/migrations';

export class Migration20251013214118_add_refreshtoken_and_update_user extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "refresh_tokens" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null default CURRENT_TIMESTAMP, "refresh_token" varchar(255) not null, "user_id" uuid not null, constraint "refresh_tokens_pkey" primary key ("id"));`);

    this.addSql(`alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "refresh_tokens" cascade;`);
  }

}
