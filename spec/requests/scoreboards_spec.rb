require 'rails_helper'
require_relative '../support/session_double'

RSpec.describe "Scoreboards", type: :request do
  fixtures :maps, :users

  describe "GET /scoreboard/:map_id" do
    let(:map) { maps.first }

    it "should set up the page state" do
      get "/scoreboard/#{map.id}?page=3"

      expect(assigns[:map]).to eql(map)
      expect(assigns[:page]).to be(3)
    end

    context "when user is signed in" do
      include_context 'session double'

      before(:each) { session_hash[:user] = users.first }

      it "should retirieve user's personal best score" do
        get "/scoreboard/#{map.id}"

        expect(assigns[:personal_best]).to be_a(Score)
      end
    end
  end
end
