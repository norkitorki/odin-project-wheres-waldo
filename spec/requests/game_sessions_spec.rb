require 'rails_helper'

RSpec.describe "GameSessions", type: :request do
  fixtures :maps

  let(:headers) { { ACCEPT: "application/json" } }

  describe "POST /game_sessions" do
    it "should create game session state" do
      map = maps.first

      post "#{game_sessions_path}/#{map.id}", headers: headers

      expect(session[:game]).to match({
        map: map,
        findables: { count: map.findables.count, found: 0 },
        score: { start: an_instance_of(Float) }
      })
    end

    context "when map_id is not provided" do
      it "should not create game session state" do
        post game_sessions_path, headers: headers

        expect(session[:game]).to be_nil
      end
    end
  end

  describe "DELETE /game_sessions" do
    it "should delete game session state" do
      map = maps.first

      post "#{game_sessions_path}/#{map.id}", headers: headers

      expect { delete game_sessions_path }.to change { session[:game] }.to(nil)
    end
  end
end
