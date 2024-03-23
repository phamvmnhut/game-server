-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_user" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" INTEGER NOT NULL DEFAULT 1,
    "room_id" INTEGER NOT NULL,

    CONSTRAINT "room_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_game" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "game_type" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "user_id_list" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "data_json" JSONB NOT NULL,

    CONSTRAINT "room_game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "room_user" ADD CONSTRAINT "room_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_user" ADD CONSTRAINT "room_user_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_game" ADD CONSTRAINT "room_game_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
