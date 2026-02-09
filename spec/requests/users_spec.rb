require 'rails_helper'
require_relative '../support/session_double'

RSpec.describe "Users", type: :request do
  fixtures :users, :maps

  include_context 'session double'

  describe "GET /user" do
    it "should redirect if user is not signed in" do
      get user_path

      expect(response).to redirect_to(root_path)
    end

    it "should render user page" do
      user = users.first
      post authentications_path, params: { user_token: user.token }

      get user_path(user)
      expect(response.status).to be(200)
    end
  end

  describe "POST /users" do
    it "should create and sign in user and create score" do
      session_hash[:game] = {
        map: maps.first,
        score: { value: 950.0 }
      }

      expect { post users_path, params: { user: { name: "test_user" } } }
        .to change { User.count }.by(1)
        .and change { Score.count }.by(1)

      expect(response).to redirect_to("/user?new_user=true")
      expect(session[:user]).to_not be_nil
    end

    it "should not create user without name" do
      session_hash[:game] = { map: maps.first }

      expect do
        post users_path, params: { user: { name: "" } }
      end.to_not change { User.count }


      expect(response).to render_template("maps/show")
      expect(flash[:user_errors].first).to eql("Name can't be blank")
    end

    context "when anonymous parameter is passed" do
      it "should create anonymous score" do
        session_hash[:game] = {
          map: maps.first,
          score: { value: 877.4 }
        }

        expect { post users_path, params: { anonymous: true } }
          .to change { User.count }.by(0)
          .and change { Score.count }.by(1)

        expect(response).to redirect_to("/scoreboard/#{session_hash[:game][:map].id}")
        expect(session[:user]).to be_nil
      end
    end
  end

  describe "DELETE /user" do
    it "should destroy and sign out user" do
      session_hash[:user] = users.first

      expect { delete user_path }.to change { User.count }.by(-1)
      expect(session[:user]).to be_nil
    end
  end
end
