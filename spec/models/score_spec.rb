require 'rails_helper'

RSpec.describe Score, type: :model do
  fixtures :scores

  it "should by default order scores by value in descending order" do
    all_scores = Score.all

    expect(Score.order(value: :desc).map(&:value)).to eql(all_scores.map(&:value))
  end

  it "should omit id, created_at, updated_at from json output" do
    score = scores.first

    expect({ "value" => score[:value], "map_id" => score[:map_id], "user_id" => score[:user_id] }).to eql(score.as_json)
  end

  it "should calculate score" do
    created_at = Time.now
    score = Score.new(map: Map.first, created_at: created_at, updated_at: created_at + 140)

    expect(score.calculate_score).to be(860.0)
  end
end
