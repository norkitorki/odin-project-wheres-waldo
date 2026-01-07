require 'rails_helper'

RSpec.describe Findable, type: :model do
  fixtures :findables

  it "should omit id, created_at and updated_at from json output" do
    findable = findables.first

    expect({ "name" => "Waldo", "type_of" => "character" }).to eql(findable.as_json)
  end
end
