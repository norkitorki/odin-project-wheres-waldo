require 'rails_helper'

RSpec.describe "Homes", type: :request do
  describe "GET /" do
    it "should initialize maps state" do
      get root_path

      expect(assigns(:maps)).to_not be_nil
    end
  end
end
