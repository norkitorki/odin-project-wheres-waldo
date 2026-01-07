class ScoreboardsController < ApplicationController
  before_action :use_jsx_rendering_defaults
  before_action :set_current_user

  def show
    @map = Map.find(params[:map_id])
    @page = params[:page]&.to_i || 1
    @personal_best = Score.find_by(map_id: @map.id, user_id: @current_user.id) if @current_user
  end
end
