class AddIndexToLicence < ActiveRecord::Migration[7.1]
  def change
    change_column :users, :licence, :string, null: false
    change_column :users, :email, :string, null: false
    change_column :users, :name, :string, null: false
  end
  add_index :users, :licence, unique: true
end
