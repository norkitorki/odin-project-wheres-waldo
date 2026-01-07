class AuthenticationsController < ApplicationController
  before_action :set_current_user, only: :create

  def create
    set_current_user(authentication_params[:user_token])
    reset_session
    session[:user] = @current_user if @current_user
    notice = @current_user ? "You have been signed in as #{@current_user.name}" : "Unable to find a user with that token"

    redirect_back_or_to @current_user || root_path, notice: notice, status: :see_other
  end

  def destroy
    session.delete(:user)
    reset_session

    redirect_back_or_to root_path, notice: "You have been signed out", status: :see_other
  end

  private

  def authentication_params
    params.permit(:user_token)
  end
end
