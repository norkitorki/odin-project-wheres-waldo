require 'rails_helper'

RSpec.describe Coordinate, type: :model do
  fixtures :coordinates

  it "should find corrdinate by map id and x and y percentages" do
    coordinate = coordinates.first

   expect(Coordinate.find_by_coordinates(coordinate[:map_id], coordinate[:x] - 0.5, coordinate[:y] + 0.5)).to be_a(Coordinate)
  end
end
