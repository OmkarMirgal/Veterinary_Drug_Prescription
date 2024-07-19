class CreatePrescriptions < ActiveRecord::Migration[7.1]
  def change
    create_table :prescriptions do |t|
      t.string :indication
      t.string :diagnosisDetails
      t.string :application
      t.integer :amount
      t.string :amountUnit
      t.integer :dosage
      t.date :applicationDate
      t.integer :applicationDuration
      t.integer :usageDuration
      t.string :usageInstructions

      t.references :user, null: false, foreign_key: true
      t.references :stable, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
