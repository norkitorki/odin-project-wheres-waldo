class User < ApplicationRecord
  validates :name, presence: true, uniqueness: true

  before_create :generate_token

  has_many :scores, dependent: :destroy

  def as_json
    super.except("token", "created_at", "updated_at")
  end

  private

  def generate_token
    begin
      self.token = SecureRandom.hex
    end while self.class.exists?(token: token)
  end
end
