class CreateStables < ActiveRecord::Migration[7.1]
  def change
    create_table :stables do |t|
      t.string :name, null:false 
      t.string :location, null:false  
      t.string :owner, null:false 
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
    add_index :stables, :location, unique: true
  end
end
