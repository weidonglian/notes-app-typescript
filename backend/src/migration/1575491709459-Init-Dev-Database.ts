import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDevDatabase1575491709459 implements MigrationInterface {
    name = 'InitDevDatabase1575491709459'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "done" boolean NOT NULL, "noteId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "role" varchar NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`, undefined);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "done" boolean NOT NULL, "noteId" integer, CONSTRAINT "FK_8a1f8e09cc510e654c7293f2537" FOREIGN KEY ("noteId") REFERENCES "note" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_todo"("id", "name", "done", "noteId") SELECT "id", "name", "done", "noteId" FROM "todo"`, undefined);
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_todo" RENAME TO "todo"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer, CONSTRAINT "FK_5b87d9d19127bd5d92026017a7b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_note"("id", "name", "userId") SELECT "id", "name", "userId" FROM "note"`, undefined);
        await queryRunner.query(`DROP TABLE "note"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_note" RENAME TO "note"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "note" RENAME TO "temporary_note"`, undefined);
        await queryRunner.query(`CREATE TABLE "note" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "userId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "note"("id", "name", "userId") SELECT "id", "name", "userId" FROM "temporary_note"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_note"`, undefined);
        await queryRunner.query(`ALTER TABLE "todo" RENAME TO "temporary_todo"`, undefined);
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "done" boolean NOT NULL, "noteId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "todo"("id", "name", "done", "noteId") SELECT "id", "name", "done", "noteId" FROM "temporary_todo"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_todo"`, undefined);
        await queryRunner.query(`DROP TABLE "note"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
    }

}
