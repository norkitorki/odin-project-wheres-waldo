class Coordinate < ApplicationRecord
  self.implicit_order_column = [ :map_id ]

  belongs_to :findable
  belongs_to :map

  def self.find_by_coordinates(map_id, x, y)
    find_by("map_id = ? AND x BETWEEN ? AND ? AND y BETWEEN ? AND ?", map_id, x - 1, x + 1, y - 1, y + 1)
  end
end
