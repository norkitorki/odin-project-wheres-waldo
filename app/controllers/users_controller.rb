class UsersController < ApplicationController
  include MapsHelper

  before_action :use_jsx_rendering_defaults
  before_action :set_current_user, except: :create
  before_action :authorize_user, except: :create
  before_action :set_map, only: :create

  def show
    @scores = @current_user.scores.includes(:map)
  end

  def create
    return create_anonymous_score if params[:anonymous]

    @user = User.new(user_params)

    if @user.save
      session[:user] = @user
      create_user_score
      redirect_to "/user?new_user=true"
    else
      @findables = Map.find(@map[:id]).findables
      @new_user = @user
      flash[:user_errors] = @user.errors.full_messages
      render "maps/show", status: :unprocessable_content
    end
  end

  def destroy
    user_name = @current_user.name
    @current_user.destroy
    session.delete(:user)

    redirect_to root_path, notice: "User '#{user_name}' has been deleted"
  end

  private

  def authorize_user
    redirect_to root_path unless user_signed_in?
  end

  def user_params
    params.require(:user).permit(:name)
  end

  def create_user_score
    @user.scores.create(session[:game][:score].merge({ map_id: @map[:id] }).except(:start)) if in_game?
  end

  def create_anonymous_score
    @user = User.find_or_initialize_by(name: "Anon")
    @user.save(validate: false) if @user.new_record?

    create_user_score
    redirect_to scoreboard_path(@map)
  end
end
