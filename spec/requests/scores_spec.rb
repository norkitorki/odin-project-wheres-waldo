require 'rails_helper'
require_relative '../support/session_double'

RSpec.describe "Scores", type: :request do
  fixtures :maps, :users, :scores

  describe "GET /scores" do
    def hash_matcher(arr, map_id = nil, user_id = nil)
      arr.each do |hash|
        expect(hash).to include(
          "pos" => an_instance_of(Integer),
          "value" => an_instance_of(Float),
          "created" => an_instance_of(String)
        )
        expect(hash["map"]).to include(
          "id" => map_id || an_instance_of(Integer),
          "name" => an_instance_of(String)
        )
        expect(hash["user"]).to include(
          "id" => user_id || an_instance_of(Integer),
          "name" => an_instance_of(String)
        )
      end
    end

    it "should return all scores" do
      get scores_path

      expect(response.content_type).to eq("application/json; charset=utf-8")
      json_data = JSON.parse(response.body)

      expect(json_data.length).to be(scores.length)
      hash_matcher(json_data)
    end

    it "should return scores for a map" do
      map = maps.last

      get "/scores?map_id=#{map.id}"
      json_data = JSON.parse(response.body)

      expect(json_data.length).to be(map.scores.count)
      hash_matcher(json_data)
    end

    it "should return scores for a user" do
      user = users.first

      get "/scores?user_id=#{user.id}"
      json_data = JSON.parse(response.body)

      expect(json_data.length).to be(user.scores.count)
      hash_matcher(json_data, nil, user.id)
    end

    context "when limit parameter is provided" do
      it "should limit number of scores returned" do
        7.times { users.first.scores.create(value: 500.0, map: maps.first) }

        get "/scores?limit=5"
        json_data = JSON.parse(response.body)

        expect(json_data.length).to be(5)
      end

      context "when page parameter is provided" do
        it "should limit and offset scores returned" do
          Score.destroy_all
          user = users.first
          20.times { |i| user.scores.create(value: 100.0 + i, map: maps.first) }

          get "/scores?page=2&limit=10"
          json_data = JSON.parse(response.body)

          expect(json_data.length).to be(10)
          expect(json_data.first["value"]).to be(109.0)
          expect(json_data.last["value"]).to be(100.0)
        end
      end
    end
  end

  describe "GET /score" do
    context "when session is available" do
      include_context 'session double'

      let(:map) { maps.first }
      let(:user) { users.first }
      let(:session_state) do
        {
          game: {
            map: map,
            findables: { count: 5, found: 5 },
            score: { start: Time.now.to_f - 100, value: 960.0 }
          },
          user: user
        }
      end

      it "should return user's current and best score" do
        session_state.each { |k, v| session_hash[k] = v }
        best_score = Score.find_by(map_id: map.id, user_id: user.id).value
        get score_path

        expect(JSON.parse(response.body)).to eql({ "best" => best_score, "value" => 960.0 })
      end

      context "when game is not over" do
        it "should return null" do
          session_state.each { |k, v| session_hash[k] = v }
          session_hash[:game][:findables][:found] = 0

          get score_path

          expect(response.body).to eql("null")
        end
      end

      context "when score value is unset" do
        it "should calculate user score" do
          session_state.each { |k, v| session_hash[k] = v }
          session_hash[:game][:score][:value] = nil

          get score_path

          score = JSON.parse(response.body)["value"]
          expect(score).to be_a(Float).and be_between(899, 901)
        end
      end
    end

    context "when session is unavailable" do
      it "should return null" do
        get score_path

        expect(response.body).to eql("null")
      end
    end
  end

  describe "POST /scores" do
    context "when session is unavailable" do
      it "should return null" do
        post scores_path

        expect(response.body).to eql("null")
      end
    end

    context "when session is available" do
      include_context 'session double'

      let(:map) { maps.first }
      let(:user) { users.first }
      let(:session_state) do
        {
          map: map,
          user_token: user.token,
          score: { "start" => Time.now.to_f - 100, "value" => 960.0, "map_id" => map.id, "user_id" => user.id },
          findables: { "count" => 5, "found" => 5 }
        }
      end

      context "when score session state is unset" do
        it "should return null" do
          session_state.each { |k, v| k == :score ? next : session_hash[k] = v }

          get score_path

          expect(response.body).to eql("null")
        end
      end

      context "when not all findables are found" do
        it "should return null" do
          session_state.each { |k, v| session_hash[k] = v }
          session_state[:findables]["found"] = 3

          get score_path

          expect(response.body).to eql("null")
        end
      end

      context "when map and user session state are unset" do
        it "should return null" do
          session_state.each { |k, v| %i[ map user_token ].include?(k) ? next : session_hash[k] = v }
          get score_path

          expect(response.body).to eql("null")
        end
      end
    end
  end
end
