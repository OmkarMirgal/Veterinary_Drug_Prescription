FactoryBot.define do
  factory :stable do
    name { "Stable1" }
    sequence(:location) { |n| "Chemnitz#{n}" }
    owner { "TestOwner" } 
    association :user
  end
end
