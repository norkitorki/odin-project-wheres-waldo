require 'rails_helper'
require_relative '../support/session_double'

RSpec.describe "Findables", type: :request do
  fixtures :findables

  let(:findable) { findables.first }
  let(:coordinate) { findable.coordinates.first }
  let(:headers) { { ACCEPT: "application/json" } }

  describe "GET /findable" do
    context "when session is available" do
      include_context 'session double'

      it "should return findable" do
        params = "map_id=#{coordinate.map[:id]}&name=#{findable[:name]}&x=#{coordinate[:x]}&y=#{coordinate[:y]}"

        session_hash[:game] = { findables: { found: 0 } }
        expect { get "/findable?#{params}", headers: headers }.to change { session_hash[:game][:findables][:found] }.by(1)

        expect(response.content_type).to eq("application/json; charset=utf-8")
        expect(response.body).to eql(findable.to_json)
      end

      context "when no findable was found" do
        it "should return null" do
          get "/findable?map_id=23&name=Wenda", headers: headers

          expect(response.content_type).to eq("application/json; charset=utf-8")
          expect(response.body).to eql("null")
        end
      end

      context "when game session state is unset" do
        it "should return null" do
          params = "map_id=#{coordinate.map[:id]}&name=#{findable[:name]}&x=#{coordinate[:x]}&y=#{coordinate[:y]}"

          get "/findable?#{params}", headers: headers

          expect(response.content_type).to eq("application/json; charset=utf-8")
          expect(response.body).to eql("null")
        end
      end
    end

    context "when session is unavailable" do
      it "should return null" do
        params = "map_id=#{coordinate.map[:id]}&name=#{findable[:name]}&x=#{coordinate[:x]}&y=#{coordinate[:y]}"

        get "/findable?#{params}", headers: headers

        expect(response.content_type).to eq("application/json; charset=utf-8")
        expect(response.body).to eql("null")
      end
    end
  end
end
