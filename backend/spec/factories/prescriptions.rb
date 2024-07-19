FactoryBot.define do
  factory :prescription do
    indication { "RESPIRATORY_DISEASE" }
    diagnosisDetails { "Diagnosedetails" }
    application { "FEED" }
    amount { 3 }
    amountUnit { "GRAM" }
    dosage { 2 }
    applicationDate { "2021-11-01" }
    applicationDuration { 15 }
    usageDuration { 15 }
    usageInstructions { "in the Feed" }
    association :user
    # association :stable

    transient do
      stable_id { nil }
    end

    after(:build) do |prescription, evaluator|
      prescription.stable = evaluator.stable_id ? Stable.find(evaluator.stable_id) : create(:stable, user: prescription.user)
    end

  end
end
