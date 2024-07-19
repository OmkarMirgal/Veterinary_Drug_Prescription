class Stable < ApplicationRecord
  belongs_to :user
  has_many :prescriptions, dependent: :destroy
  before_validation :strip_whitespace

  validates :name, presence: true
  validates :location, presence: true, uniqueness: true
  validates :owner, presence: true

  private
  
  def strip_whitespace
    self.name = name.strip if name.present?
    self.location = location.strip if location.present?
    self.owner = owner.strip if owner.present?
  end
end
