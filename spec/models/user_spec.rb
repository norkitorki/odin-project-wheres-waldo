require 'rails_helper'

RSpec.describe User, type: :model do
  fixtures :users

  it "should not create users with duplicate names" do
    User.create(name: "test_user")
    duplicate = User.new(name: "test_user")

    expect { duplicate.save! }.to raise_error(ActiveRecord::RecordInvalid)
    expect(duplicate.errors.full_messages.first).to eql("Name has already been taken")
  end

  it "should generate token before creation" do
    user = User.new(name: "test_user")

    expect { user.save }.to change { User.count }.by(1)
    expect(user.token).to_not be_nil
    expect(user.token.length).to be(32)
  end

  it "should omit token, created_at, updated_at from json output" do
    user = users.first

    expect({ "id" => user[:id], "name" => user[:name] }).to eql(user.as_json)
  end
end
