class ScoresController < ApplicationController
  include ScoresHelper
  include MapsHelper

  before_action :set_map, except: :index
  before_action :set_current_user, only: %i[ show create ]

  def index
    map_id = params[:map_id]&.to_i
    user_id = params[:user_id]&.to_i
    page = params[:page]&.to_i || 1
    limit = params[:limit]&.to_i

    scores = Score.includes(:user, :map).joins(:user, :map)
    scores = scores.where(map_id: map_id) if map_id
    scores = scores.where(user_id: user_id) if user_id
    scores = scores.offset(limit * page - limit).limit(limit) if limit

    render json: scores.map.with_index { |s, i| { pos: i + 1, value: s.value, created: s.created_at.strftime("%-d %B %Y %H:%M:%S"), map: s.map, user: s.user } }
  end

  def show
    return render json: nil unless game_over?

    best_score = Score.find_by(map_id: @map[:id], user_id: @current_user.id)&.value if @current_user

    render json: { value: set_value, best: best_score }
  end

  def create
    return render json: nil unless @map && game_over?

    user_score = @current_user&.scores&.find_by(map_id: @map["id"], user_id: @current_user.id)

    if user_score
      user_score.update(value: set_value)
    else
      @score = @current_user.scores.new(value: set_value, map_id: session[:game][:map]["id"])
    end

    render json: user_score || @score.save ? @score : nil
  end

  def destroy
    session[:game][:findables][:found] = 9
    session[:game][:score][:start] = Time.now.to_f

    render plain: "Score deleted"
  end

  private

  def set_value
    @value = session[:game][:score][:value] ||= calculate_score
  end
end
