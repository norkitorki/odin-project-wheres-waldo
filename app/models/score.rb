class Score < ApplicationRecord
  default_scope { order(value: :desc) }

  validates :value, presence: true

  belongs_to :map
  belongs_to :user, optional: true

  def as_json
    super.except("id", "created_at", "updated_at")
  end

  def calculate_score
    (1000.0 - (updated_at - created_at)).truncate(2)
  end
end
