require 'rails_helper'

RSpec.describe User, type: :model do
  context "validations" do

    it "is valid with valid attributes" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "is not valid without an email" do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it "is not valid with a duplicate email" do
      create(:user, email: "unique@example.com")
      user = build(:user, email: "unique@example.com")
      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("has already been taken")
    end

    it "is not valid without a password" do
      user = build(:user, password: nil)
      expect(user).not_to be_valid
      expect(user.errors[:password]).to include("can't be blank")
    end

    it "is not valid if password and password_confirmation do not match" do
      user = build(:user, password: "password", password_confirmation: "different")
      expect(user).not_to be_valid
      expect(user.errors[:password_confirmation]).to include("doesn't match Password")
    end

    it "is not valid without a licence" do
      user = build(:user, licence: nil)
      expect(user).not_to be_valid
      expect(user.errors[:licence]).to include("can't be blank")
    end

    it "is not valid with a duplicate licence" do
      create(:user, licence: "LIC123")
      user = build(:user, licence: "LIC123")
      expect(user).not_to be_valid
      expect(user.errors[:licence]).to include("has already been taken")
    end
  end

  context "authentication" do
    it "authenticates with a correct password" do
      user = create(:user)
      authenticated_user = user.authenticate("password@123")
      expect(authenticated_user).to eq(user)
    end

    it "does not authenticate with an incorrect password" do
      user = create(:user)
      authenticated_user = user.authenticate("wrong_password")
      expect(authenticated_user).to be_falsey
    end
  end

  context "when creating multiple users" do
    it "assigns unique emails to each user" do
      user1 = create(:user)
      user2 = create(:user)
      expect(user1.email).not_to eq(user2.email)
    end

    it "assigns unique licence to each user" do
      user1 = create(:user)
      user2 = create(:user)
      expect(user1.licence).not_to eq(user2.licence)
    end
  end
  
end
