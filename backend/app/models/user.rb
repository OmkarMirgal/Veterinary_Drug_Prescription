class User < ApplicationRecord
    has_secure_password

    has_many :stables, dependent: :destroy
    has_many :prescriptions, dependent: :destroy

    before_validation :normalize_fields

    # Validations for other attributes
    validates :name, presence: true
    validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :licence, presence: true, uniqueness: true

    private

    def normalize_fields
      self.name = name.strip if name.present?
      self.email = email.strip.downcase if email.present?
      self.licence = licence.strip if licence.present?
    end

end
