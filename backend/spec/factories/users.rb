FactoryBot.define do
  factory :user do
    name { "Test User" }
    sequence(:email) { |n| "user#{n}@gmail.com" }
    password { "password@123" }
    password_confirmation { "password@123" }
    sequence(:licence) { |n| "LIC#{n}ABC" }
  end
end
