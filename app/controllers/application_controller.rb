class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  stale_when_importmap_changes

  before_action :signin_user

  private

  def user_signed_in?
    !session.nil? && session.key?(:user)
  end

  def in_game?
    !session.nil? && session.key?(:game)
  end

  def game_over?
    in_game? && session[:game][:findables][:count] == session[:game][:findables][:found]
  end

  def signin_user
    token = params[:token]
    return unless token

    reset_session
    session[:user] ||= User.find_by(token: token)
    redirect_to user_path, status: :see_other if user_signed_in?
  end

  def set_current_user(token = nil)
    user = session[:user]
    @current_user = user ? User.find(user[:id]) : token && User.find_by(token: token)
  end
end
