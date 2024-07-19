class Prescription < ApplicationRecord
    belongs_to :user
    belongs_to :stable
    
    before_validation :normalize_fields

    validates :applicationDate, presence: true, format: { with: /\A\d{4}-\d{2}-\d{2}\z/, message: 'must be in the format yyyy-mm-dd' }
    validates :indication, presence: true
    validates :diagnosisDetails, presence: true
    validates :application, presence: true
    validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
    validates :amountUnit, presence: true
    validates :dosage, presence: true, numericality: { greater_than_or_equal_to: 0 }
    validates :applicationDuration, presence: true, numericality: { greater_than_or_equal_to: 0 }
    validates :usageDuration, presence: true, numericality: { greater_than_or_equal_to: 0 }
    validates :usageInstructions, presence: true
 

    private 

    def normalize_fields
      self.indication = indication.strip if indication.present?
      self.diagnosisDetails = diagnosisDetails.strip if diagnosisDetails.present?
      self.application = application.strip if application.present?
      self.amountUnit = amountUnit.strip if amountUnit.present?
      self.usageInstructions = usageInstructions.strip if usageInstructions.present?
    end
end
