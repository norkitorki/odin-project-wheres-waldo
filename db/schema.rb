# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_01_24_060516) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "coordinates", id: false, force: :cascade do |t|
    t.bigint "findable_id"
    t.bigint "map_id"
    t.float "x"
    t.float "y"
    t.index ["findable_id"], name: "index_coordinates_on_findable_id"
    t.index ["map_id"], name: "index_coordinates_on_map_id"
  end

  create_table "findables", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.string "type_of"
    t.datetime "updated_at", null: false
  end

  create_table "findables_maps", id: false, force: :cascade do |t|
    t.bigint "findable_id"
    t.bigint "map_id"
    t.index ["findable_id"], name: "index_findables_maps_on_findable_id"
    t.index ["map_id"], name: "index_findables_maps_on_map_id"
  end

  create_table "maps", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "scores", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "map_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.float "value"
    t.index ["map_id"], name: "index_scores_on_map_id"
    t.index ["user_id"], name: "index_scores_on_user_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "data"
    t.string "session_id", null: false
    t.datetime "updated_at", null: false
    t.index ["session_id"], name: "index_sessions_on_session_id", unique: true
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.string "token"
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_users_on_name", unique: true
  end

  add_foreign_key "scores", "maps"
  add_foreign_key "scores", "users"
end
