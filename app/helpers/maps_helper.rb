module MapsHelper
  private

  def set_map
    @map ||= session[:game]&.dig(:map) || session[:score]&.dig(:map)
  end
end
