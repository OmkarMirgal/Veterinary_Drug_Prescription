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

ActiveRecord::Schema[7.1].define(version: 2024_07_16_011644) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "prescriptions", force: :cascade do |t|
    t.string "indication"
    t.string "diagnosisDetails"
    t.string "application"
    t.integer "amount"
    t.string "amountUnit"
    t.integer "dosage"
    t.date "applicationDate"
    t.integer "applicationDuration"
    t.integer "usageDuration"
    t.string "usageInstructions"
    t.bigint "user_id", null: false
    t.bigint "stable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["stable_id"], name: "index_prescriptions_on_stable_id"
    t.index ["user_id"], name: "index_prescriptions_on_user_id"
  end

  create_table "stables", force: :cascade do |t|
    t.string "name", null: false
    t.string "location", null: false
    t.string "owner", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["location"], name: "index_stables_on_location", unique: true
    t.index ["user_id"], name: "index_stables_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.string "licence", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["licence"], name: "index_users_on_licence", unique: true
  end

  add_foreign_key "prescriptions", "stables"
  add_foreign_key "prescriptions", "users"
  add_foreign_key "stables", "users"
end
