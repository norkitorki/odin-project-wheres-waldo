class Map < ApplicationRecord
  validates :name, presence: true

  has_and_belongs_to_many :findables
  has_many :coordinates, dependent: :destroy
  has_many :scores, dependent: :destroy

  def as_json
    super.except("created_at", "updated_at")
  end
end
