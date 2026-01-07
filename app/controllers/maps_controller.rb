class MapsController < ApplicationController
  include MapsHelper
  include GameSessionsHelper

  before_action :use_jsx_rendering_defaults
  before_action :set_current_user

  def show
    @map = Map.find(params[:id])
    @findables = @map.findables
    @new_user = User.new unless @current_user
    reset_game_session
  end
end
