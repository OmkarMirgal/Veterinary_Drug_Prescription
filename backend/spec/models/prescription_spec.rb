require 'rails_helper'

RSpec.describe Prescription, type: :model do
  let(:user) { create(:user) }
  let(:stable) { create(:stable, user: user) }
  let(:prescription) { build(:prescription, user: user, stable: stable) }

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:stable) }
  end

  describe 'validations' do
    it { should validate_presence_of(:applicationDate) }
    it { should validate_presence_of(:indication) }
    it { should validate_presence_of(:diagnosisDetails) }
    it { should validate_presence_of(:application) }
    it { should validate_presence_of(:amount) }
    it { should validate_numericality_of(:amount).is_greater_than_or_equal_to(0) }
    it { should validate_presence_of(:amountUnit) }
    it { should validate_presence_of(:dosage) }
    it { should validate_numericality_of(:dosage).is_greater_than_or_equal_to(0) }
    it { should validate_presence_of(:applicationDuration) }
    it { should validate_numericality_of(:applicationDuration).is_greater_than_or_equal_to(0) }
    it { should validate_presence_of(:usageDuration) }
    it { should validate_numericality_of(:usageDuration).is_greater_than_or_equal_to(0) }
    it { should validate_presence_of(:usageInstructions) }

    context 'applicationDate format' do
      it 'allows valid date format' do
        prescription.applicationDate = '2024-07-16'
        expect(prescription).to be_valid
      end

      it 'does not allow invalid date format "16-07-2024"' do
        prescription.applicationDate = '11-02-2026'
        expect(prescription).to be_valid
      end

      it 'does not allow invalid date format "2024/07/16"' do
        prescription.applicationDate = '2022/02/25'
        expect(prescription).to be_valid
      end
    end
  end

  describe 'valid prescription' do
    it 'is valid with valid attributes' do
      expect(prescription).to be_valid
    end

    it 'is not valid without a applicationDate' do
      prescription.applicationDate = nil
      expect(prescription).to_not be_valid
    end

    it 'trims whitespace from necessary fields' do
      prescription.indication = '  RESPIRATORY_DISEASE  '
      prescription.diagnosisDetails = '  Diagnosedetails  '
      prescription.application = '  FEED  '
      prescription.amountUnit = '  GRAM  '
      prescription.usageInstructions = '  in the Feed  '
      prescription.save

      expect(prescription.indication).to eq('RESPIRATORY_DISEASE')
      expect(prescription.diagnosisDetails).to eq('Diagnosedetails')
      expect(prescription.application).to eq('FEED')
      expect(prescription.amountUnit).to eq('GRAM')
      expect(prescription.usageInstructions).to eq('in the Feed')
    end
  end

end
