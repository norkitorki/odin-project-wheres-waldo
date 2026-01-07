require 'rails_helper'

RSpec.describe "Authentications", type: :request do
  fixtures :users

  let (:user) { users.first }

  describe "POST /authentications" do
    it "should create new user session" do
      post authentications_path, params: { user_token: user.token }

      expect(response).to redirect_to(user)
      expect(response.status).to be(303)
      expect(flash[:notice]).to eql("You have been signed in as #{user.name}")
      expect(session[:user]).to eql(user)
    end

    it "should not create user session with invalid token" do
      post authentications_path, params: { user_token: "1234567890" }

      expect(response).to redirect_to(root_path)
      expect(flash[:notice]).to eql("Unable to find a user with that token")
      expect(session[:user]).to be_nil
    end
  end

  describe "DELETE /authentications" do
    it "should terminate user session" do
      post authentications_path, params: { user_token: user.token }

      expect(session[:user]).to eql(user)
      delete authentications_path

      expect(response).to redirect_to(root_path)
      expect(response.status).to be(303)
      expect(flash[:notice]).to eql("You have been signed out")
      expect(session[:user]).to be_nil
    end
  end
end
