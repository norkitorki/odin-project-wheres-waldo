class Findable < ApplicationRecord
  has_and_belongs_to_many :maps
  has_many :coordinates, dependent: :destroy

  def as_json
    super.except("id", "created_at", "updated_at")
  end
end
