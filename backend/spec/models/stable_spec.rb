require 'rails_helper'

RSpec.describe Stable, type: :model do
  let(:user) { create(:user) }

  describe 'validations' do
    subject { build(:stable, user: user) }

    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:location) }
    it { should validate_uniqueness_of(:location) }
    it { should validate_presence_of(:owner) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:prescriptions).dependent(:destroy) }
  end
end
