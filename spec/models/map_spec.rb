require 'rails_helper'

RSpec.describe Map, type: :model do
  fixtures :maps

  it "should omit created_at and updated_at from json output" do
    map = maps.first

    expect({ "id" => map[:id], "name" => map[:name] }).to eql(map.as_json)
  end

  context "when name is unset" do
    it "should not save map" do
      map = Map.new

      expect { map.save! }.to raise_error(ActiveRecord::RecordInvalid)
      expect(map.errors.full_messages.first).to eql("Name can't be blank")
    end
  end
end
