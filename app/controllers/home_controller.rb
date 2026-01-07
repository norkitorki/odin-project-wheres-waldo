class HomeController < ApplicationController
  before_action :use_jsx_rendering_defaults
  before_action :set_current_user

  def index
    @maps = Map.all
  end
end
