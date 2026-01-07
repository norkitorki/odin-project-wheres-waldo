class GameSessionsController < ApplicationController
  include GameSessionsHelper

  def create
    @map = Map.find(params[:map_id])
    reset_game_session

    render json: :ok
  end

  def destroy
    session.delete(:game)

    render json: :ok
  end
end
