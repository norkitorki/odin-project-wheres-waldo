require 'rails_helper'
require_relative '../support/session_double'

RSpec.describe "Maps", type: :request do
  fixtures :maps, :users

  let (:map) { maps.first }

  describe "GET /maps/:id" do
    it "should set up initial map and game session state" do
      findables = map.findables

      get map_path(map)

      expect(assigns[:map]).to eql(map)
      expect(assigns[:findables]).to eq(findables)
      expect(assigns[:new_user]).to be_a(User)
      expect(session[:game]).to match({
        map: map,
        findables: { count: findables.length, found: 9 },
        score: { start: an_instance_of(Float) }
      })
    end

    context "when user is signed in" do
      include_context 'session double'

      it "should not initialize new user" do
        session_hash[:user] = users.first
        get map_path(map)

        expect(assigns[:new_user]).to be_nil
      end
    end
  end
end
